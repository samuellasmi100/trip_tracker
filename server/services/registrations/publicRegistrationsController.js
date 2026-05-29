'use strict';

const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const registrationsService = require('../registrations/registrationsService');
const notificationsService = require('../notifications/notificationsService');
const { getIO } = require('../../socketServer');
const logger = require('../../utils/logger');
const { RegistrationError } = registrationsService;

// Codes the client should display verbatim. Everything else → 500 via the
// shared error handler.
const CLIENT_RECOVERABLE = new Set([
  'TOKEN_NOT_FOUND',
  'EXPIRED',
  'CANCELLED',
  'ALREADY_SIGNED',
  'BAD_FORMAT',
  'WRONG_PHONE',
  'HEAD_GUEST_NO_PHONE',
  'VERIFY_REQUIRED',
  'VERIFY_EXPIRED',
  'VERIFY_MISMATCH',
  'BAD_SIGNATURE',
  'NOT_PENDING',
  // STEP 5 — server-configuration / generation errors. Surfaced with a code so
  // the operator can debug from the network tab; not 400 because they're not
  // a client mistake.
  'DOC_TYPE_MISSING',
  'PDF_GENERATION_FAILED',
]);

const STATUS_FOR_CODE = {
  TOKEN_NOT_FOUND:        404,
  EXPIRED:                410,
  CANCELLED:              410,
  ALREADY_SIGNED:         409,
  NOT_PENDING:            409,
  BAD_FORMAT:             400,
  BAD_SIGNATURE:          400,
  VERIFY_REQUIRED:        401,
  VERIFY_EXPIRED:         401,
  VERIFY_MISMATCH:        401,
  WRONG_PHONE:            401,
  HEAD_GUEST_NO_PHONE:    400,
  DOC_TYPE_MISSING:       500,
  PDF_GENERATION_FAILED:  500,
};

// 5 verify attempts per 15 minutes, keyed by IP + token. The token in the URL
// prevents one bad actor from burning the budget across many families they
// don't know about; the IP scoping prevents one rogue victim from getting
// their own genuine attempts blocked by someone else's brute force.
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => `${req.ip}:${req.params.token}`,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    code: 'RATE_LIMITED',
    message: 'יותר מדי ניסיונות אימות, נסה שוב מאוחר יותר',
  }),
});

// Same x-forwarded-for handling as publicSignaturesController.js — left-most
// hop, trimmed. Falls back to req.socket.remoteAddress.
const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
  req.socket?.remoteAddress ||
  null;

// Codes whose original Hebrew message is coordinator-facing (debug detail)
// and must NOT be exposed on the public endpoints. The original message is
// still logged via the service-layer logger; what the family-head sees is
// the neutral wording below. With createLink's stricter phone_b check, the
// public side should not normally reach HEAD_GUEST_NO_PHONE — this is a
// defensive backstop for an edit-after-link-issued race.
const PUBLIC_NEUTRAL_MESSAGES = {
  HEAD_GUEST_NO_PHONE: 'הקישור אינו תקין, פנה למשרד',
};

const handleServiceError = (error, res, next) => {
  if (error instanceof RegistrationError && CLIENT_RECOVERABLE.has(error.code)) {
    const message = PUBLIC_NEUTRAL_MESSAGES[error.code] || error.message;
    return res.status(STATUS_FOR_CODE[error.code] || 400).json({
      code: error.code,
      message,
    });
  }
  // Unknown / unexpected error on a PUBLIC route. The detailed error is
  // logged server-side; the family-head opening the link gets a neutral
  // Hebrew message + a stable code they can quote to support. Crucially
  // we don't fall through to the generic error-handler middleware here
  // because its "Something went wrong" message gives the public user
  // no signal that this is a server-side problem, not a "fix your input".
  logger.error(
    `publicRegistrationsController unexpected error: ${error?.stack || error?.message || error}`
  );
  return res.status(500).json({
    code: 'INTERNAL',
    message: 'שגיאה זמנית, נסה שוב מאוחר יותר',
  });
};

// GET /public/register/:vacationId/:token
router.get('/register/:vacationId/:token', async (req, res, next) => {
  const { vacationId, token } = req.params;
  try {
    const info = await registrationsService.getPublicInfo(vacationId, token);
    return res.json(info);
  } catch (error) {
    return handleServiceError(error, res, next);
  }
});

// POST /public/register/:vacationId/:token/verify    body: { lastFourDigits }
router.post('/register/:vacationId/:token/verify', verifyLimiter, async (req, res, next) => {
  const { vacationId, token } = req.params;
  const { lastFourDigits } = req.body || {};
  try {
    const result = await registrationsService.verifyPhone(vacationId, token, lastFourDigits);
    return res.json(result);
  } catch (error) {
    return handleServiceError(error, res, next);
  }
});

// POST /public/register/:vacationId/:token/submit
// body: { verifyToken, signatureData (data:image/png;base64,...), clientInputs: {address, city, postal_code, general_notes} }
router.post('/register/:vacationId/:token/submit', async (req, res, next) => {
  const { vacationId, token } = req.params;
  const { verifyToken, signatureData, clientInputs } = req.body || {};
  try {
    const result = await registrationsService.submitRegistration(vacationId, token, {
      verifyToken,
      signatureData,
      clientInputs,
      signerIp:  getClientIp(req),
      userAgent: req.headers['user-agent'] || null,
    });

    // Side-effects strictly AFTER the registration has been committed —
    // mirrors publicSignaturesController.js:111-131. Both blocks are
    // best-effort: a failure here logs and moves on; the client still
    // sees a successful submit. Failure to notify must never roll back a
    // signed registration.
    let notification = null;
    try {
      notification = await notificationsService.create({
        vacation_id:   vacationId,
        vacation_name: result.vacationName || null,
        type:          'new_registration',
        title:         'טופס רישום חתום',
        message:       `טופס הרישום חתום התקבל מאת: ${result.headFirstName || ''}`,
        entity_id:     result.registrationId,
        entity_type:   'registration',
      });
    } catch (notifErr) {
      logger.warn(`new_registration notification create failed: ${notifErr.message}`);
    }

    try {
      const io = getIO();
      if (io && notification) {
        io.to('coordinators').emit('new_registration', notification);
      }
    } catch (sockErr) {
      logger.warn(`new_registration socket emit failed: ${sockErr.message}`);
    }

    return res.json(result);
  } catch (error) {
    return handleServiceError(error, res, next);
  }
});

module.exports = router;
