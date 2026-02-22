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
- **`sql/utils/createDb.js`** — Creates a new vacation database from schema dump (`sql/query/trip_tracker_dump.js`)

### Request Flow

```
Request → CORS → JSON parser → Auth middleware (JWT) → Controller → Service → Db → Response
                                                                                 ↘ ErrorHandler middleware
```

### Auth

JWT-based. Passwords hashed with SHA256 (jshashes). Token payload: `{userId, permission, email}`. Token sent as Bearer in Authorization header.

## Database

MySQL2 with promise-based queries (no ORM). Per-vacation tables: `guest`, `families`, `flights`, `rooms`, `user_room_assignments`, `rooms_taken`, `payments`, `notes`, `expenses_category`, `expenses_sub_category`, `future_expenses`, `expenses`, `exchange_rates`.

## Database Change Protocol — MANDATORY

Whenever you add or modify a database table/column, you MUST do ALL THREE of the following:

**a. Update `sql/query/trip_tracker_dump.js`** — the CREATE TABLE / INSERT statements used when spinning up new vacation databases.

**b. Add a new step to `server/migrations/run_migration.js`** — there is ONE migration file, never create separate files. Add the new step inside `migrateVacationDb()` above the `// ── add new steps above this line ──` comment. Every step must be idempotent (check before acting).

**c. Update `DATABASE_SCHEMA.md`** (this folder: `server/DATABASE_SCHEMA.md`) — reflect the new columns/constraints/types.

Skipping any of these three steps is a bug. New vacations and existing vacations must always end up with the same schema.

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
