-- ============================================================================
-- MANUAL CLEANUP — drop legacy schema artifacts (signatures + uploads + booking
-- + dead tables). Generated for the 2026-05 legacy cleanup.
--
-- ⚠️  RUN THIS ONLY AFTER the code changes are deployed and the server is
--     restarted (pm2 restart). Dropping these while a route/reader is still
--     mounted would 500 live requests.
--
-- ⚠️  The migration engine (migrations/engine.js) is ADD-ONLY and will NEVER
--     run these drops. This file is intentional, manual, out-of-band SQL.
--
-- ⚠️  These are per-tenant objects. Run the per-tenant block once for EVERY
--     tenant database. List the tenants from the shared DB first:
--
--        SELECT vacation_id FROM trip_tracker.vacations;
--
--     Each tenant DB is named  trip_tracker_<vacation_id>.
--
-- NOTHING here touches families.doc_token — it stays (used by Documents).
-- NOTHING here touches family_documents — it stays (Documents feature).
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
-- PER-TENANT BLOCK — repeat for each trip_tracker_<id>.
-- Replace <ID> below, or wrap each in  USE `trip_tracker_<ID>`;  and run.
-- ────────────────────────────────────────────────────────────────────────────

-- USE `trip_tracker_<ID>`;

-- 1. Old signature flow
DROP TABLE IF EXISTS `family_signatures`;
ALTER TABLE `families` DROP COLUMN `signature_sent_at`;   -- KEEP families.doc_token

-- 2. Old booking flow
DROP TABLE IF EXISTS `booking_guests`;        -- child first (references submission_id)
DROP TABLE IF EXISTS `booking_submissions`;

-- 3. Dead tables (never read/written by any code)
DROP TABLE IF EXISTS `payments_old`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `vehicles`;

-- 4. Orphan column — present in only ONE tenant. The plain statement errors on
--    tenants that lack it, so use this idempotent guarded form instead:
SET @ddl := (
  SELECT IF(
    COUNT(*) > 0,
    'ALTER TABLE `user_room_assignments` DROP COLUMN `week_chosen`',
    'SELECT "week_chosen absent — skipped"'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'user_room_assignments'
    AND COLUMN_NAME  = 'week_chosen'
);
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ────────────────────────────────────────────────────────────────────────────
-- END PER-TENANT BLOCK
-- ────────────────────────────────────────────────────────────────────────────


-- Note: the old signature/upload/booking files left behind on disk are NOT a DB
-- concern. After deploy, on the production server delete only:
--   server/uploads/<vacationId>/signatures/*      (old signature PNGs)
--   server/uploads/<vacationId>/<familyName>/*     (old "קבצים" uploads)
-- KEEP  server/uploads/<vacationId>/docs/*         (Documents feature, still live)
-- and KEEP the /uploads express.static mount.
