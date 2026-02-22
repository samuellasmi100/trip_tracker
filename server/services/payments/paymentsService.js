const paymentsDb = require("./paymentsDb");
const gatewayRouter = require("../paymentGateway/gatewayRouter");
const logger = require("../../utils/logger");

const getPayments       = (familyId, vacationId) => paymentsDb.getPayments(familyId, vacationId);
const getPaymentsSummary = (vacationId)           => paymentsDb.getPaymentsSummary(vacationId);
const addPayment        = (payment, vacationId)   => paymentsDb.addPayment(payment, vacationId);
const updatePayment     = (payment, vacationId)   => paymentsDb.updatePayment(payment, vacationId);
const deletePayment     = (paymentId, vacationId) => paymentsDb.deletePayment(paymentId, vacationId);

// ── Provider config ──────────────────────────────────────────────────────────

const getProviderConfig = () => paymentsDb.getProviderConfig();

const saveProviderConfig = (data) => paymentsDb.saveProviderConfig(data);

// ── Helper: resolve terminal credentials (test mode uses Cardcom test account) ──

function resolveCredentials(config) {
  if (config.is_test_mode) {
    return { terminalNumber: '1000', apiName: 'CardTest1994' };
  }
  return { terminalNumber: config.terminal_number, apiName: config.api_name };
}

// ── initPaymentSession ───────────────────────────────────────────────────────

const initPaymentSession = async (vacationId, params) => {
  const config = await paymentsDb.getProviderConfig();
  if (!config) throw new Error('Payment provider not configured');

  const { familyId, userId, amount, description } = params;
  const today = new Date().toISOString().split('T')[0];

  // 1. Insert pending payment row to get a real paymentId
  const insertResult = await paymentsDb.addPendingGatewayPayment(vacationId, {
    familyId,
    userId,
    amount,
    paymentDate: today,
  });
  const paymentId = insertResult.insertId;

  // 2. Build URLs
  const baseUrl = process.env.SERVER_BASE_URL || 'http://localhost:4000';
  const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
  const webhookUrl = `${baseUrl}/payments/webhook?vacId=${vacationId}&paymentId=${paymentId}`;
  const successUrl = `${clientBaseUrl}/payment-success`;
  const errorUrl   = `${clientBaseUrl}/payment-error`;

  // 3. Create Cardcom iframe session
  const creds = resolveCredentials(config);
  const sessionResult = await gatewayRouter.initSession(creds, {
    amount: Number(amount),
    orderId: paymentId,
    webhookUrl,
    successUrl,
    errorUrl,
    description: description || `תשלום - ${vacationId}`,
    isIframe: true,
  });

  if (!sessionResult.success) {
    throw new Error(`Cardcom error (${sessionResult.responseCode}): ${sessionResult.description}`);
  }

  // 4. Store gateway data on the payment row
  await paymentsDb.updatePaymentGatewayFields(vacationId, paymentId, {
    paymentGateway: 'cardcom',
    lowProfileCode: sessionResult.lowProfileCode,
    paymentUrl: sessionResult.url,
  });

  return { url: sessionResult.url, paymentId };
};

// ── createPaymentLink ────────────────────────────────────────────────────────

const createPaymentLink = async (vacationId, params) => {
  const config = await paymentsDb.getProviderConfig();
  if (!config) throw new Error('Payment provider not configured');

  const { familyId, userId, amount, description } = params;
  const today = new Date().toISOString().split('T')[0];

  const insertResult = await paymentsDb.addPendingGatewayPayment(vacationId, {
    familyId,
    userId,
    amount,
    paymentDate: today,
  });
  const paymentId = insertResult.insertId;

  const baseUrl = process.env.SERVER_BASE_URL || 'http://localhost:4000';
  const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
  const webhookUrl = `${baseUrl}/payments/webhook?vacId=${vacationId}&paymentId=${paymentId}`;
  const successUrl = `${clientBaseUrl}/payment-success`;
  const errorUrl   = `${clientBaseUrl}/payment-error`;

  const creds = resolveCredentials(config);
  const sessionResult = await gatewayRouter.initSession(creds, {
    amount: Number(amount),
    orderId: paymentId,
    webhookUrl,
    successUrl,
    errorUrl,
    description: description || `תשלום - ${vacationId}`,
    isIframe: false,
  });

  if (!sessionResult.success) {
    throw new Error(`Cardcom error (${sessionResult.responseCode}): ${sessionResult.description}`);
  }

  await paymentsDb.updatePaymentGatewayFields(vacationId, paymentId, {
    paymentGateway: 'cardcom',
    lowProfileCode: sessionResult.lowProfileCode,
    paymentUrl: sessionResult.url,
  });

  return { url: sessionResult.url, paymentId };
};

