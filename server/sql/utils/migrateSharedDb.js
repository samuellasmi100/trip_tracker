'use strict';

/**
 * migrateSharedDb — runs at server startup.
 * Creates any missing tables in the shared `trip_tracker` database.
 * All steps are idempotent (check before act).
 */
const mysql = require('mysql2/promise');

const migrateSharedDb = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    // [1] notifications table in shared trip_tracker DB
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = 'trip_tracker' AND TABLE_NAME = 'notifications'`
    );

    if (tables.length === 0) {
      await connection.query(`
        CREATE TABLE trip_tracker.notifications (
          id            INT          NOT NULL AUTO_INCREMENT,
          vacation_id   VARCHAR(100) NOT NULL,
          vacation_name VARCHAR(200) DEFAULT NULL,
          type          VARCHAR(50)  NOT NULL DEFAULT 'new_lead',
          title         VARCHAR(200) NOT NULL,
          message       TEXT         DEFAULT NULL,
          entity_id     INT          DEFAULT NULL,
          entity_type   VARCHAR(50)  DEFAULT NULL,
          is_read       TINYINT(1)   NOT NULL DEFAULT 0,
          created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
      `);
      console.log('migrateSharedDb: created trip_tracker.notifications table');
    }

    // [2] Add agreement_text column to trip_tracker.vacations
    const [agreeCol] = await connection.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = 'trip_tracker' AND TABLE_NAME = 'vacations' AND COLUMN_NAME = 'agreement_text'`
    );
    if (agreeCol.length === 0) {
      await connection.query(
        `ALTER TABLE trip_tracker.vacations ADD COLUMN agreement_text TEXT DEFAULT NULL`
      );
      console.log('migrateSharedDb: added agreement_text to trip_tracker.vacations');
    }

    // [3] payment_provider_configs table in shared trip_tracker DB
    const [providerTables] = await connection.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = 'trip_tracker' AND TABLE_NAME = 'payment_provider_configs'`
    );
    if (providerTables.length === 0) {
      await connection.query(`
        CREATE TABLE trip_tracker.payment_provider_configs (
          id                    INT          NOT NULL AUTO_INCREMENT,
          provider_type         VARCHAR(45)  NOT NULL DEFAULT 'cardcom',
          terminal_number       VARCHAR(100) NOT NULL,
          api_name              VARCHAR(100) NOT NULL,
          business_name         VARCHAR(255) DEFAULT NULL,
          vat_number            VARCHAR(50)  DEFAULT NULL,
          invoice_doc_type      VARCHAR(50)  DEFAULT 'Receipt',
          business_type         VARCHAR(50)  DEFAULT 'exempt_dealer',
          invoice_email_enabled TINYINT      DEFAULT 0,
          invoice_notes         TEXT         DEFAULT NULL,
          is_test_mode          TINYINT      DEFAULT 1,
          is_active             TINYINT      DEFAULT 1,
          created_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
          updated_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_provider_type (provider_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('migrateSharedDb: created trip_tracker.payment_provider_configs table');
    }
    // [4] flight_companies table in shared trip_tracker DB
    const [flightCoTables] = await connection.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = 'trip_tracker' AND TABLE_NAME = 'flight_companies'`
    );
    if (flightCoTables.length === 0) {
      await connection.query(`
        CREATE TABLE trip_tracker.flight_companies (
          id         INT          NOT NULL AUTO_INCREMENT,
          name       VARCHAR(100) NOT NULL,
          created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('migrateSharedDb: created trip_tracker.flight_companies table');
    }
  } catch (error) {
    console.error('migrateSharedDb error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
};

module.exports = migrateSharedDb;
