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

When importing Excel vacation data into the system, **always read `server/scripts/IMPORT_GUIDE.md` first** before writing any import code or running any script. The guide documents column mappings, family name matching rules, known edge cases, and pitfalls discovered during the Pesach 2024 import. Update the guide whenever new patterns or edge cases are discovered.

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
