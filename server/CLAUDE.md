# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server with nodemon (port 4000)
npm test           # Run Jest tests (--forceExit)
```

No build step required — this is plain JavaScript executed by Node.js.

## Architecture

Node.js/Express REST API for a multi-family vacation management system. Each vacation gets its own MySQL database schema (`trip_tracker_${vacationId}`), while authentication uses a shared `trip_tracker` database.

### 3-Tier Service Pattern

Every feature follows: **Controller → Service → Db**

- `services/<feature>/<feature>Controller.js` — Express Router, request/response handling
- `services/<feature>/<feature>Service.js` — Business logic
- `services/<feature>/<feature>Db.js` — Database queries via `connection-wrapper.js`

SQL query strings live in `sql/query/<feature>Query.js` as functions that interpolate the vacation-specific schema name.

### Key Modules

- **`db/connection-wrapper.js`** — MySQL2 pool with `execute()` and `executeWithParameters()` methods
- **`middleware/authMiddleware/checkAuthorization.js`** — JWT verification on all routes except `/auth/login`
- **`serverLogs/errorHandler.js`** — Express error middleware using custom `ErrorMessage` class and `ErrorType` definitions
- **`utils/logger.js`** — Winston logger writing to `error.log`, `combined.log`, `info.log`
- **`sql/utils/createDb.js`** — Creates a new vacation database via `migrations/engine.js` `migrateTenantDb`, driven by the single source of truth `migrations/schema.js`

### Request Flow

```
Request → CORS → JSON parser → Auth middleware (JWT) → Controller → Service → Db → Response
                                                                                 ↘ ErrorHandler middleware
