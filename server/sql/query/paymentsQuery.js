const getPayments = (vacationId) => {
  return `
    SELECT
      id,
      family_id           AS familyId,
      user_id             AS userId,
      amount,
      payment_method      AS paymentMethod,
      DATE_FORMAT(payment_date, '%Y-%m-%d') AS paymentDate,
      notes,
      receipt,
      status,
      payment_gateway     AS paymentGateway,
      low_profile_code    AS lowProfileCode,
      card_last_four      AS cardLastFour,
      approval_number     AS approvalNumber,
      card_owner_name     AS cardOwnerName,
      created_at          AS createdAt
    FROM trip_tracker_${vacationId}.payments
    WHERE family_id = ?
    ORDER BY payment_date DESC, created_at DESC
  `;
};

const getPaymentsSummary = (vacationId) => {
  return `
    SELECT
      f.family_id                                                              AS familyId,
      f.family_name                                                            AS familyName,
      REPLACE(f.total_amount, ',', '')                                         AS totalAmount,
      COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) AS paidAmount,
      COUNT(CASE WHEN p.status = 'completed' THEN 1 END)                      AS paymentCount,
      MAX(p.payment_date)                                                      AS lastPaymentDate
    FROM trip_tracker_${vacationId}.families f
    LEFT JOIN trip_tracker_${vacationId}.payments p ON f.family_id = p.family_id
    GROUP BY f.family_id, f.family_name, f.total_amount
    ORDER BY f.family_name
  `;
};

const addPayment = (vacationId) => {
  return `
    INSERT INTO trip_tracker_${vacationId}.payments
      (family_id, user_id, amount, payment_method, payment_date, notes, receipt, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
};

const updatePayment = (vacationId) => {
  return `
    UPDATE trip_tracker_${vacationId}.payments
    SET
      amount         = ?,
      payment_method = ?,
      payment_date   = ?,
      notes          = ?,
      receipt        = ?,
      status         = ?
    WHERE id = ? AND family_id = ?
  `;
};

const deletePayment = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.payments WHERE id = ?`;
};

// ── Provider config (shared DB) ─────────────────────────────────────────────

const getProviderConfig = () => {
  return `
    SELECT *
    FROM trip_tracker.payment_provider_configs
    WHERE is_active = 1
    ORDER BY id ASC
    LIMIT 1
  `;
};

const saveProviderConfig = () => {
  return `
    INSERT INTO trip_tracker.payment_provider_configs
      (provider_type, terminal_number, api_name, business_name, vat_number,
       invoice_doc_type, business_type, invoice_email_enabled, invoice_notes, is_test_mode, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE
      terminal_number       = VALUES(terminal_number),
      api_name              = VALUES(api_name),
      business_name         = VALUES(business_name),
      vat_number            = VALUES(vat_number),
      invoice_doc_type      = VALUES(invoice_doc_type),
      business_type         = VALUES(business_type),
      invoice_email_enabled = VALUES(invoice_email_enabled),
      invoice_notes         = VALUES(invoice_notes),
      is_test_mode          = VALUES(is_test_mode),
      updated_at            = CURRENT_TIMESTAMP
  `;
};

module.exports = {
  getPayments,
  getPaymentsSummary,
  addPayment,
  updatePayment,
  deletePayment,
  getProviderConfig,
  saveProviderConfig,
};
