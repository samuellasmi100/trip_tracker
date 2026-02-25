'use strict';

const express = require('express');
const router  = express.Router();
const dashboardService = require('./dashboardService');

// GET /dashboard/cross?ids=id1,id2,...
// Must be registered BEFORE /:vacationId
router.get('/cross', async (req, res, next) => {
  try {
    const ids = (req.query.ids || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length < 2) return res.json({ families: [] });
    const families = await dashboardService.getCrossVacationFamilies(ids);
    res.json({ families });
  } catch (err) {
    next(err);
  }
});

// GET /dashboard/:vacationId
router.get('/:vacationId', async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary(req.params.vacationId);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
