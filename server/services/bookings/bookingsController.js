'use strict';

const router = require('express').Router();
const bookingsService = require('./bookingsService');

// GET /bookings/:vacationId — all families with submission status
router.get('/:vacationId', async (req, res, next) => {
  const { vacationId } = req.params;
  try {
    const data = await bookingsService.getAllStatus(vacationId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// GET /bookings/:vacationId/:familyId — full submission + guests array
router.get('/:vacationId/:familyId', async (req, res, next) => {
  const { vacationId, familyId } = req.params;
  try {
    const data = await bookingsService.getByFamily(vacationId, familyId);
    res.json(data || null);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
