const router = require('express').Router();
const leadsService = require('./leadsService');

// GET /leads/summary/:vacationId
router.get('/summary/:vacationId', async (req, res, next) => {
  try {
    const response = await leadsService.getSummary(req.params.vacationId);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

// GET /leads/:vacationId/:leadId  — single lead with notes
router.get('/:vacationId/:leadId', async (req, res, next) => {
  try {
    const lead = await leadsService.getById(req.params.vacationId, req.params.leadId);
    if (!lead) return res.status(404).send({ message: 'Lead not found' });
    res.send(lead);
  } catch (error) {
    next(error);
  }
});

// GET /leads/:vacationId  — all leads
router.get('/:vacationId', async (req, res, next) => {
  try {
    const response = await leadsService.getAll(req.params.vacationId);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

// POST /leads/:vacationId
router.post('/:vacationId', async (req, res, next) => {
  try {
    const lead = await leadsService.create(req.params.vacationId, req.body);
    const all = await leadsService.getAll(req.params.vacationId);
    res.send(all);
  } catch (error) {
    next(error);
  }
});

// PUT /leads/:vacationId/:leadId
router.put('/:vacationId/:leadId', async (req, res, next) => {
  try {
    await leadsService.update(req.params.vacationId, req.params.leadId, req.body);
    const all = await leadsService.getAll(req.params.vacationId);
    res.send(all);
  } catch (error) {
    next(error);
  }
});

// POST /leads/:vacationId/:leadId/notes
router.post('/:vacationId/:leadId/notes', async (req, res, next) => {
  try {
    const { note_text, created_by } = req.body;
    const notes = await leadsService.addNote(
      req.params.vacationId,
      req.params.leadId,
      note_text,
      created_by
    );
    res.send(notes);
  } catch (error) {
    next(error);
  }
});

// DELETE /leads/:vacationId/:leadId
router.delete('/:vacationId/:leadId', async (req, res, next) => {
  try {
    await leadsService.remove(req.params.vacationId, req.params.leadId);
    const all = await leadsService.getAll(req.params.vacationId);
    res.send(all);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
