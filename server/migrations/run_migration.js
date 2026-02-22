'use strict';

/**
 * run_migration.js — THE single migration file for this project.
 *
 * Run: node server/migrations/run_migration.js
 *
 * Rules:
 *  - Always idempotent: every step checks before acting, safe to re-run anytime.
 *  - Applies to ALL existing per-vacation databases (discovered via trip_tracker.vacations).
 *  - When a new DB change is needed, ADD a new step here. Never create a separate file.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

// ─── helpers ────────────────────────────────────────────────────────────────

async function getVacationIds(conn) {
  const [rows] = await conn.query('SELECT vacation_id FROM trip_tracker.vacations');
  return rows.map(r => r.vacation_id);
}

async function tableExists(conn, db, table) {
  const [rows] = await conn.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [db, table]
  );
  return rows.length > 0;
}

async function columnExists(conn, db, table, column) {
  const [rows] = await conn.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [db, table, column]
  );
  return rows.length > 0;
}

async function indexExists(conn, db, table, indexName) {
  const [rows] = await conn.query(
    `SELECT INDEX_NAME FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [db, table, indexName]
  );
  return rows.length > 0;
}

async function fkExists(conn, db, table, fkName) {
  const [rows] = await conn.query(
    `SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_TYPE = 'FOREIGN KEY'
     AND CONSTRAINT_NAME = ?`,
    [db, table, fkName]
  );
  return rows.length > 0;
}

// ─── per-vacation migrations ─────────────────────────────────────────────────

async function migrateVacationDb(conn, vacationId) {
  const db = `trip_tracker_${vacationId}`;
  console.log(`\n  Migrating ${db}...`);

  // [1] Drop dead family_room_details table
  if (await tableExists(conn, db, 'family_room_details')) {
    await conn.query(`DROP TABLE \`${db}\`.\`family_room_details\``);
    console.log(`    [1] Dropped family_room_details`);
  } else {
    console.log(`    [1] family_room_details already gone — skip`);
  }

  // [2] Drop unused is_taken column from rooms
  if (await columnExists(conn, db, 'rooms', 'is_taken')) {
    await conn.query(`ALTER TABLE \`${db}\`.rooms DROP COLUMN is_taken`);
    console.log(`    [2] Dropped is_taken from rooms`);
  } else {
    console.log(`    [2] is_taken already gone — skip`);
  }

  // [3] UNIQUE KEY on rooms(rooms_id)
  if (!await indexExists(conn, db, 'rooms', 'uq_rooms_id')) {
    await conn.query(`ALTER TABLE \`${db}\`.rooms ADD UNIQUE KEY uq_rooms_id (rooms_id)`);
    console.log(`    [3] Added UNIQUE KEY uq_rooms_id on rooms`);
  } else {
    console.log(`    [3] uq_rooms_id already exists — skip`);
  }

  // [4] UNIQUE KEY on families(family_id)
  if (!await indexExists(conn, db, 'families', 'uq_family_id')) {
    await conn.query(`ALTER TABLE \`${db}\`.families ADD UNIQUE KEY uq_family_id (family_id)`);
    console.log(`    [4] Added UNIQUE KEY uq_family_id on families`);
  } else {
    console.log(`    [4] uq_family_id already exists — skip`);
  }

  // [5] Change room_taken.start_date / end_date VARCHAR → DATE
  const [dateCol] = await conn.query(
    `SELECT DATA_TYPE FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'room_taken' AND COLUMN_NAME = 'start_date'`,
    [db]
  );
  if (dateCol.length > 0 && dateCol[0].DATA_TYPE !== 'date') {
    await conn.query(
      `UPDATE \`${db}\`.room_taken SET start_date = NULL WHERE start_date = '' OR start_date = '""'`
    );
    await conn.query(
      `UPDATE \`${db}\`.room_taken SET end_date = NULL WHERE end_date = '' OR end_date = '""'`
    );
    await conn.query(
      `ALTER TABLE \`${db}\`.room_taken
       MODIFY COLUMN start_date DATE NOT NULL,
       MODIFY COLUMN end_date   DATE NOT NULL`
    );
    console.log(`    [5] Changed start_date/end_date to DATE type`);
  } else {
    console.log(`    [5] Date columns already DATE — skip`);
  }

  // [6] UNIQUE KEY on room_taken(room_id, family_id)
  if (!await indexExists(conn, db, 'room_taken', 'uq_room_family')) {
    const [dups] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM (
         SELECT room_id, family_id FROM \`${db}\`.room_taken
         GROUP BY room_id, family_id HAVING COUNT(*) > 1
       ) t`
    );
    if (dups[0].cnt > 0) {
      console.log(`    [6] WARNING: ${dups[0].cnt} duplicate (room_id, family_id) pair(s) — removing extras`);
      await conn.query(
        `DELETE rt1 FROM \`${db}\`.room_taken rt1
         INNER JOIN \`${db}\`.room_taken rt2
         WHERE rt1.id > rt2.id
           AND rt1.room_id   = rt2.room_id
           AND rt1.family_id = rt2.family_id`
      );
    }
    await conn.query(
      `ALTER TABLE \`${db}\`.room_taken ADD UNIQUE KEY uq_room_family (room_id, family_id)`
    );
    console.log(`    [6] Added UNIQUE KEY uq_room_family on room_taken`);
  } else {
    console.log(`    [6] uq_room_family already exists — skip`);
  }

  // [7] Foreign keys on room_taken
  if (!await fkExists(conn, db, 'room_taken', 'fk_rt_room')) {
    await conn.query(
      `ALTER TABLE \`${db}\`.room_taken
       ADD CONSTRAINT fk_rt_room   FOREIGN KEY (room_id)   REFERENCES rooms(rooms_id)     ON DELETE RESTRICT  ON UPDATE CASCADE,
       ADD CONSTRAINT fk_rt_family FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE   ON UPDATE CASCADE`
    );
    console.log(`    [7] Added FKs on room_taken`);
  } else {
    console.log(`    [7] FKs on room_taken already exist — skip`);
  }

  // [8] Foreign keys on user_room_assignments
  if (!await fkExists(conn, db, 'user_room_assignments', 'fk_ura_room')) {
    await conn.query(
      `ALTER TABLE \`${db}\`.user_room_assignments
       ADD CONSTRAINT fk_ura_room   FOREIGN KEY (room_id)   REFERENCES rooms(rooms_id)     ON DELETE RESTRICT  ON UPDATE CASCADE,
       ADD CONSTRAINT fk_ura_family FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE   ON UPDATE CASCADE`
    );
    console.log(`    [8] Added FKs on user_room_assignments`);
  } else {
    console.log(`    [8] FKs on user_room_assignments already exist — skip`);
  }

  // [9] Create leads table
  if (!await tableExists(conn, db, 'leads')) {
    await conn.query(`
      CREATE TABLE \`${db}\`.leads (
        lead_id      INT NOT NULL AUTO_INCREMENT,
        full_name    VARCHAR(100) NOT NULL,
        phone        VARCHAR(30)  DEFAULT NULL,
        email        VARCHAR(100) DEFAULT NULL,
        family_size  INT          DEFAULT 1,
        status       VARCHAR(50)  NOT NULL DEFAULT 'new_interest',
        source       VARCHAR(50)  NOT NULL DEFAULT 'phone',
        notes        TEXT         DEFAULT NULL,
        referred_by  VARCHAR(100) DEFAULT NULL,
        is_active    TINYINT(1)   NOT NULL DEFAULT 1,
        assigned_to  INT          DEFAULT NULL,
        created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (lead_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log(`    [9] Created leads table`);
  } else {
    console.log(`    [9] leads table already exists — skip`);
  }

  // [10] Create lead_notes table
  if (!await tableExists(conn, db, 'lead_notes')) {
    await conn.query(`
      CREATE TABLE \`${db}\`.lead_notes (
        note_id    INT NOT NULL AUTO_INCREMENT,
        lead_id    INT NOT NULL,
        note_text  TEXT NOT NULL,
        created_by INT DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (note_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log(`    [10] Created lead_notes table`);
  } else {
    console.log(`    [10] lead_notes table already exists — skip`);
  }

  // [11] Add group-level columns to families table
  if (!await columnExists(conn, db, 'families', 'number_of_guests')) {
    await conn.query(`
      ALTER TABLE \`${db}\`.families
        ADD COLUMN number_of_guests varchar(45) DEFAULT NULL,
        ADD COLUMN number_of_rooms  varchar(45) DEFAULT NULL,
        ADD COLUMN total_amount     varchar(45) DEFAULT NULL,
        ADD COLUMN start_date       varchar(45) DEFAULT NULL,
        ADD COLUMN end_date         varchar(45) DEFAULT NULL
    `);
    // Copy existing data from main guest to families
    await conn.query(`
      UPDATE \`${db}\`.families f
      JOIN \`${db}\`.guest g ON f.family_id = g.family_id AND g.is_main_user = 1
      SET f.number_of_guests = g.number_of_guests,
          f.number_of_rooms  = g.number_of_rooms,
          f.total_amount     = REPLACE(g.total_amount, ',', ''),
          f.start_date       = g.arrival_date,
          f.end_date         = g.departure_date
    `);
    console.log(`    [11] Added group columns to families + copied data from guest`);
  } else {
    console.log(`    [11] families.number_of_guests already exists — skip`);
  }

  // [12] Add doc_token to families
  if (!await columnExists(conn, db, 'families', 'doc_token')) {
    await conn.query(`ALTER TABLE \`${db}\`.families ADD COLUMN doc_token VARCHAR(36) NULL`);
    await conn.query(`UPDATE \`${db}\`.families SET doc_token = UUID() WHERE doc_token IS NULL`);
    console.log(`    [12] Added doc_token to families + populated UUIDs`);
  } else {
    console.log(`    [12] families.doc_token already exists — skip`);
  }

  // [13] Create family_document_types table
  if (!await tableExists(conn, db, 'family_document_types')) {
    await conn.query(`
      CREATE TABLE \`${db}\`.family_document_types (
        id         INT NOT NULL AUTO_INCREMENT,
        type_key   VARCHAR(50)  NOT NULL,
        label      VARCHAR(100) NOT NULL,
        is_required TINYINT(1)  NOT NULL DEFAULT 1,
        sort_order INT          NOT NULL DEFAULT 0,
        created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await conn.query(`
      INSERT INTO \`${db}\`.family_document_types (type_key, label, is_required, sort_order)
      VALUES ('id_passport', 'צילום תעודת זהות / דרכון', 1, 1),
             ('flight_ticket', 'כרטיסי טיסה', 1, 2)
    `);
    console.log(`    [13] Created family_document_types + inserted 2 default types`);
  } else {
    console.log(`    [13] family_document_types already exists — skip`);
  }

  // [14] Create family_documents table
  if (!await tableExists(conn, db, 'family_documents')) {
    await conn.query(`
      CREATE TABLE \`${db}\`.family_documents (
        id          INT NOT NULL AUTO_INCREMENT,
        family_id   VARCHAR(45)  NOT NULL,
        user_id     VARCHAR(45)  NOT NULL,
        doc_type_id INT          NOT NULL,
        file_name   VARCHAR(200) NOT NULL,
        file_path   VARCHAR(500) NOT NULL,
        uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log(`    [14] Created family_documents`);
  } else {
    console.log(`    [14] family_documents already exists — skip`);
  }

  // [15] Payments table redesign: rename old → payments_old, create new, migrate data
  const paymentsOldExists = await tableExists(conn, db, 'payments_old');
  if (paymentsOldExists) {
    console.log(`    [15] payments_old already exists — skip`);
  } else {
    const paymentsExists = await tableExists(conn, db, 'payments');
    if (paymentsExists) {
      await conn.query(`RENAME TABLE \`${db}\`.payments TO \`${db}\`.payments_old`);
      console.log(`    [15] Renamed payments → payments_old`);
    }

    // Create new payments table
    await conn.query(`
      CREATE TABLE \`${db}\`.payments (
        id             INT NOT NULL AUTO_INCREMENT,
        family_id      VARCHAR(45) NOT NULL,
        user_id        VARCHAR(255) DEFAULT NULL,
        amount         DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(45) NOT NULL DEFAULT 'מזומן',
        payment_date   DATE NOT NULL,
        notes          TEXT DEFAULT NULL,
        receipt        TINYINT DEFAULT 0,
        status         VARCHAR(20) NOT NULL DEFAULT 'completed',
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log(`    [15] Created new payments table`);

    // Migrate existing data — column names differ depending on how old the payments table is
    if (paymentsExists) {
      const hasOldSchema = await columnExists(conn, db, 'payments_old', 'amount_received');
      const hasNewSchema = await columnExists(conn, db, 'payments_old', 'amount');

      if (hasOldSchema) {
        // Original schema: amount_received, form_of_payment, invoice, is_paid
        await conn.query(`
          INSERT INTO \`${db}\`.payments
            (family_id, user_id, amount, payment_method, payment_date, notes, receipt, status, created_at)
          SELECT
            family_id,
            user_id,
            COALESCE(
              CAST(NULLIF(TRIM(REPLACE(amount_received, ',', '')), '') AS DECIMAL(10,2)),
              0
            ),
            COALESCE(NULLIF(TRIM(form_of_payment), ''), 'מזומן'),
            COALESCE(
              NULLIF(STR_TO_DATE(payment_date, '%Y-%m-%d'), '0000-00-00'),
              CURDATE()
            ),
            NULL,
            COALESCE(invoice, 0),
            CASE WHEN is_paid = 1 THEN 'completed' ELSE 'pending' END,
            COALESCE(created_at, NOW())
          FROM \`${db}\`.payments_old
          WHERE family_id IS NOT NULL
            AND family_id != ''
            AND amount_received IS NOT NULL
            AND TRIM(REPLACE(amount_received, ',', '')) != ''
            AND TRIM(REPLACE(amount_received, ',', '')) != '0'
        `);
        console.log(`    [15] Migrated data from payments_old (old schema)`);
      } else if (hasNewSchema) {
        // Already redesigned schema: copy directly (no gateway columns yet — those come in step 18)
        await conn.query(`
          INSERT INTO \`${db}\`.payments
            (family_id, user_id, amount, payment_method, payment_date, notes, receipt, status, created_at)
          SELECT
            family_id, user_id, amount, payment_method, payment_date, notes, receipt, status,
            COALESCE(created_at, NOW())
          FROM \`${db}\`.payments_old
          WHERE family_id IS NOT NULL AND family_id != ''
        `);
        console.log(`    [15] Migrated data from payments_old (new schema — direct copy)`);
      } else {
        console.log(`    [15] payments_old has unrecognised schema — skipping data migration`);
      }
    } else {
      console.log(`    [15] No old data to migrate (fresh database)`);
    }
  }

  // [16] Add signature_sent_at to families
  if (!await columnExists(conn, db, 'families', 'signature_sent_at')) {
    await conn.query(`ALTER TABLE \`${db}\`.families ADD COLUMN signature_sent_at TIMESTAMP NULL DEFAULT NULL`);
    console.log(`    [16] Added signature_sent_at to families`);
  } else {
    console.log(`    [16] families.signature_sent_at already exists — skip`);
  }

  // [17] Create family_signatures table
  if (!await tableExists(conn, db, 'family_signatures')) {
    await conn.query(`
      CREATE TABLE \`${db}\`.family_signatures (
        id                   INT NOT NULL AUTO_INCREMENT,
        family_id            VARCHAR(45) NOT NULL,
        signer_name          VARCHAR(100) NOT NULL,
        signature_image_path VARCHAR(500) NOT NULL,
        signed_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ip_address           VARCHAR(45) DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log(`    [17] Created family_signatures table`);
  } else {
    console.log(`    [17] family_signatures already exists — skip`);
  }

  // [18] Add payment gateway columns to payments table
  if (!await columnExists(conn, db, 'payments', 'payment_gateway')) {
    await conn.query(`
      ALTER TABLE \`${db}\`.payments
        ADD COLUMN payment_gateway     VARCHAR(45)  DEFAULT 'manual'    AFTER status,
        ADD COLUMN low_profile_code    VARCHAR(255) NULL                AFTER payment_gateway,
        ADD COLUMN payment_url         TEXT         NULL                AFTER low_profile_code,
        ADD COLUMN approval_number     VARCHAR(100) NULL                AFTER payment_url,
        ADD COLUMN card_last_four      VARCHAR(10)  NULL                AFTER approval_number,
        ADD COLUMN card_owner_name     VARCHAR(255) NULL                AFTER card_last_four,
        ADD COLUMN invoice_number      VARCHAR(100) NULL                AFTER card_owner_name,
        ADD COLUMN webhook_received_at TIMESTAMP    NULL                AFTER invoice_number
    `);
    console.log(`    [18] Added gateway columns to payments`);
  } else {
    console.log(`    [18] payments.payment_gateway already exists — skip`);
  }

  // [19] Add flight time + seat preference columns to flights
  if (!await columnExists(conn, db, 'flights', 'outbound_flight_time')) {
    await conn.query(`
      ALTER TABLE \`${db}\`.flights
        ADD COLUMN outbound_flight_time VARCHAR(10) DEFAULT NULL AFTER outbound_flight_date,
        ADD COLUMN return_flight_time   VARCHAR(10) DEFAULT NULL AFTER return_flight_date,
        ADD COLUMN seat_preference      VARCHAR(45) DEFAULT NULL AFTER return_airline
    `);
    console.log(`    [19] Added outbound_flight_time, return_flight_time, seat_preference to flights`);
  } else {
    console.log(`    [19] flights.outbound_flight_time already exists — skip`);
  }

  // [20] Add import-related columns to families
  if (!await columnExists(conn, db, 'families', 'number_of_pax_outbound')) {
    await conn.query(`
      ALTER TABLE \`${db}\`.families
        ADD COLUMN number_of_pax_outbound VARCHAR(10) DEFAULT NULL,
        ADD COLUMN number_of_pax_return   VARCHAR(10) DEFAULT NULL,
        ADD COLUMN number_of_babies       VARCHAR(10) DEFAULT NULL,
        ADD COLUMN total_amount_eur       VARCHAR(45) DEFAULT NULL,
        ADD COLUMN voucher_number         VARCHAR(20) DEFAULT NULL,
        ADD COLUMN special_requests       TEXT        DEFAULT NULL
    `);
    console.log(`    [20] Added number_of_pax_outbound, number_of_pax_return, number_of_babies, total_amount_eur, voucher_number, special_requests to families`);
  } else {
    console.log(`    [20] families.number_of_pax_outbound already exists — skip`);
  }

  // [21] Create staff table
  if (!await tableExists(conn, db, 'staff')) {
    await conn.query(`
      CREATE TABLE \`${db}\`.staff (
        id            INT NOT NULL AUTO_INCREMENT,
        name          VARCHAR(100) NOT NULL,
        role          VARCHAR(100) DEFAULT NULL,
        location      VARCHAR(45)  DEFAULT NULL,
        room_number   VARCHAR(10)  DEFAULT NULL,
        persons_count INT          DEFAULT 1,
        notes         TEXT         DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log(`    [21] Created staff table`);
  } else {
    console.log(`    [21] staff table already exists — skip`);
  }

  // [22] Create vehicles table
  if (!await tableExists(conn, db, 'vehicles')) {
    await conn.query(`
      CREATE TABLE \`${db}\`.vehicles (
        id           INT NOT NULL AUTO_INCREMENT,
        family_id    VARCHAR(45)   DEFAULT NULL,
        family_name  VARCHAR(100)  DEFAULT NULL,
        vehicle_type VARCHAR(100)  DEFAULT NULL,
        seats        INT           DEFAULT NULL,
        cost         DECIMAL(10,2) DEFAULT NULL,
        currency     VARCHAR(10)   DEFAULT 'EUR',
        notes        TEXT          DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log(`    [22] Created vehicles table`);
  } else {
    console.log(`    [22] vehicles table already exists — skip`);
  }

  // ── [24] Add male_head + female_head to families ────────────────────────────
  if (!(await columnExists(conn, db, 'families', 'male_head'))) {
    await conn.query(`ALTER TABLE \`${db}\`.families ADD COLUMN male_head VARCHAR(45) DEFAULT NULL AFTER number_of_suites`);
    await conn.query(`ALTER TABLE \`${db}\`.families ADD COLUMN female_head VARCHAR(45) DEFAULT NULL AFTER male_head`);
    console.log(`    [24] Added male_head, female_head to families`);
  } else {
    console.log(`    [24] male_head already exists — skip`);
  }

  // ── [23] Add number_of_suites to families ───────────────────────────────────
  if (!(await columnExists(conn, db, 'families', 'number_of_suites'))) {
    await conn.query(`ALTER TABLE \`${db}\`.families ADD COLUMN number_of_suites VARCHAR(10) DEFAULT NULL AFTER number_of_rooms`);
    console.log(`    [23] Added number_of_suites to families`);
  } else {
    console.log(`    [23] number_of_suites already exists — skip`);
  }

  // ── [25] Add booking_reference to flights ───────────────────────────────────
  if (!(await columnExists(conn, db, 'flights', 'booking_reference'))) {
    await conn.query(`ALTER TABLE \`${db}\`.flights ADD COLUMN booking_reference VARCHAR(10) DEFAULT NULL AFTER user_classification`);
    console.log(`    [25] Added booking_reference to flights`);
  } else {
    console.log(`    [25] booking_reference already exists — skip`);
  }

  // ── [26] Create booking_submissions table ───────────────────────────────────
  if (!(await tableExists(conn, db, 'booking_submissions'))) {
    await conn.query(`
      CREATE TABLE \`${db}\`.booking_submissions (
        id                  INT NOT NULL AUTO_INCREMENT,
        family_id           VARCHAR(45) NOT NULL,
        contact_name        VARCHAR(100) DEFAULT NULL,
        contact_phone       VARCHAR(20)  DEFAULT NULL,
        contact_email       VARCHAR(100) DEFAULT NULL,
        contact_address     VARCHAR(200) DEFAULT NULL,
        payment_preference  VARCHAR(30)  DEFAULT NULL,
        special_requests    TEXT         DEFAULT NULL,
        submitted_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log(`    [26] Created booking_submissions table`);
  } else {
    console.log(`    [26] booking_submissions already exists — skip`);
  }

  // ── [27] Create booking_guests table ────────────────────────────────────────
  if (!(await tableExists(conn, db, 'booking_guests'))) {
    await conn.query(`
      CREATE TABLE \`${db}\`.booking_guests (
        id              INT NOT NULL AUTO_INCREMENT,
        submission_id   INT NOT NULL,
        full_name_he    VARCHAR(100) DEFAULT NULL,
        full_name_en    VARCHAR(100) DEFAULT NULL,
        passport_number VARCHAR(50)  DEFAULT NULL,
        passport_expiry VARCHAR(20)  DEFAULT NULL,
        date_of_birth   VARCHAR(20)  DEFAULT NULL,
        gender          VARCHAR(10)  DEFAULT NULL,
        food_preference VARCHAR(50)  DEFAULT NULL,
        sort_order      INT          DEFAULT 0,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log(`    [27] Created booking_guests table`);
  } else {
    console.log(`    [27] booking_guests already exists — skip`);
  }

  // ── add new steps above this line ──────────────────────────────────────────

  console.log(`  Done: ${db}`);
}

// ─── main ────────────────────────────────────────────────────────────────────

async function run() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    console.log('run_migration: starting...');
    const vacationIds = await getVacationIds(conn);

    if (vacationIds.length === 0) {
      console.log('No vacations found in trip_tracker.vacations — nothing to do.');
      return;
    }

    console.log(`Found ${vacationIds.length} vacation(s): ${vacationIds.join(', ')}`);

    for (const vacationId of vacationIds) {
      await migrateVacationDb(conn, vacationId);
    }

    console.log('\nrun_migration: all done!');
  } catch (err) {
    console.error('\nMigration FAILED:', err.message || err);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

run();
