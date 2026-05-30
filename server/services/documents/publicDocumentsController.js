'use strict';

const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const documentsService = require('./documentsService');
const notificationsService = require('../notifications/notificationsService');
const { getIO } = require('../../socketServer');
const logger = require('../../utils/logger');
const { DocumentsError } = documentsService;

// In-memory upload — the buffer is streamed straight to R2 (no local disk).
const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new DocumentsError('BAD_FILE', 'סוג קובץ לא נתמך. ניתן להעלות PDF, JPG, PNG בלבד.'));
};
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Codes the family-head client may display verbatim; everything else → 500.
const STATUS_FOR_CODE = {
  TOKEN_NOT_FOUND:     404,
  NOT_FOUND:           404,
  BAD_FORMAT:          400,
  BAD_FILE:            400,
  INVALID_MEMBER:      400,
  INVALID_DOC_TYPE:    400,
  SIGNED_FORM_LOCKED:  403,
  HEAD_GUEST_NO_PHONE: 400,
  WRONG_PHONE:         401,
  VERIFY_REQUIRED:     401,
  VERIFY_EXPIRED:      401,
  VERIFY_MISMATCH:     401,
};

// HEAD_GUEST_NO_PHONE detail is coordinator-facing; the public side gets a
// neutral message (the original is still logged server-side).
const PUBLIC_NEUTRAL_MESSAGES = {
  HEAD_GUEST_NO_PHONE: 'הקישור אינו תקין, פנה למשרד',
};

const handleServiceError = (error, res) => {
  if (error instanceof DocumentsError && STATUS_FOR_CODE[error.code]) {
    return res.status(STATUS_FOR_CODE[error.code]).json({
      code: error.code,
      message: PUBLIC_NEUTRAL_MESSAGES[error.code] || error.message,
    });
  }
  logger.error(
    `publicDocumentsController unexpected error: ${error?.stack || error?.message || error}`
  );
  return res.status(500).json({ code: 'INTERNAL', message: 'שגיאה זמנית, נסה שוב מאוחר יותר' });
};

// 5 verify attempts per 15 minutes, keyed by IP + doc_token (mirrors the
// registration verify limiter).
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => `${req.ip}:${req.params.docToken}`,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    code: 'RATE_LIMITED',
    message: 'יותר מדי ניסיונות אימות, נסה שוב מאוחר יותר',
  }),
});

// Best-effort realtime nudge to coordinators — never blocks/rolls back a write.
const emitDocEvent = (event, payload) => {
  try {
    const io = getIO();
    if (io) io.to('coordinators').emit(event, payload);
  } catch (e) {
    logger.warn(`publicDocumentsController socket emit (${event}) failed: ${e.message}`);
  }
};

// GET /public/documents/:vacationId/:docToken — no-leak load (verify screen).
router.get('/documents/:vacationId/:docToken', async (req, res) => {
  try {
    const { vacationId, docToken } = req.params;
    const info = await documentsService.getPublicInfo(vacationId, docToken);
    res.json(info);
  } catch (error) {
    handleServiceError(error, res);
  }
});

// POST /public/documents/:vacationId/:docToken/verify   body: { lastFourDigits }
router.post('/documents/:vacationId/:docToken/verify', verifyLimiter, async (req, res) => {
  try {
    const { vacationId, docToken } = req.params;
    const result = await documentsService.verifyPhone(vacationId, docToken, req.body?.lastFourDigits);
    res.json(result);
  } catch (error) {
    handleServiceError(error, res);
  }
});

// GET /public/documents/:vacationId/:docToken/file/:docId?verifyToken=...
// Presigned URL so the verified family head can view a doc they uploaded.
// verifyToken via query so a plain GET (window.open / new tab) can carry it.
router.get('/documents/:vacationId/:docToken/file/:docId', async (req, res) => {
  try {
    const { vacationId, docToken, docId } = req.params;
    const verifyToken = req.query?.verifyToken;
    const info = await documentsService.getPublicDownloadInfo(vacationId, docToken, verifyToken, docId);
    if (info.code === 'NOT_FOUND') {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'מסמך לא נמצא' });
    }
    res.json({ url: info.url, fileName: info.fileName });
  } catch (error) {
    handleServiceError(error, res);
  }
});

// POST /public/documents/:vacationId/:docToken/upload
// multipart: file + fields { verifyToken, user_id, doc_type_id }
router.post('/documents/:vacationId/:docToken/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return handleServiceError(err, res);
    try {
      const { vacationId, docToken } = req.params;
      if (!req.file) throw new DocumentsError('BAD_FILE', 'לא סופק קובץ');

      const { verifyToken, user_id } = req.body;
      const result = await documentsService.uploadDocument(vacationId, docToken, verifyToken, {
        userId: user_id,
        docTypeId: parseInt(req.body.doc_type_id, 10),
        buffer: req.file.buffer,
        originalName: req.file.originalname,
      });

      // Live X/Y refetch for coordinators — one per file is fine (idempotent).
      // The coordinator BELL notification is NOT fired here: uploads are staged
      // and committed as a batch, so a single detailed notification is fired
      // once per save via the /notify endpoint below.
      emitDocEvent('document_uploaded', {
        vacationId, familyId: result.familyId, userId: result.userId, docTypeId: result.docTypeId,
      });

      // docId = the current family_documents row for this slot (insert or
      // overwrite) so the client can enable in-session delete without re-verify.
      // replaced lets the batch notification distinguish new vs updated files.
      res.json({ success: true, docId: result.docId, replaced: result.replaced });
    } catch (error) {
      handleServiceError(error, res);
    }
  });
});

// POST /public/documents/:vacationId/:docToken/notify
// Fired ONCE by the client after a save batch commits. Creates ONE detailed
// coordinator notification summarizing the batch (best-effort) and emits it on
// new_document for the bell/toast. body: { verifyToken, items:[{userId,docTypeId,replaced}] }
router.post('/documents/:vacationId/:docToken/notify', async (req, res) => {
  try {
    const { vacationId, docToken } = req.params;
    const { verifyToken, items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ success: true });
    }
    const payload = await documentsService.buildBatchNotification(vacationId, docToken, verifyToken, items);
    // Best-effort persistence + emit — mirrors the registration submit block;
    // a failure here never affects the already-committed uploads.
    let notification = null;
    try { notification = await notificationsService.create(payload); }
    catch (notifErr) { logger.warn(`new_document batch notification create failed: ${notifErr.message}`); }
    if (notification) emitDocEvent('new_document', notification);
    res.json({ success: true });
  } catch (error) {
    handleServiceError(error, res);
  }
});

// DELETE /public/documents/:vacationId/:docToken/:docId
// verifyToken via body or query (so a DELETE without a body still works).
router.delete('/documents/:vacationId/:docToken/:docId', async (req, res) => {
  try {
    const { vacationId, docToken, docId } = req.params;
    const verifyToken = req.body?.verifyToken || req.query?.verifyToken;
    const result = await documentsService.deletePublicDocument(vacationId, docToken, verifyToken, docId);

    emitDocEvent('document_deleted', {
      vacationId, familyId: result.familyId, userId: result.userId, docTypeId: result.docTypeId,
    });
    res.json({ success: true });
  } catch (error) {
    handleServiceError(error, res);
  }
});

module.exports = router;
