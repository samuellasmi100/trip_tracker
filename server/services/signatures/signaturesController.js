'use strict';

const router = require('express').Router();
const signaturesService = require('./signaturesService');

// GET /signatures/:vacationId — all families' signature status
router.get('/:vacationId', async (req, res, next) => {
  const { vacationId } = req.params;
  try {
    const data = await signaturesService.getAllStatus(vacationId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// GET /signatures/:vacationId/:familyId — single family signature
router.get('/:vacationId/:familyId', async (req, res, next) => {
  const { vacationId, familyId } = req.params;
  try {
    const sig = await signaturesService.getSignatureByFamily(vacationId, familyId);
    res.json(sig || null);
  } catch (error) {
    next(error);
  }
});

// POST /signatures/send/:vacationId/:familyId — mark as sent (sets signature_sent_at)
router.post('/send/:vacationId/:familyId', async (req, res, next) => {
  const { vacationId, familyId } = req.params;
  try {
    await signaturesService.setSentAt(vacationId, familyId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// DELETE /signatures/:vacationId/:familyId — delete signature record
router.delete('/:vacationId/:familyId', async (req, res, next) => {
  const { vacationId, familyId } = req.params;
  try {
    await signaturesService.deleteSignature(vacationId, familyId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
