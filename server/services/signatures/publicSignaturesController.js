'use strict';

const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const signaturesService = require('./signaturesService');
const notificationsService = require('../notifications/notificationsService');
const { getIO } = require('../../socketServer');
const mysql = require('mysql2/promise');

const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads');

/**
 * Fetches vacation name + agreement_text from the shared trip_tracker DB.
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
      'SELECT name, agreement_text FROM trip_tracker.vacations WHERE vacation_id = ? LIMIT 1',
      [vacationId]
    );
    return rows[0] || null;
  } catch {
    return null;
  } finally {
    if (conn) await conn.end();
  }
};

// GET /public/sign/:vacationId/:docToken
router.get('/sign/:vacationId/:docToken', async (req, res, next) => {
  const { vacationId, docToken } = req.params;
  try {
    const family = await signaturesService.getFamilyByToken(vacationId, docToken);
    if (!family) {
      return res.status(404).json({ message: 'קישור לא תקין או שפג תוקפו' });
    }

    const vacInfo = await getVacationInfo(vacationId);
    const existingSig = await signaturesService.getSignatureByFamily(vacationId, family.family_id);

    res.json({
      familyName: family.family_name,
      agreementText: vacInfo?.agreement_text || null,
      alreadySigned: !!existingSig,
      signedAt: existingSig?.signed_at || null,
      signerName: existingSig?.signer_name || null,
    });
  } catch (error) {
    next(error);
  }
});

// POST /public/sign/:vacationId/:docToken
router.post('/sign/:vacationId/:docToken', async (req, res, next) => {
  const { vacationId, docToken } = req.params;
  const { signerName, signatureData } = req.body;

  if (!signerName?.trim()) {
    return res.status(400).json({ message: 'שם החותם הוא שדה חובה' });
  }
  if (!signatureData) {
    return res.status(400).json({ message: 'חתימה נדרשת' });
  }

  try {
    const family = await signaturesService.getFamilyByToken(vacationId, docToken);
    if (!family) {
      return res.status(404).json({ message: 'קישור לא תקין' });
    }

    // Prevent duplicate signatures
    const existing = await signaturesService.getSignatureByFamily(vacationId, family.family_id);
    if (existing) {
      return res.status(409).json({ message: 'המשפחה כבר חתמה' });
    }

    // Decode base64 PNG and save to disk
    const base64Data = signatureData.replace(/^data:image\/png;base64,/, '');
    const timestamp = Date.now();
    const sigDir = path.join(uploadsFolder, vacationId, 'signatures', family.family_id);
    fs.mkdirSync(sigDir, { recursive: true });
    const fileName = `sig_${timestamp}.png`;
    const filePath = path.join(sigDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null;

    const result = await signaturesService.insertSignature(vacationId, {
      family_id: family.family_id,
      signer_name: signerName.trim(),
      signature_image_path: filePath,
      ip_address: ipAddress,
    });

    const insertId = result.insertId;
    const vacInfo = await getVacationInfo(vacationId);

    // Create persisted notification in shared DB
    let notification = null;
    try {
      notification = await notificationsService.create({
        vacation_id: vacationId,
        vacation_name: vacInfo?.name || null,
        type: 'new_signature',
        title: 'חתימה חדשה התקבלה',
        message: signerName.trim(),
        entity_id: insertId,
        entity_type: 'signature',
      });
    } catch (notifErr) {
      console.error('Failed to create signature notification:', notifErr.message);
    }

    // Emit real-time event to all connected coordinators
    const io = getIO();
    if (io && notification) {
      io.to('coordinators').emit('new_signature', notification);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