```

### Auth

JWT-based. Passwords hashed with SHA256 (jshashes). Token payload: `{userId, permission, email}`. Token sent as Bearer in Authorization header.

## Code structure & file-size conventions

These rules apply to **new** code. Existing oversized files (`budgets/*`, `registrationsService.js`, `userDb.js`) are known outliers awaiting refactor — don't use them as templates.

### File-size targets

- **Target:** ≤ 200 lines per `.js` file (controller / service / db / query).
- **Soft limit:** at ~250 lines, plan a split before adding more.
- **Hard signal:** ≥ 350 lines almost always means more than one responsibility.

Clean reference files: `services/leads/leadsController.js` (123), `services/leads/leadsDb.js` (169), `services/bookings/*`, `sql/query/leadsQuery.js` (132).

### Feature layering — Controller → Service → Db → Query

Every server feature uses the same four-layer split. Each layer only calls the layer directly below it.

```
server/services/<feature>/
  <feature>Controller.js   // Express Router; req/res only; calls Service
  <feature>Service.js      // Business logic, validation, orchestration; calls Db
  <feature>Db.js           // Thin try/catch wrapper around connection.execute; imports SQL from Query
server/sql/query/<feature>Query.js   // SQL string builders; no JS logic, no DB calls
```

- **Controller** — `express.Router()`. Only req parsing, route definition, calling the service, `res.send`/`res.json`, and `next(err)` (optionally wrapped in `new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, …, err)`). Never call `connection.execute` directly. Never inline SQL.
- **Service** — Business logic, validation, normalization (phone, date, BiDi-stripping, etc.). Returns plain data. May compose multiple Db calls.
- **Db** — Thin `try { return await connection.execute(query.X(vacationId)) } catch { logger.error; throw }`. Imports SQL from `sql/query/<feature>Query.js`. No SQL strings inlined here.
- **Query** — Exports functions returning SQL strings. Functions take `vacationId` and interpolate it into `trip_tracker_${vacationId}`. No JS logic beyond string assembly, no `connection` access.

**Schema-name interpolation lives only in the Query layer.** `trip_tracker_${vacationId}` must not appear in services or controllers.

### Public vs protected controllers

When a feature exposes unauthenticated routes alongside protected ones, split into two controllers in the same folder. Both share the same Service and Db:

```
services/leads/leadsController.js          // mounted after auth middleware
services/leads/publicLeadsController.js    // mounted before auth middleware
```

Existing examples: `leads/`, `bookings/`, `signatures/`, `documents/`, `registrations/`.

### Adding a new feature `foo`

1. `server/services/foo/fooController.js`, `fooService.js`, `fooDb.js` (+ `publicFooController.js` only if there are unauthenticated routes).
2. `server/sql/query/fooQuery.js`.
3. Register the router in `server/index.js` next to existing mounts — protected routes after the auth middleware, public routes before it.
4. If the feature touches the DB, add tables/columns to `server/migrations/schema.js` (see HARD RULES below).

File names are camelCase (`leadsQuery.js`, `userRoomsService.js`). Folder names match what already exists (lowercase, plural where natural: `leads/`, `bookings/`; singular where existing code is: `families/`, `auth/`). Don't invent a new naming convention.

### When to extract shared logic vs inline it

Default: **inline.** Three similar lines is better than a premature abstraction.

Extract only when:
- The exact same logic appears in **two or more** features (e.g. `utils/dateNormalize.js`, `db/connection-wrapper.js`, `middleware/authMiddleware/`, `serverLogs/errorHandler.js`).
- Cross-cutting concerns that don't fit any single feature (auth, error envelope, logging, DB pool) — these have established homes; extend them rather than duplicating.

Do **not** extract:
- A helper used in one file only — keep it at the top of that file (see `normalizePhone`, `normalizeName`, `valuesEqual` at the top of `leadsService.js`).
- An abstraction with no second caller yet.

### Things that keep the good files good

- **Helpers + constants at the top of the file, exports below.** Module-scoped until a second caller appears.
- **One responsibility per layer, no shortcuts.** One file calling `connection.execute` from a controller sets the precedent for the next.
- **Comments explain WHY, not WHAT.** `leadsService.js` is a good reference — comments about Excel BiDi marks, why empty file values aren't treated as changes, etc.

## Database Schema & Migrations

MySQL2, promise-based, no ORM. Multi-tenant: a shared `trip_tracker` database
for auth/global data, plus one `trip_tracker_<vacationId>` schema per vacation.

### Single source of truth

`server/migrations/schema.js` defines the **entire** schema as data:

- `SHARED_TABLE_SCHEMAS` — the shared `trip_tracker` DB
- `TENANT_TABLE_SCHEMAS` — every per-vacation `trip_tracker_<id>` DB

Each table is `{ options, primaryKey, columns:[{name,definition}], indexes?, foreignKeys?, seed? }`.
`seed` is inserted **only** when the table is first created (never overwrites).

This one file drives **both**:
- `migrations/run_migration.js` — updates existing databases
- `sql/utils/createDb.js` — creates a new vacation DB (via `migrations/engine.js`)

So a brand-new vacation and a migrated existing vacation always converge to the
same schema. `engine.js` holds the idempotent apply logic.

#### Shared `trip_tracker` DB

| Table | Key columns | Notes |
|---|---|---|
| `user` | id, email, password, permission, type | auth users |
| `vacations` | id, name, vacation_id varchar(455), agreement_text | one row per vacation |
| `vacation_date` | id, vacation_id, start_date, end_date, name | per-vacation week ranges |
| `notifications` | id, vacation_id, type, title, message, is_read | global coordinator feed |
| `payment_provider_configs` | id, provider_type (UNIQUE), terminal_number, api_name… | Cardcom config (utf8mb4_unicode_ci) |
| `flight_companies` | id, name, created_at | airline lookup (utf8mb4_unicode_ci) |

#### Per-vacation `trip_tracker_<id>` DB

Tables: `families`, `rooms`, `flights`, `guest`, `notes`, `room_taken`,
`user_room_assignments`, `payments`, `expenses_category`,
`expenses_sub_category`, `future_expenses`, `expenses`, `exchange_rates`,
`income_category`, `income_sub_category`, `income`, `leads`, `lead_notes`,
`family_document_types`, `family_documents`, `family_signatures`, `staff`,
`vehicles`, `booking_submissions`, `booking_guests`, `files`.

Relationships / constraints:
- `families.family_id` — UNIQUE (`uq_family_id`); referenced by FKs below.
- `rooms.rooms_id` — UNIQUE (`uq_rooms_id`); referenced by FKs below.
- `room_taken` — UNIQUE (`uq_room_family` on room_id+family_id); FK `fk_rt_room`
  → rooms.rooms_id (RESTRICT/CASCADE), FK `fk_rt_family` → families.family_id
  (CASCADE/CASCADE). `start_date`/`end_date` are `DATE`.
- `user_room_assignments` — FK `fk_ura_room` → rooms.rooms_id, FK
  `fk_ura_family` → families.family_id.
- `payments` — `amount` DECIMAL(10,2), `payment_date` DATE, gateway columns.
- Seeded on creation: `rooms` (100 rows), `expenses_category` (6),
  `expenses_sub_category` (36), `income_category` (3), `family_document_types` (2).
- Most other date/numeric fields are `varchar` (legacy — do not "fix" silently).

Known untracked DB objects (intentionally NOT in schema.js — reported by the
migration, never created or dropped): `payments_old` (one-time backup from the
old payments redesign) and `user_room_assignments.week_chosen` (orphan column in
one tenant, used by zero queries/UI).

For exhaustive column lists see `migrations/schema.js` (the canonical reference).

### How to add / change a migration

1. Edit `server/migrations/schema.js` — add a column to a table's `columns`
   array, add a new table object, or add an `indexes`/`foreignKeys`/`seed`
   entry. **ADD only.**
2. Test locally: `node migrations/run_migration.js` (run from `server/`).
   It logs every change and is safe to run repeatedly.
3. Commit & push.
4. On the server: `git pull` → `node migrations/run_migration.js` →
   `pm2 restart <app>`.

There is no `trip_tracker_dump.js` step any more — it is superseded by
`schema.js` and left on disk only for reference.

### HARD RULES — never violate

- **ADD and ALTER ADD only.** Never `DROP TABLE`, `DROP COLUMN`, `DELETE`,
  `TRUNCATE`, `RENAME`, or `MODIFY` in the migration system.
- The migration is **idempotent** — safe to run any number of times.
- Anything found in the DB but absent from `schema.js` is **reported, never
  removed**. If you see such a report, surface it — do not auto-clean it.
- **Automatic startup migrations were intentionally removed.** The server no
  longer migrates on boot (`migrateSharedDb.js` / `migrateBudgetTables.js` were
  absorbed into `schema.js`/`engine.js`). Schema changes are applied **only**
  by running `node migrations/run_migration.js` manually.

## Environment Variables

Configured in `.env`: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `REST_API_PORT`, `TOKEN_SECRET_KEY`.

## Excel Data Import

The registration Excel import is a **UI flow** (Home page → "ייבוא נתונים מאקסל"
→ `POST /family-import/:vacationId`), implemented in
`server/services/familyImport/` and `client/src/components/pages/FamilyList/`. It
is the **only** import mechanism — the old `scripts/import_*.py` scripts and
`scripts/IMPORT_GUIDE.md` have been removed.

Before touching import code, **read `server/FAMILY_IMPORT_GUIDE.md` first**. It
documents the Excel column layout, the "אחר" week-column semantics, the **one-time
`N → שבוע N+1` week offset and exactly where to remove it for future vacations**,
the dedup behaviour, and the safe wipe procedure. Keep that guide updated when the
import changes.

## STRICT RULES — DO NOT VIOLATE

### Never do any of the following without explicit permission:
- `npm run build` / `npm build` / any build or compile command
- `npm start` / `npm run start` / starting the dev server
- Run migrations on production databases
- Delete or drop database tables
- Push to git (`git push`)
- Deploy anything
- Run any destructive command

**Only write code. Leave testing, building, running, and deploying to the user.**

- **NEVER browse or search inside `node_modules/`.** Check `package.json` only for dependency info.
