'use strict';

const axios = require('axios');
const BASE = 'https://secure.cardcom.solutions/api/v11/LowProfile';

/**
 * Create a Cardcom LowProfile payment session.
 * Returns { success, lowProfileCode, url, responseCode, description, rawResponse }
 */
async function createLowProfile({
  terminalNumber,
  apiName,
  amount,
  orderId,
  webhookUrl,
  successUrl,
  errorUrl,
  description,
  numOfPayments = 1,
  invoiceConfig = null,
  isIframe = true,
}) {
  const payload = {
    TerminalNumber: String(terminalNumber),
    ApiName: String(apiName),
    ReturnValue: String(orderId),
    Amount: Number(amount),
    NumOfPayments: numOfPayments,
    IsDocumentNeedSigniture: false,
    WebHookUrl: webhookUrl,
    SuccessRedirectUrl: successUrl,
    ErrorRedirectUrl: errorUrl,
    ProductName: description || 'תשלום טיול',
    UIDefinition: { isIframe },
  };

  if (invoiceConfig) payload.Document = invoiceConfig;

  try {
    const res = await axios.post(`${BASE}/Create`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    const data = res.data;
    return {
      success: data.ResponseCode === 0,
      lowProfileCode: data.LowProfileCode,
      url: data.Url,
      responseCode: data.ResponseCode,
      description: data.Description,
      rawResponse: data,
    };
  } catch (err) {
    throw new Error(`Cardcom createLowProfile failed: ${err.message}`);
  }
}

/**
 * Query the result of a LowProfile transaction.
 * Returns { success, approvalNumber, cardLastFour, cardOwnerName, cardBrand, invoiceNumber, responseCode, rawResponse }
 */
async function getLowProfileResult({ terminalNumber, apiName, lowProfileCode }) {
  const payload = {
    TerminalNumber: String(terminalNumber),
    ApiName: String(apiName),
    LowProfileCode: String(lowProfileCode),
  };

  try {
    const res = await axios.post(`${BASE}/GetLpResult`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    const data = res.data;
    return {
      success: data.ResponseCode === 0,
      approvalNumber: data.ApprovalNumber || null,
      cardLastFour: data.Last4Digits || null,
      cardOwnerName: data.CardOwnerName || null,
      cardBrand: data.CardBrand || null,
      invoiceNumber: data.InvoiceResponse?.InvoiceNumber || null,
      responseCode: data.ResponseCode,
      rawResponse: data,
    };
  } catch (err) {
    throw new Error(`Cardcom getLowProfileResult failed: ${err.message}`);
  }
}

module.exports = { createLowProfile, getLowProfileResult };
