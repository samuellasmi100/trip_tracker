'use strict';

const connection = require('../../db/connection-wrapper');
const q = require('./notificationsQuery');
const logger = require('../../utils/logger');

const getAll = async () => {
  try {
    return await connection.execute(q.getAll());
  } catch (error) {
    logger.error(`notificationsDb.getAll: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getUnread = async () => {
  try {
    return await connection.execute(q.getUnread());
  } catch (error) {
    logger.error(`notificationsDb.getUnread: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const create = async ({ vacation_id, vacation_name, type, title, message, entity_id, entity_type }) => {
  try {
    const sql = q.create();
    const result = await connection.executeWithParameters(sql, [
      vacation_id,
      vacation_name || null,
      type || 'new_lead',
      title,
      message || null,
      entity_id || null,
      entity_type || null,
    ]);
    return result;
  } catch (error) {
    logger.error(`notificationsDb.create: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const markAllRead = async () => {
  try {
    return await connection.execute(q.markAllRead());
  } catch (error) {
    logger.error(`notificationsDb.markAllRead: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const deleteOne = async (id) => {
  try {
    return await connection.executeWithParameters(q.deleteOne(), [id]);
  } catch (error) {
    logger.error(`notificationsDb.deleteOne: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

module.exports = { getAll, getUnread, create, markAllRead, deleteOne };
