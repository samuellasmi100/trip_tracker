'use strict';

/**
 * gatewayRouter — thin abstraction over payment providers.
 * Currently supports only Cardcom. Future providers (PayMe, etc.) can be added here.
 */

const cardcomService = require('../cardcom/cardcomService');

/**
 * Initiate a payment session.
 * @param {{ terminalNumber, apiName }} config
 * @param {{ amount, orderId, webhookUrl, successUrl, errorUrl, description, numOfPayments, isIframe }} params
 */
const initSession = async (config, params) => {
  return cardcomService.createLowProfile({
    terminalNumber: config.terminalNumber || config.terminal_number,
    apiName: config.apiName || config.api_name,
    amount: params.amount,
    orderId: params.orderId,
    webhookUrl: params.webhookUrl,
    successUrl: params.successUrl,
    errorUrl: params.errorUrl,
    description: params.description,
    numOfPayments: params.numOfPayments || 1,
    isIframe: params.isIframe !== false,
  });
};

/**
 * Verify the result of a completed payment session.
 * @param {{ terminalNumber, apiName }} config
 * @param {string} lowProfileCode
 */
const verifyPayment = async (config, lowProfileCode) => {
  return cardcomService.getLowProfileResult({
    terminalNumber: config.terminalNumber || config.terminal_number,
    apiName: config.apiName || config.api_name,
    lowProfileCode,
  });
};

module.exports = { initSession, verifyPayment };
