'use strict';

const getAgreementText = () =>
  `SELECT agreement_text FROM trip_tracker.vacations WHERE vacation_id = ? LIMIT 1`;

const updateAgreementText = () =>
  `UPDATE trip_tracker.vacations SET agreement_text = ? WHERE vacation_id = ?`;

const getFlightCompanies = () =>
  `SELECT * FROM trip_tracker.flight_companies ORDER BY name`;

const addFlightCompany = () =>
  `INSERT INTO trip_tracker.flight_companies (name) VALUES (?)`;

const deleteFlightCompany = () =>
  `DELETE FROM trip_tracker.flight_companies WHERE id = ?`;

module.exports = { getAgreementText, updateAgreementText, getFlightCompanies, addFlightCompany, deleteFlightCompany };
