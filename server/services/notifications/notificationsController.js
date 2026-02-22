'use strict';

const router = require('express').Router();
const notificationsService = require('./notificationsService');

// GET /notifications  — all notifications (latest 100)
router.get('/', async (req, res, next) => {
  try {
    const rows = await notificationsService.getAll();
    res.send(rows);
  } catch (error) {
    next(error);
  }
});

// PUT /notifications/read  — mark all as read
router.put('/read', async (req, res, next) => {
  try {
    await notificationsService.markAllRead();
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

// DELETE /notifications/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await notificationsService.deleteOne(req.params.id);
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
