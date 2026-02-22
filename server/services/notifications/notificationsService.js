'use strict';

const db = require('./notificationsDb');

const getAll = async () => db.getAll();

const getUnread = async () => db.getUnread();

const create = async (data) => {
  const result = await db.create(data);
  // Return the newly created row
  const rows = await db.getAll();
  return rows.find(r => r.id === result.insertId) || null;
};

const markAllRead = async () => db.markAllRead();

const deleteOne = async (id) => db.deleteOne(id);

module.exports = { getAll, getUnread, create, markAllRead, deleteOne };
