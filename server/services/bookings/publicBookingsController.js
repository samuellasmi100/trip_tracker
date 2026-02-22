'use strict';

const router = require('express').Router();
const mysql = require('mysql2/promise');
const bookingsService = require('./bookingsService');
const notificationsService = require('../notifications/notificationsService');
const { getIO } = require('../../socketServer');

/**
 * Fetches vacation name from the shared trip_tracker DB.
 * Returns null on error (non-fatal).
 */
const getVacationInfo = async (vacationId) => {
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
    return rows[0] || null;
  } catch {
    return null;
  } finally {
    if (conn) await conn.end();
  }
};

// GET /public/booking/:vacationId/:docToken
router.get('/booking/:vacationId/:docToken', async (req, res, next) => {
  const { vacationId, docToken } = req.params;
  try {
    const family = await bookingsService.getFamilyByToken(vacationId, docToken);
    if (!family) {
      return res.status(404).json({ message: 'קישור לא תקין או שפג תוקפו' });
    }

    const vacInfo = await getVacationInfo(vacationId);
    const existing = await bookingsService.getExistingSubmission(vacationId, family.family_id);

    let existingData = null;
    if (existing) {
      const guests = await bookingsService.getGuestsBySubmission(vacationId, existing.id);
      existingData = { ...existing, guests };
    }

    res.json({
      familyName: family.family_name,
      vacationName: vacInfo?.name || null,
      alreadySubmitted: !!existing,
      existing: existingData,
    });
  } catch (error) {
    next(error);
  }
});

// POST /public/booking/:vacationId/:docToken
router.post('/booking/:vacationId/:docToken', async (req, res, next) => {
  const { vacationId, docToken } = req.params;
  const body = req.body;

  if (!body.contactName?.trim()) {
    return res.status(400).json({ message: 'שם מלא הוא שדה חובה' });
  }

  try {
    const family = await bookingsService.getFamilyByToken(vacationId, docToken);
    if (!family) {
      return res.status(404).json({ message: 'קישור לא תקין' });
    }

    // Prevent duplicate submissions
    const existing = await bookingsService.getExistingSubmission(vacationId, family.family_id);
    if (existing) {
      return res.status(409).json({ message: 'טופס ההזמנה כבר הוגש' });
    }

    // Insert submission
    const result = await bookingsService.insertSubmission(vacationId, {
      family_id: family.family_id,
      contact_name: body.contactName.trim(),
      contact_phone: body.contactPhone?.trim() || null,
      contact_email: body.contactEmail?.trim() || null,
      contact_address: body.contactAddress?.trim() || null,
      payment_preference: body.paymentPreference || null,
      special_requests: body.specialRequests?.trim() || null,
    });

    const insertId = result.insertId;

    // Insert guests
    const guests = Array.isArray(body.guests) ? body.guests : [];
    for (let i = 0; i < guests.length; i++) {
      await bookingsService.insertGuest(vacationId, insertId, guests[i], i);
    }

    // Create persisted notification in shared DB
    const vacInfo = await getVacationInfo(vacationId);
    let notification = null;
    try {
      notification = await notificationsService.create({
        vacation_id: vacationId,
        vacation_name: vacInfo?.name || null,
        type: 'new_booking',
        title: 'טופס הזמנה חדש התקבל',
        message: body.contactName.trim(),
        entity_id: insertId,
        entity_type: 'booking',
      });
    } catch (notifErr) {
      console.error('Failed to create booking notification:', notifErr.message);
    }

    // Emit real-time event to all connected coordinators
    const io = getIO();
    if (io && notification) {
      io.to('coordinators').emit('new_booking', notification);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
