'use strict';

const getFamilyByToken = (vacationId) =>
  `SELECT family_id, family_name, doc_token FROM \`trip_tracker_${vacationId}\`.families WHERE doc_token = ? LIMIT 1`;

const getExistingSubmission = (vacationId) =>
  `SELECT id, contact_name, contact_phone, contact_email, contact_address, payment_preference, special_requests, submitted_at
   FROM \`trip_tracker_${vacationId}\`.booking_submissions
   WHERE family_id = ? ORDER BY id DESC LIMIT 1`;

const getGuestsBySubmission = (vacationId) =>
  `SELECT * FROM \`trip_tracker_${vacationId}\`.booking_guests WHERE submission_id = ? ORDER BY sort_order, id`;

const insertSubmission = (vacationId) =>
  `INSERT INTO \`trip_tracker_${vacationId}\`.booking_submissions
   (family_id, contact_name, contact_phone, contact_email, contact_address, payment_preference, special_requests)
   VALUES (?, ?, ?, ?, ?, ?, ?)`;

const insertGuest = (vacationId) =>
  `INSERT INTO \`trip_tracker_${vacationId}\`.booking_guests
   (submission_id, full_name_he, full_name_en, passport_number, passport_expiry, date_of_birth, gender, food_preference, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const getAllStatus = (vacationId) =>
  `SELECT f.family_id, f.family_name, bs.id AS submission_id, bs.contact_name, bs.submitted_at
   FROM \`trip_tracker_${vacationId}\`.families f
   LEFT JOIN \`trip_tracker_${vacationId}\`.booking_submissions bs
     ON bs.family_id = f.family_id
     AND bs.id = (SELECT MAX(id) FROM \`trip_tracker_${vacationId}\`.booking_submissions WHERE family_id = f.family_id)
   ORDER BY f.family_name`;

const getByFamily = (vacationId) =>
  `SELECT id, contact_name, contact_phone, contact_email, contact_address, payment_preference, special_requests, submitted_at
   FROM \`trip_tracker_${vacationId}\`.booking_submissions
   WHERE family_id = ? ORDER BY id DESC LIMIT 1`;

module.exports = {
  getFamilyByToken,
  getExistingSubmission,
  getGuestsBySubmission,
  insertSubmission,
  insertGuest,
  getAllStatus,
  getByFamily,
};