// ── handlePaymentWebhook ─────────────────────────────────────────────────────

const handlePaymentWebhook = async (req) => {
  const { vacId, paymentId } = req.query;

  if (!vacId || !paymentId) {
    logger.error('Webhook: missing vacId or paymentId in query');
    return { ok: false, reason: 'missing params' };
  }

  const config = await paymentsDb.getProviderConfig();
  if (!config) {
    logger.error('Webhook: no provider config found');
    return { ok: false, reason: 'no provider config' };
  }

  const payment = await paymentsDb.getPaymentById(vacId, paymentId);
  if (!payment) {
    logger.error(`Webhook: payment ${paymentId} not found in vacation ${vacId}`);
    return { ok: false, reason: 'payment not found' };
  }

  const lowProfileCode = payment.low_profile_code || req.body?.LowProfileCode;
  if (!lowProfileCode) {
    logger.error('Webhook: no LowProfileCode available');
    return { ok: false, reason: 'no low profile code' };
  }

  const creds = resolveCredentials(config);
  const verifyResult = await gatewayRouter.verifyPayment(creds, lowProfileCode);

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await paymentsDb.updatePaymentGatewayFields(vacId, paymentId, {
    status: verifyResult.success ? 'completed' : 'cancelled',
    approvalNumber: verifyResult.approvalNumber || null,
    cardLastFour: verifyResult.cardLastFour || null,
    cardOwnerName: verifyResult.cardOwnerName || null,
    invoiceNumber: verifyResult.invoiceNumber || null,
    webhookReceivedAt: now,
  });

  if (verifyResult.success) {
    try {
      const { getIO } = require('../../socketServer');
      const io = getIO();
      if (io) {
        io.to('coordinators').emit('payment_completed', {
          paymentId: Number(paymentId),
          vacationId: vacId,
          approvalNumber: verifyResult.approvalNumber,
          cardLastFour: verifyResult.cardLastFour,
        });
      }
    } catch (socketErr) {
      logger.error(`Webhook: socket emit failed: ${socketErr.message}`);
    }
  }

  logger.info(`Webhook: payment ${paymentId} → ${verifyResult.success ? 'completed' : 'cancelled'}`);
  return { ok: true };
};

// ── verifyPayment ────────────────────────────────────────────────────────────

const verifyPayment = async (vacationId, paymentId) => {
  const config = await paymentsDb.getProviderConfig();
  if (!config) throw new Error('No provider config');

  const payment = await paymentsDb.getPaymentById(vacationId, paymentId);
  if (!payment || !payment.low_profile_code) {
    return { status: payment?.status || 'unknown' };
  }

  if (payment.status === 'completed') {
    return { status: 'completed' };
  }

  const creds = resolveCredentials(config);
  const result = await gatewayRouter.verifyPayment(creds, payment.low_profile_code);

  if (result.success) {
    await paymentsDb.updatePaymentGatewayFields(vacationId, paymentId, {
      status: 'completed',
      approvalNumber: result.approvalNumber || null,
      cardLastFour: result.cardLastFour || null,
      cardOwnerName: result.cardOwnerName || null,
      invoiceNumber: result.invoiceNumber || null,
    });
  }

  return { status: result.success ? 'completed' : payment.status };
};

module.exports = {
  getPayments,
  getPaymentsSummary,
  addPayment,
  updatePayment,
  deletePayment,
  getProviderConfig,
  saveProviderConfig,
  initPaymentSession,
  createPaymentLink,
  handlePaymentWebhook,
  verifyPayment,
};
