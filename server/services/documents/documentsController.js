'use strict';

const router = require('express').Router();
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
const documentsService = require('./documentsService');
const documentsDb = require('./documentsDb');
const { getIO } = require('../../socketServer');
const logger = require('../../utils/logger');

// ── Document-type routes (must come before /:vacationId to avoid param collision) ──

// GET /documents/types/:vacationId — get document types
router.get('/types/:vacationId', async (req, res, next) => {
  try {
    const types = await documentsDb.getDocumentTypes(req.params.vacationId);
    res.json(types);
  } catch (error) {
    next(error);
  }
});

// POST /documents/types/:vacationId — add a document type
router.post('/types/:vacationId', async (req, res, next) => {
  try {
    const result = await documentsService.addDocumentType(req.params.vacationId, req.body);
    res.json({ success: true, insertId: result.insertId });
  } catch (error) {
    next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle documents request", error));
  }
});

// DELETE /documents/types/:vacationId/:typeId — remove a document type
router.delete('/types/:vacationId/:typeId', async (req, res, next) => {
  try {
    const { vacationId, typeId } = req.params;
    await documentsService.deleteDocumentType(vacationId, typeId);
    res.json({ success: true });
  } catch (error) {
    next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle documents request", error));
  }
});

// GET /documents/link/:vacationId/:familyId — return doc_token for URL generation
router.get('/link/:vacationId/:familyId', async (req, res, next) => {
  try {
    const { vacationId, familyId } = req.params;
    const docToken = await documentsService.getFamilyLink(vacationId, familyId);
    res.json({ docToken });
  } catch (error) {
    next(error);
  }
});

// ── Document routes ──────────────────────────────────────────────────────────

// GET /documents/:vacationId — all families status
router.get('/:vacationId', async (req, res, next) => {
  try {
    const data = await documentsService.getAllFamiliesStatus(req.params.vacationId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// GET /documents/:vacationId/family/:familyId — one family's docs
router.get('/:vacationId/family/:familyId', async (req, res, next) => {
  try {
    const { vacationId, familyId } = req.params;
    const data = await documentsService.getFamilyDocuments(vacationId, familyId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// GET /documents/:vacationId/:docId/download-url
// All documents live on R2 (file_path = object key), so every type presigns a
// GET URL through this endpoint (always with a safe forced content-type).
//   - default: 15-minute expiry, attachment (direct download by the coordinator)
//   - ?share=true: 7-day expiry (forwarded via WhatsApp/email to a recipient)
//   - ?inline=true: inline disposition so the file renders in a new tab instead
//                   of downloading (safe — content-type is always PDF/JPEG/PNG)
// 7 days is the AWS S3 / R2 maximum for presigned URLs.
const SHARE_EXPIRY_S = 7 * 24 * 60 * 60;
router.get('/:vacationId/:docId/download-url', async (req, res, next) => {
  try {
    const { vacationId, docId } = req.params;
    const expiresIn = req.query.share === 'true' ? SHARE_EXPIRY_S : undefined;
    const disposition = req.query.inline === 'true' ? 'inline' : undefined;
    const info = await documentsService.getDownloadInfo(vacationId, docId, { expiresIn, disposition });
    if (info.code === 'NOT_FOUND') {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'מסמך לא נמצא' });
    }
    res.json({ url: info.url, fileName: info.fileName });
  } catch (error) {
    next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle documents download", error));
  }
});

// DELETE /documents/:vacationId/:docId — delete a document (DB row + R2 object)
router.delete('/:vacationId/:docId', async (req, res, next) => {
  try {
    const { vacationId, docId } = req.params;
    const removed = await documentsService.deleteDocument(vacationId, docId);
    // Best-effort realtime nudge — never blocks/rolls back the delete.
    if (removed) {
      try {
        const io = getIO();
        if (io) io.to('coordinators').emit('document_deleted', {
          vacationId, familyId: removed.familyId, userId: removed.userId, docTypeId: removed.docTypeId,
        });
      } catch (e) {
        logger.warn(`documentsController document_deleted emit failed: ${e.message}`);
      }
    }
    res.json({ success: true });
  } catch (error) {
    next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle documents request", error));
  }
});

module.exports = router;
