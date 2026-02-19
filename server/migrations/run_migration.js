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
