'use strict';

/**
 * schema.js — THE SINGLE SOURCE OF TRUTH for the database schema.
 *
 * Consumed by:
 *   - migrations/engine.js        (apply/idempotent migration logic)
 *   - migrations/run_migration.js (manual CLI entry point)
 *   - sql/utils/createDb.js       (new-vacation tenant creation)
 *
 * There are TWO schema groups:
 *   - SHARED_TABLE_SCHEMAS  → the shared `trip_tracker` database
 *   - TENANT_TABLE_SCHEMAS  → every per-vacation `trip_tracker_<id>` database
 *
 * To add/alter the schema: edit the relevant object below, then run
 *   node migrations/run_migration.js
 *
 * HARD RULES (enforced by engine.js):
 *   - ADD and ALTER ADD only. Never DROP TABLE / DROP COLUMN / DELETE / TRUNCATE / RENAME.
 *   - Columns/tables found in the DB but NOT here are REPORTED, never removed.
 *   - Seed data is inserted ONLY when a table is freshly created (never overwrites).
 */

const ENGINE_AI   = 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci';
const ENGINE_UNI  = 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';

// ─── SHARED `trip_tracker` DATABASE ──────────────────────────────────────────
// Absorbs: migrateSharedDb.js (notifications, payment_provider_configs,
// flight_companies, vacations.agreement_text) + the previously-undefined
// `user` and `vacation_date` tables.

