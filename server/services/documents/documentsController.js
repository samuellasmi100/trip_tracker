'use strict';

const router = require('express').Router();
const documentsService = require('./documentsService');
const documentsDb = require('./documentsDb');

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
    next(error);
  }
});

// DELETE /documents/types/:vacationId/:typeId — remove a document type
router.delete('/types/:vacationId/:typeId', async (req, res, next) => {
  try {
    const { vacationId, typeId } = req.params;
    await documentsService.deleteDocumentType(vacationId, typeId);
    res.json({ success: true });
  } catch (error) {
    next(error);
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

// DELETE /documents/:vacationId/:docId — delete a document
router.delete('/:vacationId/:docId', async (req, res, next) => {
  try {
    const { vacationId, docId } = req.params;
    await documentsService.deleteDocument(vacationId, docId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
