'use strict';

const router = require('express').Router();
const leadsDb = require('./leadsDb');
const notificationsService = require('../notifications/notificationsService');
const { getIO } = require('../../socketServer');
const mysql = require('mysql2/promise');

/**
 * Looks up the vacation name from the shared trip_tracker.vacations table.
 * Returns null if not found (non-fatal).
 */
const getVacationName = async (vacationId) => {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    const [rows] = await conn.query(
      'SELECT name FROM trip_tracker.vacations WHERE vacation_id = ? LIMIT 1',
      [vacationId]
    );
    return rows[0]?.name || null;
  } catch {
    return null;
  } finally {
    if (conn) await conn.end();
  }
};

// POST /public/leads/:vacationId  — no auth required
router.post('/leads/:vacationId', async (req, res, next) => {
  const { vacationId } = req.params;
  const { full_name, phone, email, family_size, notes } = req.body;

  if (!full_name?.trim()) {
    return res.status(400).send({ message: 'שם מלא הוא שדה חובה' });
  }

  try {
    // Insert lead into the vacation-specific DB
    const result = await leadsDb.create(vacationId, {
      full_name: full_name.trim(),
      phone: phone || null,
      email: email || null,
      family_size: family_size || 1,
      status: 'new_interest',
      source: 'website',
      notes: notes || null,
    });

    const insertId = result.insertId;

    // Look up vacation name for the notification
    const vacationName = await getVacationName(vacationId);

    // Create persisted notification in shared DB
    let notification = null;
    try {
      notification = await notificationsService.create({
        vacation_id: vacationId,
        vacation_name: vacationName,
        type: 'new_lead',
        title: 'ליד חדש הגיע',
        message: full_name.trim(),
        entity_id: insertId,
        entity_type: 'lead',
      });
    } catch (notifErr) {
      // Non-fatal — lead was saved, notification creation failed
      console.error('Failed to create notification:', notifErr.message);
    }

    // Emit real-time event to all connected coordinators
    const io = getIO();
    if (io && notification) {
      io.to('coordinators').emit('new_lead', notification);
    }

    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
