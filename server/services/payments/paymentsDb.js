const connection = require("../../db/connection-wrapper");
const paymentsQuery = require("../../sql/query/paymentsQuery");
const logger = require("../../utils/logger");

const getPayments = async (familyId, vacationId) => {
  try {
    const sql = paymentsQuery.getPayments(vacationId);
    return await connection.executeWithParameters(sql, [familyId]);
  } catch (error) {
    logger.error(`Error: getPayments: ${error.sqlMessage}`);
    throw error;
  }
};

const getPaymentsSummary = async (vacationId) => {
  try {
    const sql = paymentsQuery.getPaymentsSummary(vacationId);
    return await connection.executeWithParameters(sql, []);
  } catch (error) {
    logger.error(`Error: getPaymentsSummary: ${error.sqlMessage}`);
    throw error;
  }
};

const addPayment = async (payment, vacationId) => {
  try {
    const sql = paymentsQuery.addPayment(vacationId);
    return await connection.executeWithParameters(sql, [
      payment.familyId,
      payment.userId || null,
      payment.amount,
      payment.paymentMethod,
      payment.paymentDate,
      payment.notes || null,
      payment.receipt ? 1 : 0,
      payment.status || "completed",
    ]);
  } catch (error) {
    logger.error(`Error: addPayment: ${error.sqlMessage}`);
    throw error;
  }
};

const updatePayment = async (payment, vacationId) => {
  try {
    const sql = paymentsQuery.updatePayment(vacationId);
    return await connection.executeWithParameters(sql, [
      payment.amount,
      payment.paymentMethod,
      payment.paymentDate,
      payment.notes || null,
      payment.receipt ? 1 : 0,
      payment.status || "completed",
      payment.id,
      payment.familyId,
    ]);
  } catch (error) {
    logger.error(`Error: updatePayment: ${error.sqlMessage}`);
    throw error;
  }
};

const deletePayment = async (paymentId, vacationId) => {
  try {
    const sql = paymentsQuery.deletePayment(vacationId);
    return await connection.executeWithParameters(sql, [paymentId]);
  } catch (error) {
    logger.error(`Error: deletePayment: ${error.sqlMessage}`);
    throw error;
  }
};

// ── Gateway / provider functions ─────────────────────────────────────────────

const getProviderConfig = async () => {
  try {
    const sql = paymentsQuery.getProviderConfig();
    const result = await connection.executeWithParameters(sql, []);
    return result[0] || null;
  } catch (error) {
    logger.error(`Error: getProviderConfig: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const saveProviderConfig = async (data) => {
  try {
    const sql = paymentsQuery.saveProviderConfig();
    return await connection.executeWithParameters(sql, [
      'cardcom',
      data.terminalNumber || '',
      data.apiName || '',
      data.businessName || null,
      data.vatNumber || null,
      data.invoiceDocType || 'Receipt',
      data.businessType || 'exempt_dealer',
      data.invoiceEmailEnabled ? 1 : 0,
      data.invoiceNotes || null,
      data.isTestMode ? 1 : 0,
    ]);
  } catch (error) {
    logger.error(`Error: saveProviderConfig: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const addPendingGatewayPayment = async (vacationId, { familyId, userId, amount, paymentDate }) => {
  try {
    const sql = paymentsQuery.addPayment(vacationId);
    return await connection.executeWithParameters(sql, [
      familyId,
      userId || null,
      amount,
      'כרטיס אשראי',
      paymentDate,
      null,
      0,
      'pending',
    ]);
  } catch (error) {
    logger.error(`Error: addPendingGatewayPayment: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

/**
 * Dynamically update gateway-related columns on a payment row.
 * Only the fields present in the `fields` object are updated.
 */
const updatePaymentGatewayFields = async (vacationId, paymentId, fields) => {
  try {
    const columnMap = {
      paymentGateway: 'payment_gateway',
      lowProfileCode: 'low_profile_code',
      paymentUrl: 'payment_url',
      approvalNumber: 'approval_number',
      cardLastFour: 'card_last_four',
      cardOwnerName: 'card_owner_name',
      invoiceNumber: 'invoice_number',
      webhookReceivedAt: 'webhook_received_at',
      status: 'status',
    };

    const setClauses = [];
    const params = [];

    for (const [key, col] of Object.entries(columnMap)) {
      if (fields[key] !== undefined) {
        setClauses.push(`${col} = ?`);
        params.push(fields[key] ?? null);
      }
    }

    if (!setClauses.length) return null;

    params.push(paymentId);
    const sql = `UPDATE trip_tracker_${vacationId}.payments SET ${setClauses.join(', ')} WHERE id = ?`;
    return await connection.executeWithParameters(sql, params);
  } catch (error) {
    logger.error(`Error: updatePaymentGatewayFields: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getPaymentById = async (vacationId, paymentId) => {
  try {
    const sql = `SELECT * FROM trip_tracker_${vacationId}.payments WHERE id = ? LIMIT 1`;
    const result = await connection.executeWithParameters(sql, [Number(paymentId)]);
    return result[0] || null;
  } catch (error) {
    logger.error(`Error: getPaymentById: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

module.exports = {
  getPayments,
  getPaymentsSummary,
  addPayment,
  updatePayment,
  deletePayment,
  getProviderConfig,
  saveProviderConfig,
  addPendingGatewayPayment,
  updatePaymentGatewayFields,
  getPaymentById,
};
