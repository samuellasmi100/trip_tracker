'use strict';

const router = require('express').Router();
const settingsDb = require('./settingsDb');

// ── Static routes (no :vacationId param) — registered FIRST ────────────────

// GET /settings/flight-companies
router.get('/flight-companies', async (req, res, next) => {
  try {
    const rows = await settingsDb.getFlightCompanies();
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// POST /settings/flight-companies
router.post('/flight-companies', async (req, res, next) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'name is required' });
  }
  try {
    const result = await settingsDb.addFlightCompany(name.trim());
    res.status(201).json({ id: result.insertId, name: name.trim() });
  } catch (error) {
    next(error);
  }
});

// DELETE /settings/flight-companies/:id
router.delete('/flight-companies/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await settingsDb.deleteFlightCompany(id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ── Vacation-scoped routes ─────────────────────────────────────────────────

// GET /settings/:vacationId/agreement
router.get('/:vacationId/agreement', async (req, res, next) => {
  const { vacationId } = req.params;
  try {
    const row = await settingsDb.getAgreementText(vacationId);
    res.json({ agreement_text: row?.agreement_text || null });
  } catch (error) {
    next(error);
  }
});

// PUT /settings/:vacationId/agreement
router.put('/:vacationId/agreement', async (req, res, next) => {
  const { vacationId } = req.params;
  const { agreement_text } = req.body;
  try {
    await settingsDb.updateAgreementText(vacationId, agreement_text);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