const SHARED_TABLE_SCHEMAS = {
  user: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',         definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'email',      definition: 'varchar(45) DEFAULT NULL' },
      { name: 'password',   definition: 'varchar(455) DEFAULT NULL' },
      { name: 'permission', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'type',       definition: 'varchar(45) DEFAULT NULL' },
    ],
  },

  vacations: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',             definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'name',           definition: 'varchar(45) DEFAULT NULL' },
      { name: 'vacation_id',    definition: 'varchar(455) DEFAULT NULL' },
      { name: 'agreement_text', definition: 'text' },
    ],
  },

  vacation_date: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',          definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'vacation_id', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'start_date',  definition: 'varchar(45) DEFAULT NULL' },
      { name: 'end_date',    definition: 'varchar(45) DEFAULT NULL' },
      { name: 'name',        definition: 'varchar(45) DEFAULT NULL' },
    ],
  },

  notifications: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',            definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'vacation_id',   definition: 'varchar(100) NOT NULL' },
      { name: 'vacation_name', definition: 'varchar(200) DEFAULT NULL' },
      { name: 'type',          definition: "varchar(50) NOT NULL DEFAULT 'new_lead'" },
      { name: 'title',         definition: 'varchar(200) NOT NULL' },
      { name: 'message',       definition: 'text' },
      { name: 'entity_id',     definition: 'int DEFAULT NULL' },
      { name: 'entity_type',   definition: 'varchar(50) DEFAULT NULL' },
      { name: 'is_read',       definition: "tinyint(1) NOT NULL DEFAULT '0'" },
      { name: 'created_at',    definition: 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },

  payment_provider_configs: {
    options: ENGINE_UNI,
    primaryKey: '(`id`)',
    indexes: [
      { name: 'uq_provider_type', columns: ['provider_type'], unique: true },
    ],
    columns: [
      { name: 'id',                    definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'provider_type',         definition: "varchar(45) NOT NULL DEFAULT 'cardcom'" },
      { name: 'terminal_number',       definition: 'varchar(100) NOT NULL' },
      { name: 'api_name',              definition: 'varchar(100) NOT NULL' },
      { name: 'business_name',         definition: 'varchar(255) DEFAULT NULL' },
      { name: 'vat_number',            definition: 'varchar(50) DEFAULT NULL' },
      { name: 'invoice_doc_type',      definition: "varchar(50) DEFAULT 'Receipt'" },
      { name: 'business_type',         definition: "varchar(50) DEFAULT 'exempt_dealer'" },
      { name: 'invoice_email_enabled', definition: "tinyint DEFAULT '0'" },
      { name: 'invoice_notes',         definition: 'text' },
      { name: 'is_test_mode',          definition: "tinyint DEFAULT '1'" },
      { name: 'is_active',             definition: "tinyint DEFAULT '1'" },
      { name: 'created_at',            definition: 'timestamp NULL DEFAULT CURRENT_TIMESTAMP' },
      { name: 'updated_at',            definition: 'timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
  },

  flight_companies: {
    options: ENGINE_UNI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',         definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'name',       definition: 'varchar(100) NOT NULL' },
      { name: 'created_at', definition: 'timestamp NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
};

// Order is irrelevant for the shared DB (no inter-table FKs).
const SHARED_TABLE_ORDER = Object.keys(SHARED_TABLE_SCHEMAS);

// ─── PER-VACATION `trip_tracker_<id>` DATABASES ──────────────────────────────
// Absorbs: trip_tracker_dump.js (all CREATE TABLE + seed data) and
// migrateBudgetTables.js (income_* tables). Adds the `files` table which the
// code (userQuery.js) writes to but which was never in any schema source.
//
// NOT INCLUDED ON PURPOSE (reported by the migration, never created/dropped):
//   - `payments_old`                  : one-time backup created by the old
//                                       payments-redesign migration; absent in
//                                       newer tenants; no code path needs it.
//   - `user_room_assignments.week_chosen` : orphan column in 1 of 3 tenants,
//                                       referenced by zero queries/UI.

const TENANT_TABLE_SCHEMAS = {
  families: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    indexes: [
      { name: 'uq_family_id', columns: ['family_id'], unique: true },
    ],
    columns: [
      { name: 'id',                     definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'family_id',              definition: 'varchar(45) NOT NULL' },
      { name: 'family_name',            definition: 'varchar(45) NOT NULL' },
      { name: 'number_of_guests',       definition: 'varchar(45) DEFAULT NULL' },
      { name: 'number_of_rooms',        definition: 'varchar(45) DEFAULT NULL' },
      { name: 'number_of_suites',       definition: 'varchar(10) DEFAULT NULL' },
      { name: 'male_head',              definition: 'varchar(45) DEFAULT NULL' },
      { name: 'female_head',            definition: 'varchar(45) DEFAULT NULL' },
      { name: 'total_amount',           definition: 'varchar(45) DEFAULT NULL' },
      { name: 'total_amount_eur',       definition: 'varchar(45) DEFAULT NULL' },
      { name: 'start_date',             definition: 'varchar(45) DEFAULT NULL' },
      { name: 'end_date',               definition: 'varchar(45) DEFAULT NULL' },
      { name: 'number_of_pax_outbound', definition: 'varchar(10) DEFAULT NULL' },
      { name: 'number_of_pax_return',   definition: 'varchar(10) DEFAULT NULL' },
      { name: 'number_of_babies',       definition: 'varchar(10) DEFAULT NULL' },
      { name: 'voucher_number',         definition: 'varchar(20) DEFAULT NULL' },
      { name: 'special_requests',       definition: 'text' },
      { name: 'doc_token',              definition: 'varchar(36) DEFAULT NULL' },
      { name: 'signature_sent_at',      definition: 'timestamp NULL DEFAULT NULL' },
    ],
  },

  flights: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                     definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'child_id',               definition: 'varchar(45) DEFAULT NULL' },
      { name: 'validity_passport',      definition: 'varchar(45) DEFAULT NULL' },
      { name: 'passport_number',        definition: 'varchar(45) DEFAULT NULL' },
      { name: 'birth_date',             definition: 'varchar(45) DEFAULT NULL' },
      { name: 'outbound_flight_date',   definition: 'varchar(45) DEFAULT NULL' },
      { name: 'outbound_flight_time',   definition: 'varchar(10) DEFAULT NULL' },
      { name: 'return_flight_date',     definition: 'varchar(45) DEFAULT NULL' },
      { name: 'return_flight_time',     definition: 'varchar(10) DEFAULT NULL' },
      { name: 'outbound_flight_number', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'age',                    definition: 'varchar(45) DEFAULT NULL' },
      { name: 'parent_id',              definition: 'varchar(45) DEFAULT NULL' },
      { name: 'return_flight_number',   definition: 'varchar(45) DEFAULT NULL' },
      { name: 'family_id',              definition: 'varchar(45) DEFAULT NULL' },
      { name: 'outbound_airline',       definition: 'varchar(45) DEFAULT NULL' },
      { name: 'return_airline',         definition: 'varchar(45) DEFAULT NULL' },
      { name: 'seat_preference',        definition: 'varchar(45) DEFAULT NULL' },
      { name: 'is_source_user',         definition: "tinyint DEFAULT '0'" },
      { name: 'user_id',                definition: 'varchar(45) DEFAULT NULL' },
      { name: 'user_classification',    definition: 'varchar(45) DEFAULT NULL' },
      { name: 'booking_reference',      definition: 'varchar(10) DEFAULT NULL' },
    ],
  },

  guest: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                 definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'user_id',            definition: 'varchar(455) DEFAULT NULL' },
      { name: 'hebrew_first_name',  definition: 'varchar(45) DEFAULT NULL' },
      { name: 'hebrew_last_name',   definition: 'varchar(45) DEFAULT NULL' },
      { name: 'english_first_name', definition: 'varchar(55) DEFAULT NULL' },
      { name: 'english_last_name',  definition: 'varchar(45) DEFAULT NULL' },
      { name: 'phone_a',            definition: 'varchar(45) DEFAULT NULL' },
      { name: 'phone_b',            definition: 'varchar(45) DEFAULT NULL' },
      { name: 'email',              definition: 'varchar(45) DEFAULT NULL' },
      { name: 'identity_id',        definition: 'varchar(45) DEFAULT NULL' },
      { name: 'family_id',          definition: 'varchar(45) NOT NULL' },
      { name: 'flights',            definition: 'varchar(45) DEFAULT NULL' },
      { name: 'number_of_guests',   definition: 'varchar(45) DEFAULT NULL' },
      { name: 'number_of_rooms',    definition: 'varchar(45) DEFAULT NULL' },
      { name: 'total_amount',       definition: 'varchar(45) DEFAULT NULL' },
      { name: 'flights_direction',  definition: 'varchar(45) DEFAULT NULL' },
      { name: 'flying_with_us',     definition: "tinyint DEFAULT '1'" },
      { name: 'is_main_user',       definition: "tinyint DEFAULT '0'" },
      { name: 'user_type',          definition: 'varchar(45) DEFAULT NULL' },
      { name: 'is_in_group',        definition: "tinyint DEFAULT '0'" },
      { name: 'arrival_date',       definition: `varchar(45) DEFAULT '""'` },
      { name: 'departure_date',     definition: `varchar(45) DEFAULT '""'` },
      { name: 'address',            definition: `varchar(45) DEFAULT '""'` },
      { name: 'week_chosen',        definition: 'varchar(45) DEFAULT NULL' },
      { name: 'date_chosen',        definition: 'varchar(45) DEFAULT NULL' },
      { name: 'age',                definition: 'varchar(45) DEFAULT NULL' },
      { name: 'birth_date',         definition: 'varchar(45) DEFAULT NULL' },
      { name: 'number_of_payments', definition: 'varchar(45) DEFAULT NULL' },
    ],
  },

  notes: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',            definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'parent_id',     definition: 'varchar(455) DEFAULT NULL' },
      { name: 'note',          definition: 'varchar(999) DEFAULT NULL' },
      { name: 'child_id',      definition: 'varchar(455) DEFAULT NULL' },
      { name: 'family_id',     definition: 'varchar(45) DEFAULT NULL' },
      { name: 'category_name', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'user_id',       definition: 'varchar(455) DEFAULT NULL' },
    ],
  },

  rooms: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    indexes: [
      { name: 'uq_rooms_id', columns: ['rooms_id'], unique: true },
    ],
    columns: [
      { name: 'id',             definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'rooms_id',       definition: 'varchar(45) NOT NULL' },
      { name: 'type',           definition: 'varchar(45) NOT NULL' },
      { name: 'floor',          definition: 'varchar(45) NOT NULL' },
      { name: 'size',           definition: 'varchar(45) NOT NULL' },
      { name: 'direction',      definition: 'varchar(45) DEFAULT NULL' },
      { name: 'base_occupancy', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'max_occupancy',  definition: 'varchar(45) DEFAULT NULL' },
    ],
    // Seeded ONLY on fresh table creation (engine checks COUNT(*) = 0).
    seed: `INSERT INTO {{T}} (id, rooms_id, type, floor, size, direction, base_occupancy, max_occupancy) VALUES (1,'101','סוויטה AP','1','140','טפט','4',NULL),(2,'102','DLX','1','80','טפט','4',NULL),(3,'103','EXE','1','100','טפט','4',NULL),(4,'104','EXE','1','100','טפט','4',NULL),(5,'105','EXE','1','100','טפט יער','4',NULL),(6,'110','DLX','1','80','חניה','4',NULL),(7,'111','DLX','1','80','חניה','4',NULL),(8,'112','DLX','1','80','חניה','4',NULL),(9,'113','DLX','1','80','חניה','4',NULL),(10,'114','DLX','1','80','חניה','4',NULL),(11,'115','DLX','1','80','חניה','4',NULL),(12,'116','סוויטה AP','1','140','חניה','4',NULL),(13,'201','סוויטה AP','2','140','חניה','4',NULL),(14,'202','DLX','2','80','טפט','4',NULL),(15,'203','DLX','2','80','טפט','4',NULL),(16,'204','DLX','2','80','טפט','4',NULL),(17,'205','EXE','2','100','טפט','4',NULL),(18,'206','EXE','2','100','טפט','4',NULL),(19,'207','EXE','2','100','אגם','4',NULL),(20,'208','סוויטה AP','2','140','אגם','4',NULL),(21,'209','סוויטה AP','2','140','אגם','4',NULL),(22,'210','DLX','2','80','יער','4',NULL),(23,'211','DLX','2','80','יער','4',NULL),(24,'212','DLX','2','80','יער','4',NULL),(25,'213','DLX','2','80','יער','4',NULL),(26,'214','DLX','2','80','יער','4',NULL),(27,'215','DLX','2','80','יער','4',NULL),(28,'216','DLX','2','80','יער','4',NULL),(29,'217','סוויטה AP','2','140','יער','4',NULL),(30,'301','סוויטה AP','3','140','טפט','4',NULL),(31,'302','DLX','3','80','טפט','4',NULL),(32,'303','DLX','3','80','טפט','4',NULL),(33,'304','DLX','3','80','טפט','4',NULL),(34,'305','EXE','3','100','טפט','4',NULL),(35,'306','EXE','3','100','אגם','4',NULL),(36,'307','EXE','3','100','אגם','4',NULL),(37,'308','סוויטה AP','3','140','אגם','4',NULL),(38,'309','סוויטה AP','3','140','אגם','4',NULL),(39,'310','DLX','3','80','יער','4',NULL),(40,'311','DLX','3','80','יער','4',NULL),(41,'312','DLX','3','80','יער','4',NULL),(42,'313','DLX','3','80','יער','4',NULL),(43,'314','DLX','3','80','יער','4',NULL),(44,'315','DLX','3','80','יער','4',NULL),(45,'316','DLX','3','80','יער','4',NULL),(46,'317','סוויטה AP','3','140','יער','4',NULL),(63,'401','סוויטה AP','4','140','אגם','4',NULL),(64,'402','DLX','4','80','אגם','4',NULL),(65,'403','EXE','4','100','אגם','4',NULL),(66,'404','EXE','4','100','אגם','4',NULL),(67,'405','EXE','4','100','אגם','4',NULL),(68,'406','EXE','4','100','אגם','4',NULL),(69,'407','EXE','4','100','אגם','4',NULL),(70,'408','סוויטה AP','4','140','אגם','4',NULL),(71,'409','סוויטה AP','4','140','אגם','4',NULL),(72,'410','DLX','4','80','יער','4',NULL),(73,'411','DLX','4','80','יער','4',NULL),(74,'412','DLX','4','80','יער','4',NULL),(75,'413','DLX','4','80','יער','4',NULL),(76,'414','DLX','4','80','יער','4',NULL),(77,'415','DLX','4','80','יער','4',NULL),(78,'416','DLX','4','80','יער','4',NULL),(79,'417','סוויטה AP','4','140','יער','4',NULL),(80,'501','סוויטה AP','5','140','אגם','4',NULL),(81,'502','SUP','5','60','אגם','2',NULL),(82,'503','SUP','5','60','אגם','2',NULL),(83,'504','SUP','5','60','אגם','2',NULL),(84,'505','SUP','5','60','אגם','2',NULL),(85,'506','SUP','5','60','אגם','2',NULL),(86,'507','SUP','5','60','אגם','2',NULL),(87,'508','סוויטת DELUX','5','220','אגם','4',NULL),(88,'509','SUP','5','60','יער','2',NULL),(89,'510','SUP','5','60','יער','2',NULL),(90,'511','SUP','5','60','יער','2',NULL),(91,'512','SUP','5','60','יער','2',NULL),(92,'513','SUP','5','60','יער','2',NULL),(93,'514','SUP','5','60','יער','2',NULL),(94,'515','סוויטה AP','6','140','יער','4',NULL),(95,'601','סוויטה DELUX','6','200','אגם','4',NULL),(96,'602','סוויטה DELUX','6','200','אגם','4',NULL),(97,'603','סוויטה DELUX','6','200','אגם','4',NULL),(98,'604','סוויטה DELUX','6','200','יער','4',NULL),(99,'605','סוויטה DELUX','6','200','יער','4',NULL),(100,'606','סוויטה DELUX','6','200','יער','4',NULL)`,
  },

  room_taken: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    indexes: [
      { name: 'uq_room_family', columns: ['room_id', 'family_id'], unique: true },
    ],
    foreignKeys: [
      { name: 'fk_rt_room',   column: 'room_id',   refTable: 'rooms',    refColumn: 'rooms_id',  onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      { name: 'fk_rt_family', column: 'family_id', refTable: 'families', refColumn: 'family_id', onDelete: 'CASCADE',  onUpdate: 'CASCADE' },
    ],
    columns: [
      { name: 'id',         definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'family_id',  definition: 'varchar(45) NOT NULL' },
      { name: 'start_date', definition: 'date NOT NULL' },
      { name: 'end_date',   definition: 'date NOT NULL' },
      { name: 'room_id',    definition: 'varchar(45) NOT NULL' },
    ],
  },

  user_room_assignments: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    foreignKeys: [
      { name: 'fk_ura_room',   column: 'room_id',   refTable: 'rooms',    refColumn: 'rooms_id',  onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      { name: 'fk_ura_family', column: 'family_id', refTable: 'families', refColumn: 'family_id', onDelete: 'CASCADE',  onUpdate: 'CASCADE' },
    ],
    columns: [
      { name: 'id',        definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'room_id',   definition: 'varchar(45) NOT NULL' },
      { name: 'family_id', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'user_id',   definition: 'varchar(45) DEFAULT NULL' },
      // NOTE: `week_chosen` deliberately NOT defined here (orphan column,
      // unused by any code; present in 1 tenant only — reported, never dropped).
    ],
  },

  payments: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                  definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'family_id',           definition: 'varchar(45) NOT NULL' },
      { name: 'user_id',             definition: 'varchar(255) DEFAULT NULL' },
      { name: 'amount',              definition: 'decimal(10,2) NOT NULL' },
      { name: 'payment_method',      definition: "varchar(45) NOT NULL DEFAULT 'מזומן'" },
      { name: 'payment_date',        definition: 'date NOT NULL' },
      { name: 'notes',               definition: 'text' },
      { name: 'receipt',             definition: "tinyint DEFAULT '0'" },
      { name: 'status',              definition: "varchar(20) NOT NULL DEFAULT 'completed'" },
      { name: 'payment_gateway',     definition: "varchar(45) DEFAULT 'manual'" },
      { name: 'low_profile_code',    definition: 'varchar(255) DEFAULT NULL' },
      { name: 'payment_url',         definition: 'text' },
      { name: 'approval_number',     definition: 'varchar(100) DEFAULT NULL' },
      { name: 'card_last_four',      definition: 'varchar(10) DEFAULT NULL' },
      { name: 'card_owner_name',     definition: 'varchar(255) DEFAULT NULL' },
      { name: 'invoice_number',      definition: 'varchar(100) DEFAULT NULL' },
      { name: 'webhook_received_at', definition: 'timestamp NULL DEFAULT NULL' },
      { name: 'created_at',          definition: 'timestamp NULL DEFAULT CURRENT_TIMESTAMP' },
      { name: 'updated_at',          definition: 'timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
  },

  expenses_category: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',   definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'name', definition: 'varchar(45) NOT NULL' },
    ],
    seed: `INSERT INTO {{T}} (id, name) VALUES (1,'אירוח'),(2,'טיסות והעברות'),(3,'משרד כללי'),(4,'רכוש קבוע'),(5,'משכורות'),(6,'טיולים')`,
  },

  expenses_sub_category: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                   definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'expenses_category_id', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'name',                 definition: 'varchar(45) NOT NULL' },
    ],
    seed: `INSERT INTO {{T}} (id, expenses_category_id, name) VALUES (1,'1','מלון'),(2,'2','טיסות כללי'),(3,'2','טיסות קבוצה אל על '),(4,'2','העברות'),(5,'6','אוטובוסים'),(6,'6','טיולים כניסות'),(7,'1','קונטיינר'),(8,'1','בשר'),(9,'1','עופות '),(10,'1','דגים'),(11,'1','שלומוביץ חלבי'),(12,'2','הובלות קונטיינר'),(13,'1','הובלות אירופה'),(14,'1','משאית קירור '),(15,'3','רכב'),(16,'1','אומנים מקומיים'),(17,'1','אומנים'),(18,'1','הגברה'),(19,'1','שוק מקומי'),(20,'1','מטבח רכוש'),(21,'1','צוות מטבח'),(22,'1','שף'),(23,'1','מחסנאי'),(24,'1','קונדיטור'),(25,'1','משגיח'),(26,'2','טיסות צוות'),(27,'6','מדריך'),(28,'1','מארחת'),(29,'3','תהילה'),(30,'1','כשרות'),(31,'3','פרסום'),(32,'3','משרד'),(33,'5','משכורות'),(34,'2','טיסות קבוצה hisky'),(35,'2','העברות פרטיות'),(36,'6','חניות')`,
  },

  future_expenses: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                       definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'expenditure',              definition: 'varchar(45) DEFAULT NULL' },
      { name: 'payment_currency',         definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenses_category_id',     definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenses_sub_category_id', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'payment_date',             definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenditure_ils',          definition: 'varchar(45) DEFAULT NULL' },
      { name: 'action_id',                definition: 'varchar(455) DEFAULT NULL' },
    ],
  },

  expenses: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                       definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'expenditure',              definition: 'varchar(45) DEFAULT NULL' },
      { name: 'payment_currency',         definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenses_category_id',     definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenses_sub_category_id', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'payment_date',             definition: 'varchar(45) DEFAULT NULL' },
      { name: 'planned_payment_date',     definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenditure_ils',          definition: 'varchar(45) DEFAULT NULL' },
      { name: 'is_paid',                  definition: "tinyint DEFAULT '0'" },
      { name: 'actual_payment_date',      definition: 'varchar(45) DEFAULT NULL' },
      { name: 'action_id',                definition: 'varchar(455) DEFAULT NULL' },
      { name: 'is_unexpected',            definition: "tinyint DEFAULT '0'" },
    ],
  },

  exchange_rates: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',     definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'ccy',    definition: 'varchar(45) DEFAULT NULL' },
      { name: 'amount', definition: 'varchar(45) DEFAULT NULL' },
    ],
  },

  income_category: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',   definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'name', definition: 'varchar(45) NOT NULL' },
    ],
    seed: `INSERT INTO {{T}} (id, name) VALUES (1,'תשלומי משפחות'),(2,'חסויות'),(3,'אחר')`,
  },

  income_sub_category: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                 definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'income_category_id', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'name',               definition: 'varchar(45) NOT NULL' },
    ],
  },

  income: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                       definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'expenditure',              definition: 'varchar(45) DEFAULT NULL' },
      { name: 'payment_currency',         definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenses_category_id',     definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenses_sub_category_id', definition: 'varchar(45) DEFAULT NULL' },
      { name: 'planned_payment_date',     definition: 'varchar(45) DEFAULT NULL' },
      { name: 'actual_payment_date',      definition: 'varchar(45) DEFAULT NULL' },
      { name: 'expenditure_ils',          definition: 'varchar(45) DEFAULT NULL' },
      { name: 'is_paid',                  definition: "tinyint DEFAULT '0'" },
      { name: 'action_id',                definition: 'varchar(455) DEFAULT NULL' },
      { name: 'description',              definition: 'varchar(255) DEFAULT NULL' },
    ],
  },

  leads: {
    options: ENGINE_AI,
    primaryKey: '(`lead_id`)',
    columns: [
      { name: 'lead_id',     definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'full_name',   definition: 'varchar(100) NOT NULL' },
      { name: 'phone',       definition: 'varchar(30) DEFAULT NULL' },
      { name: 'email',       definition: 'varchar(100) DEFAULT NULL' },
      { name: 'family_size', definition: "int DEFAULT '1'" },
      { name: 'status',      definition: "varchar(50) NOT NULL DEFAULT 'new_interest'" },
      { name: 'source',      definition: "varchar(50) NOT NULL DEFAULT 'phone'" },
      { name: 'notes',       definition: 'text' },
      { name: 'referred_by', definition: 'varchar(100) DEFAULT NULL' },
      { name: 'is_active',   definition: "tinyint(1) NOT NULL DEFAULT '1'" },
      { name: 'assigned_to', definition: 'int DEFAULT NULL' },
      { name: 'created_at',  definition: 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { name: 'updated_at',  definition: 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
  },

  lead_notes: {
    options: ENGINE_AI,
    primaryKey: '(`note_id`)',
    columns: [
      { name: 'note_id',    definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'lead_id',    definition: 'int NOT NULL' },
      { name: 'note_text',  definition: 'text NOT NULL' },
      { name: 'created_by', definition: 'int DEFAULT NULL' },
      { name: 'created_at', definition: 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },

  family_document_types: {
    options: 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',          definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'type_key',    definition: 'varchar(50) NOT NULL' },
      { name: 'label',       definition: 'varchar(100) NOT NULL' },
      { name: 'is_required', definition: "tinyint(1) NOT NULL DEFAULT '1'" },
      { name: 'sort_order',  definition: "int NOT NULL DEFAULT '0'" },
      { name: 'created_at',  definition: 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
    seed: `INSERT INTO {{T}} (type_key, label, is_required, sort_order) VALUES ('id_passport', 'צילום תעודת זהות / דרכון', 1, 1), ('flight_ticket', 'כרטיסי טיסה', 1, 2)`,
  },

  family_documents: {
    options: 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',          definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'family_id',   definition: 'varchar(45) NOT NULL' },
      { name: 'user_id',     definition: 'varchar(45) NOT NULL' },
      { name: 'doc_type_id', definition: 'int NOT NULL' },
      { name: 'file_name',   definition: 'varchar(200) NOT NULL' },
      { name: 'file_path',   definition: 'varchar(500) NOT NULL' },
      { name: 'uploaded_at', definition: 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },

  family_signatures: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                   definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'family_id',            definition: 'varchar(45) NOT NULL' },
      { name: 'signer_name',          definition: 'varchar(100) NOT NULL' },
      { name: 'signature_image_path', definition: 'varchar(500) NOT NULL' },
      { name: 'signed_at',            definition: 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { name: 'ip_address',           definition: 'varchar(45) DEFAULT NULL' },
    ],
  },

  staff: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',            definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'name',          definition: 'varchar(100) NOT NULL' },
      { name: 'role',          definition: 'varchar(100) DEFAULT NULL' },
      { name: 'location',      definition: 'varchar(45) DEFAULT NULL' },
      { name: 'room_number',   definition: 'varchar(10) DEFAULT NULL' },
      { name: 'persons_count', definition: "int DEFAULT '1'" },
      { name: 'notes',         definition: 'text' },
    ],
  },

  vehicles: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',           definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'family_id',    definition: 'varchar(45) DEFAULT NULL' },
      { name: 'family_name',  definition: 'varchar(100) DEFAULT NULL' },
      { name: 'vehicle_type', definition: 'varchar(100) DEFAULT NULL' },
      { name: 'seats',        definition: 'int DEFAULT NULL' },
      { name: 'cost',         definition: 'decimal(10,2) DEFAULT NULL' },
      { name: 'currency',     definition: "varchar(10) DEFAULT 'EUR'" },
      { name: 'notes',        definition: 'text' },
    ],
  },

  booking_submissions: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',                 definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'family_id',          definition: 'varchar(45) NOT NULL' },
      { name: 'contact_name',       definition: 'varchar(100) DEFAULT NULL' },
      { name: 'contact_phone',      definition: 'varchar(20) DEFAULT NULL' },
      { name: 'contact_email',      definition: 'varchar(100) DEFAULT NULL' },
      { name: 'contact_address',    definition: 'varchar(200) DEFAULT NULL' },
      { name: 'payment_preference', definition: 'varchar(30) DEFAULT NULL' },
      { name: 'special_requests',   definition: 'text' },
      { name: 'submitted_at',       definition: 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },

  booking_guests: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',              definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'submission_id',   definition: 'int NOT NULL' },
      { name: 'full_name_he',    definition: 'varchar(100) DEFAULT NULL' },
      { name: 'full_name_en',    definition: 'varchar(100) DEFAULT NULL' },
      { name: 'passport_number', definition: 'varchar(50) DEFAULT NULL' },
      { name: 'passport_expiry', definition: 'varchar(20) DEFAULT NULL' },
      { name: 'date_of_birth',   definition: 'varchar(20) DEFAULT NULL' },
      { name: 'gender',          definition: 'varchar(10) DEFAULT NULL' },
      { name: 'food_preference', definition: 'varchar(50) DEFAULT NULL' },
      { name: 'sort_order',      definition: "int DEFAULT '0'" },
    ],
  },

  // `files` — written to by sql/query/userQuery.js but historically absent
  // from every schema source. Now part of the single source of truth.
  files: {
    options: ENGINE_AI,
    primaryKey: '(`id`)',
    columns: [
      { name: 'id',         definition: 'int NOT NULL AUTO_INCREMENT' },
      { name: 'filename',   definition: 'text NOT NULL' },
      { name: 'fileType',   definition: 'text NOT NULL' },
      { name: 'filePath',   definition: 'text NOT NULL' },
      { name: 'family_id',  definition: 'varchar(455) DEFAULT NULL' },
      { name: 'uploadedAt', definition: 'datetime DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
};

// Creation order matters: parents (rooms, families) before children that
// declare foreign keys to them (room_taken, user_room_assignments).
const TENANT_TABLE_ORDER = [
  'families',
  'rooms',
  'flights',
  'guest',
  'notes',
  'room_taken',
  'user_room_assignments',
  'payments',
  'expenses_category',
  'expenses_sub_category',
  'future_expenses',
  'expenses',
  'exchange_rates',
  'income_category',
  'income_sub_category',
  'income',
  'leads',
  'lead_notes',
  'family_document_types',
  'family_documents',
  'family_signatures',
  'staff',
  'vehicles',
  'booking_submissions',
  'booking_guests',
  'files',
];

module.exports = {
  SHARED_TABLE_SCHEMAS,
  SHARED_TABLE_ORDER,
  TENANT_TABLE_SCHEMAS,
  TENANT_TABLE_ORDER,
};
