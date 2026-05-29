'use strict';

// All notifications live in the shared trip_tracker database

const getAll = () => `
  SELECT *
  FROM trip_tracker.notifications
  ORDER BY created_at DESC
  LIMIT 100;
`;

const getUnread = () => `
  SELECT *
  FROM trip_tracker.notifications
  WHERE is_read = 0
  ORDER BY created_at DESC;
`;

const create = () => `
  INSERT INTO trip_tracker.notifications
    (vacation_id, vacation_name, type, title, message, entity_id, entity_type)
  VALUES (?, ?, ?, ?, ?, ?, ?);
`;

const markAllRead = () => `
  UPDATE trip_tracker.notifications
  SET is_read = 1
  WHERE is_read = 0;
`;

const deleteOne = () => `
  DELETE FROM trip_tracker.notifications WHERE id = ?;
`;

// Clear-all: notifications are a global coordinator feed (shared DB, not
// per-user), so this wipes the whole feed — same scope as markAllRead.
const deleteAll = () => `
  DELETE FROM trip_tracker.notifications;
`;

module.exports = { getAll, getUnread, create, markAllRead, deleteOne, deleteAll };
