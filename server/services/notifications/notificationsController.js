'use strict';

const router = require('express').Router();
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
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
    next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle notifications request", error));
  }
});

// DELETE /notifications  — clear all (global feed). Registered before /:id so
// the bare collection path isn't swallowed by the param route.
router.delete('/', async (req, res, next) => {
  try {
    await notificationsService.deleteAll();
    res.send({ success: true });
  } catch (error) {
    next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle notifications request", error));
  }
});

// DELETE /notifications/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await notificationsService.deleteOne(req.params.id);
    res.send({ success: true });
  } catch (error) {
    next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle notifications request", error));
  }
});

module.exports = router;
