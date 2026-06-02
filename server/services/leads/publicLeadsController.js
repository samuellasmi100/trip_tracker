'use strict';

const router = require('express').Router();
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
const leadsService = require('./leadsService');
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
    // Insert-or-flip with dedup (phone OR email) in the vacation-specific DB.
    // isReturning=true means an existing lead matched and was flipped to
    // 'returning' instead of inserting a duplicate.
    const { lead, isReturning } = await leadsService.createPublic(vacationId, {
      full_name: full_name.trim(),
      phone: phone || null,
      email: email || null,
      family_size: family_size || 1,
      status: 'new_interest',
      source: 'website',
      notes: notes || null,
    });

    // Look up vacation name for the notification
    const vacationName = await getVacationName(vacationId);

    // Create persisted notification in shared DB
    let notification = null;
    try {
      notification = await notificationsService.create({
        vacation_id: vacationId,
        vacation_name: vacationName,
        // Reuses the existing notifications.type column (no new column) to drive
        // the client colour in Step 3: 'new_lead' → green, 'returning_lead' → red.
        type: isReturning ? 'returning_lead' : 'new_lead',
        title: isReturning ? 'ליד חוזר הגיע' : 'ליד חדש הגיע',
        message: full_name.trim(),
        entity_id: lead.lead_id,
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
    next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle publicLeads request", error));
  }
});

module.exports = router;
