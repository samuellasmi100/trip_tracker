const router = require("express").Router();
const paymentsService = require("./paymentsService");

// ── Provider config routes (no vacationId — register before /:vacationId) ────

// GET /payments/provider
router.get("/provider", async (req, res, next) => {
  try {
    const config = await paymentsService.getProviderConfig();
    res.json(config || null);
  } catch (error) {
    next(error);
  }
});

// POST /payments/provider
router.post("/provider", async (req, res, next) => {
  try {
    await paymentsService.saveProviderConfig(req.body);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ── Per-vacation summary / family routes ─────────────────────────────────────

// GET /payments/:vacationId/summary  — per-family totals for the widget
router.get("/:vacationId/summary", async (req, res, next) => {
  try {
    const response = await paymentsService.getPaymentsSummary(req.params.vacationId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /payments/:vacationId/family/:familyId  — all payments for one family
router.get("/:vacationId/family/:familyId", async (req, res, next) => {
  try {
    const response = await paymentsService.getPayments(
      req.params.familyId,
      req.params.vacationId
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ── Gateway session routes ────────────────────────────────────────────────────

// POST /payments/:vacationId/init-session  — create Cardcom iframe session
router.post("/:vacationId/init-session", async (req, res, next) => {
  try {
    const result = await paymentsService.initPaymentSession(
      req.params.vacationId,
      req.body
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /payments/:vacationId/create-link  — create shareable Cardcom link
router.post("/:vacationId/create-link", async (req, res, next) => {
  try {
    const result = await paymentsService.createPaymentLink(
      req.params.vacationId,
      req.body
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /payments/:vacationId/verify/:id  — re-verify payment status with Cardcom
router.post("/:vacationId/verify/:id", async (req, res, next) => {
  try {
    const result = await paymentsService.verifyPayment(
      req.params.vacationId,
      req.params.id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ── Manual CRUD routes ────────────────────────────────────────────────────────

// POST /payments/:vacationId  — add one payment
router.post("/:vacationId", async (req, res, next) => {
  try {
    const response = await paymentsService.addPayment(req.body, req.params.vacationId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /payments/:vacationId/:paymentId  — update a payment
router.put("/:vacationId/:paymentId", async (req, res, next) => {
  try {
    const response = await paymentsService.updatePayment(
      { ...req.body, id: req.params.paymentId },
      req.params.vacationId
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /payments/:vacationId/:paymentId  — delete a payment
router.delete("/:vacationId/:paymentId", async (req, res, next) => {
  try {
    const response = await paymentsService.deletePayment(
      req.params.paymentId,
      req.params.vacationId
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ── Webhook handler (exported for public route registration in index.js) ─────

const webhookHandler = async (req, res, next) => {
  try {
    const result = await paymentsService.handlePaymentWebhook(req);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = router;
module.exports.webhookHandler = webhookHandler;
