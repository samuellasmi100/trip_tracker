'use strict';

const router = require('express').Router();
const ErrorMessage = require('../../serverLogs/errorMessage');
const ErrorType = require('../../serverLogs/errorType');
const registrationsService = require('./registrationsService');
const { RegistrationError } = registrationsService;

// Service-error codes that the client should display verbatim and recover from.
// Anything not in this set is treated as a true server error (next()'d to the
// error handler middleware).
const CLIENT_RECOVERABLE = new Set([
  'NO_FAMILY',
  'NO_MAIN_GUEST',
  'HEAD_GUEST_NO_PHONE',
  'MISSING_FAMILY_ID',
  'ALREADY_SIGNED',
]);

// ALREADY_SIGNED is the only conflict-with-existing-state case; the rest are
// pure 400 input-validation problems. Default is 400.
const STATUS_FOR_CODE = {
  ALREADY_SIGNED: 409,
};

// POST /registrations/:vacationId — body: { familyId }
// Issues (or reuses) a 1-day registration link for the family's head of household.
router.post('/:vacationId', async (req, res, next) => {
  const { vacationId } = req.params;
  const familyId = req.body?.familyId;

  if (!familyId || typeof familyId !== 'string' || familyId.trim() === '') {
    return res.status(400).json({ code: 'MISSING_FAMILY_ID', message: 'familyId חסר' });
  }

  try {
    const result = await registrationsService.createLink(vacationId, familyId.trim());
    return res.json(result);
  } catch (error) {
    if (error instanceof RegistrationError && CLIENT_RECOVERABLE.has(error.code)) {
      return res.status(STATUS_FOR_CODE[error.code] || 400).json({ code: error.code, message: error.message });
    }
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, 'Failed to handle registrations request', error));
  }
});

module.exports = router;
