'use strict';

const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const documentsService = require('./documentsService');

const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { vacationId, docToken } = req.params;
    // We'll set family_id after token lookup in the route, so cache it on req
    // For now use a temp path — overridden below via req.familyId set before multer
    const familyId = req.familyId || 'unknown';
    const dir = path.join(uploadsFolder, vacationId, 'docs', familyId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const timestamp = Date.now();
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    cb(null, `${base}_${timestamp}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('סוג קובץ לא נתמך. ניתן להעלות PDF, JPG, PNG בלבד.'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /public/documents/:vacationId/:docToken
router.get('/documents/:vacationId/:docToken', async (req, res, next) => {
  try {
    const { vacationId, docToken } = req.params;
    const data = await documentsService.getPublicUploadPage(vacationId, docToken);
    if (!data) {
      return res.status(404).json({ message: 'קישור לא תקין או שפג תוקפו' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// POST /public/documents/:vacationId/:docToken/upload
// Multer needs family_id on req before it picks the destination.
// We do a pre-lookup middleware, then attach multer.
router.post('/documents/:vacationId/:docToken/upload', async (req, res, next) => {
  try {
    const { vacationId, docToken } = req.params;
    // Resolve family first so multer can use req.familyId
    const data = await documentsService.getPublicUploadPage(vacationId, docToken);
    if (!data) {
      return res.status(404).json({ message: 'קישור לא תקין' });
    }
    req.familyId = data.family.family_id;

    // Run multer inline
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'לא סופק קובץ' });
      }

      const { user_id, doc_type_id } = req.body;
      if (!user_id || !doc_type_id) {
        return res.status(400).json({ message: 'חסרים שדות חובה: user_id, doc_type_id' });
      }

      const result = await documentsService.uploadDocument(vacationId, {
        family_id: data.family.family_id,
        user_id,
        doc_type_id: parseInt(doc_type_id, 10),
        file_name: req.file.filename,
        file_path: req.file.path,
      });

      res.json({ success: true, insertId: result.insertId });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
