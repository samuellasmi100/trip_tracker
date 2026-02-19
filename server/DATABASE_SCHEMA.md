# Database Schema Documentation

> Auto-generated from actual MySQL database on 2026-02-19

## Architecture Overview

The system uses a **multi-database architecture**:

- **`trip_tracker`** — Shared/global database for authentication and vacation metadata
- **`trip_tracker_{vacationId}`** — Per-vacation database (one per vacation, dynamically created)

Vacation IDs are UUIDs with hyphens replaced by underscores (e.g., `63dfd70c_6454_4d44_ae28_5d2a12235c3f`).

### Current Databases

| Database | Purpose |
|---|---|
| `trip_tracker` | Shared: users, vacations list, vacation dates |
| `trip_tracker_7ede9a79_2fe8_4ac1_b0a7_978647f1cf94` | Vacation: פסח 25 (Apr 10-21, 2025) |
| `trip_tracker_63dfd70c_6454_4d44_ae28_5d2a12235c3f` | Vacation: קיץ 25 (Aug 4-10, 2025) |

---

## Shared Database: `trip_tracker`

### `user` — System login accounts

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| email | varchar(45) | YES | | NULL | |
| password | varchar(455) | YES | | NULL | |
| permission | varchar(45) | YES | | NULL | |
| type | varchar(45) | YES | | NULL | |

**Indexes:** PRIMARY (id)

**Notes:**
- Passwords are SHA-256 hashed (via `jshashes` library)
- `permission` — used in JWT token payload; value `"1"` appears to indicate admin
- `type` — currently NULL for all users; purpose unclear (unused?)
- Only 3 users exist; no unique constraint on `email`

**Sample Data:**
| id | email | permission |
|---|---|---|
| 1 | slasmy@gmail.com | 1 |
| 2 | moshe@avimor-vacation.com | NULL |
| 3 | office@avimor-vacation.com | NULL |

---

### `vacations` — Vacation registry

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| name | varchar(45) | YES | | NULL | |
| vacation_id | varchar(455) | YES | | NULL | |

**Indexes:** PRIMARY (id)

**Notes:**
- `vacation_id` is the UUID string used to name the per-vacation database
- No unique constraint on `vacation_id`

**Sample Data:**
| id | name | vacation_id |
|---|---|---|
| 21 | פסח 25 | 7ede9a79_2fe8_4ac1_b0a7_978647f1cf94 |
| 22 | קיץ 25 | 63dfd70c_6454_4d44_ae28_5d2a12235c3f |

---

### `vacation_date` — Vacation date ranges (sub-periods)

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| vacation_id | varchar(45) | YES | | NULL | |
| start_date | varchar(45) | YES | | NULL | |
| end_date | varchar(45) | YES | | NULL | |
| name | varchar(45) | YES | | NULL | |

**Indexes:** PRIMARY (id)

**Notes:**
- A vacation can have multiple date ranges (e.g., "שבוע 1", "שבועיים")
- Dates stored as `varchar(45)` strings in `YYYY-MM-DD` format, not DATE type
- No foreign key to `vacations` table

**Sample Data:**
| id | vacation_id | start_date | end_date | name |
|---|---|---|---|---|
| 31 | 7ede9a79... | 2025-04-10 | 2025-04-21 | שבוע 1 |
| 32 | 7ede9a79... | | | שבועיים |
| 33 | 63dfd70c... | 2025-08-04 | 2025-08-10 | שבוע 1 |

---

## Per-Vacation Database: `trip_tracker_{vacationId}`

Each vacation gets its own database with the following 16 tables. Created via `sql/utils/createDb.js` using the schema dump in `sql/query/trip_tracker_dump.js`.

### `families` — Family groups

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| family_id | varchar(45) | NO | UNI | NULL | |
| family_name | varchar(45) | NO | | NULL | |

**Indexes:** PRIMARY (id), UNIQUE uq_family_id (family_id)

**Notes:**
- `family_id` is a client-generated UUID
- Family name is typically derived from the main guest's Hebrew name

---

### `guest` — All guests (parents and children)

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| user_id | varchar(455) | YES | | NULL | |
| hebrew_first_name | varchar(45) | YES | | NULL | |
| hebrew_last_name | varchar(45) | YES | | NULL | |
| english_first_name | varchar(55) | YES | | NULL | |
| english_last_name | varchar(45) | YES | | NULL | |
| phone_a | varchar(45) | YES | | NULL | |
| phone_b | varchar(45) | YES | | NULL | |
| email | varchar(45) | YES | | NULL | |
| identity_id | varchar(45) | YES | | NULL | |
| family_id | varchar(45) | NO | | NULL | |
| flights | varchar(45) | YES | | NULL | |
| number_of_guests | varchar(45) | YES | | NULL | |
| number_of_rooms | varchar(45) | YES | | NULL | |
| total_amount | varchar(45) | YES | | NULL | |
| flights_direction | varchar(45) | YES | | NULL | |
| flying_with_us | tinyint | YES | | 1 | |
| is_main_user | tinyint | YES | | 0 | |
| user_type | varchar(45) | YES | | NULL | |
| is_in_group | tinyint | YES | | 0 | |
| arrival_date | varchar(45) | YES | | "" | |
| departure_date | varchar(45) | YES | | "" | |
| address | varchar(45) | YES | | "" | |
| week_chosen | varchar(45) | YES | | NULL | |
| date_chosen | varchar(45) | YES | | NULL | |
| age | varchar(45) | YES | | NULL | |
| birth_date | varchar(45) | YES | | NULL | |
| number_of_payments | varchar(45) | YES | | NULL | |

**Notes:**
- `user_id` is a UUID generated client-side
- `is_main_user = 1` marks the family head/contact person (parent type)
- `user_type`: "parent" or "client" (child/guest)
- `is_in_group`: whether the guest is part of the group flight booking
- `family_id` links to `families.family_id` (no FK constraint)
- Numeric fields like `total_amount`, `number_of_guests`, `number_of_rooms`, `age` are stored as varchar
- Dates (`arrival_date`, `departure_date`, `birth_date`) stored as varchar, not DATE

---

### `flights` — Flight booking details

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| child_id | varchar(45) | YES | | NULL | |
| validity_passport | varchar(45) | YES | | NULL | |
| passport_number | varchar(45) | YES | | NULL | |
| birth_date | varchar(45) | YES | | NULL | |
| outbound_flight_date | varchar(45) | YES | | NULL | |
| return_flight_date | varchar(45) | YES | | NULL | |
| outbound_flight_number | varchar(45) | YES | | NULL | |
| age | varchar(45) | YES | | NULL | |
| parent_id | varchar(45) | YES | | NULL | |
| return_flight_number | varchar(45) | YES | | NULL | |
| family_id | varchar(45) | YES | | NULL | |
| outbound_airline | varchar(45) | YES | | NULL | |
| return_airline | varchar(45) | YES | | NULL | |
| is_source_user | tinyint | YES | | 0 | |
| user_id | varchar(45) | YES | | NULL | |
| user_classification | varchar(45) | YES | | NULL | |

**Notes:**
- `is_source_user = 1` indicates the user's own flight record (vs. inherited from parent)
- `user_id` links to `guest.user_id`
- `family_id` links to `families.family_id`
- `child_id`/`parent_id` — legacy columns for parent-child flight relationships

---

### `rooms` — Hotel room inventory

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| rooms_id | varchar(45) | NO | UNI | NULL | |
| type | varchar(45) | NO | | NULL | |
| floor | varchar(45) | NO | | NULL | |
| size | varchar(45) | NO | | NULL | |
| direction | varchar(45) | YES | | NULL | |
| base_occupancy | varchar(45) | YES | | NULL | |
| max_occupancy | varchar(45) | YES | | NULL | |

**Indexes:** PRIMARY (id), UNIQUE uq_rooms_id (rooms_id)

**Notes:**
- `rooms_id` is the room number (e.g., "101", "202") — this is the business key
- Room types: `סוויטה AP`, `DLX`, `EXE`, `SUP`, `סוויטת DELUX`, `סוויטה DELUX`
- `direction`: view direction (טפט, חניה, אגם, יער, טפט יער)
- `size`: room size in sqm (60, 80, 100, 140, 200, 220)
- 100 rooms pre-seeded on creation (rooms 101-606 across floors 1-6)
- Numeric fields stored as varchar
- `is_taken` column was dropped (was always "0"; availability is tracked in `room_taken`)

---

### `room_taken` — Room booking periods

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| family_id | varchar(45) | NO | MUL | NULL | FK → families(family_id) |
| start_date | DATE | NO | | NULL | |
| end_date | DATE | NO | | NULL | |
| room_id | varchar(45) | NO | MUL | NULL | FK → rooms(rooms_id) |

**Indexes:** PRIMARY (id), UNIQUE uq_room_family (room_id, family_id)

**Foreign Keys:**
- `fk_rt_room`: room_id → rooms(rooms_id) ON DELETE RESTRICT ON UPDATE CASCADE
- `fk_rt_family`: family_id → families(family_id) ON DELETE CASCADE ON UPDATE CASCADE

**Notes:**
- Links a family to a room for a date range
- Used for availability checking (overlap detection in `roomsQuery.getRoomAvailable`)
- Half-day check-in/check-out logic: `end_date > newStart AND start_date < newEnd` — so a room whose booking ends on day X is available for a new booking that starts on day X
- `start_date`/`end_date` are proper DATE columns (migrated from VARCHAR in 001_fix_rooms.js)

---

### `user_room_assignments` — Individual guest-to-room assignments

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| room_id | varchar(45) | NO | MUL | NULL | FK → rooms(rooms_id) |
| family_id | varchar(45) | YES | MUL | NULL | FK → families(family_id) |
| user_id | varchar(45) | YES | | NULL | |

**Indexes:** PRIMARY (id)

**Foreign Keys:**
- `fk_ura_room`: room_id → rooms(rooms_id) ON DELETE RESTRICT ON UPDATE CASCADE
- `fk_ura_family`: family_id → families(family_id) ON DELETE CASCADE ON UPDATE CASCADE

**Notes:**
- Assigns individual guests to specific rooms within a family's room booking
- Used to count people per room

---

---

### `payments` — Payment records

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| payment_date | varchar(45) | NO | | NULL | |
| amount | varchar(45) | NO | | NULL | |
| form_of_payment | varchar(45) | NO | | NULL | |
| remains_to_be_paid | varchar(45) | YES | | NULL | |
| payment_currency | varchar(45) | NO | | NULL | |
| amount_received | varchar(45) | YES | | NULL | |
| family_id | varchar(45) | YES | | NULL | |
| created_at | timestamp | YES | | CURRENT_TIMESTAMP | |
| user_id | varchar(45) | YES | | NULL | |
| invoice | tinyint | YES | | 0 | |
| is_paid | tinyint | YES | | 0 | |
| updated_at | varchar(455) | YES | | NULL | |

**Notes:**
- `is_paid` tracks whether the payment has been confirmed/received
- Monetary amounts stored as varchar (not decimal)
- `form_of_payment`: free text (e.g., "credit card", "bank transfer")
- `family_id` + `user_id` link to guest

---

### `notes` — Notes/comments per guest

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| parent_id | varchar(455) | YES | | NULL | |
| note | varchar(999) | YES | | NULL | |
| child_id | varchar(455) | YES | | NULL | |
| family_id | varchar(45) | YES | | NULL | |
| category_name | varchar(45) | YES | | NULL | |
| user_id | varchar(455) | YES | | NULL | |

**Notes:**
- `parent_id` and `child_id` appear to be legacy columns
- Current code uses `user_id` and `family_id` for lookups
- `category_name` allows grouping notes by category

---

### `files` — Uploaded file records

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| filename | text | NO | | NULL | |
| fileType | text | NO | | NULL | |
| filePath | text | NO | | NULL | |
| family_id | varchar(455) | YES | | NULL | |
| uploadedAt | datetime | YES | | CURRENT_TIMESTAMP | |

**Notes:**
- Files are stored on disk at `server/uploads/{vacationId}/{familyName}/`
- Only PDF and JPEG uploads allowed (via multer file filter)
- `family_id` links to the uploading family

---

### `expenses_category` — Budget expense categories

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| name | varchar(45) | NO | | NULL | |

**Pre-seeded Data:**
| id | name |
|---|---|
| 1 | אירוח (Hospitality) |
| 2 | טיסות והעברות (Flights & Transfers) |
| 3 | משרד כללי (General Office) |
| 4 | רכוש קבוע (Fixed Assets) |
| 5 | משכורות (Salaries) |
| 6 | טיולים (Tours) |

---

### `expenses_sub_category` — Budget expense sub-categories

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| expenses_category_id | varchar(45) | YES | | NULL | |
| name | varchar(45) | NO | | NULL | |

**Notes:**
- `expenses_category_id` links to `expenses_category.id` (no FK constraint)
- 36 sub-categories pre-seeded (e.g., מלון, טיסות כללי, בשר, דגים, etc.)

---

### `expenses` — Actual expenses

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| expenditure | varchar(45) | YES | | NULL | |
| payment_currency | varchar(45) | YES | | NULL | |
| expenses_category_id | varchar(45) | YES | | NULL | |
| expenses_sub_category_id | varchar(45) | YES | | NULL | |
| planned_payment_date | varchar(45) | YES | | NULL | |
| expenditure_ils | varchar(45) | YES | | NULL | |
| is_paid | tinyint | YES | | 0 | |
| action_id | varchar(455) | YES | | NULL | |
| actual_payment_date | varchar(45) | YES | | NULL | |
| is_unexpected | tinyint | YES | | 0 | |
| payment_date | varchar(45) | YES | | NULL | |

**Notes:**
- `action_id` is a UUID used as a business key for updates/deletes
- `expenditure` is the amount in original currency, `expenditure_ils` is the ILS equivalent
- `is_unexpected` flags unplanned expenses

---

### `future_expenses` — Planned/forecast expenses

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| expenditure | varchar(45) | YES | | NULL | |
| payment_currency | varchar(45) | YES | | NULL | |
| expenses_category_id | varchar(45) | YES | | NULL | |
| expenses_sub_category_id | varchar(45) | YES | | NULL | |
| payment_date | varchar(45) | YES | | NULL | |
| expenditure_ils | varchar(45) | YES | | NULL | |
| action_id | varchar(45) | YES | | NULL | |

**Notes:**
- Same structure as `expenses` but for planned/forecasted costs
- Missing `is_paid`, `actual_payment_date`, `is_unexpected` (not applicable)

---

### `exchange_rates` — Currency exchange rates

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| ccy | varchar(45) | YES | | NULL | |
| amount | varchar(45) | YES | | NULL | |

**Sample Data:**
| id | ccy | amount |
|---|---|---|
| 9 | דולר | 3.8 |
| 10 | יורו | 4.2 |

**Notes:**
- Currency names in Hebrew
- Exchange rate relative to ILS
- Amount stored as varchar

---

### `income_category` — Budget income categories

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| name | varchar(45) | NO | | NULL | |

**Pre-seeded Data:**
| id | name |
|---|---|
| 1 | תשלומי משפחות (Family Payments) |
| 2 | חסויות (Sponsorships) |
| 3 | אחר (Other) |

---

### `income_sub_category` — Budget income sub-categories

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| income_category_id | varchar(45) | YES | | NULL | |
| name | varchar(45) | NO | | NULL | |

---

### `income` — Income records

| Column | Type | Nullable | Key | Default | Extra |
|---|---|---|---|---|---|
| id | int | NO | PRI | NULL | auto_increment |
| expenditure | varchar(45) | YES | | NULL | |
| payment_currency | varchar(45) | YES | | NULL | |
| expenses_category_id | varchar(45) | YES | | NULL | |
| expenses_sub_category_id | varchar(45) | YES | | NULL | |
| planned_payment_date | varchar(45) | YES | | NULL | |
| actual_payment_date | varchar(45) | YES | | NULL | |
| expenditure_ils | varchar(45) | YES | | NULL | |
| is_paid | tinyint | YES | | 0 | |
| action_id | varchar(455) | YES | | NULL | |
| description | varchar(255) | YES | | NULL | |

**Notes:**
- Column names reuse `expenses_*` naming (from copy-paste of expenses schema)
- `description` field is unique to income (not in expenses)

---

## Entity Relationships (Logical)

```
trip_tracker.vacations.vacation_id ──────┐
trip_tracker.vacation_date.vacation_id ──┘─── identifies ──→ trip_tracker_{vacationId} database

Within each per-vacation database:

families.family_id ─────┬──→ guest.family_id
                        ├──→ room_taken.family_id
                        ├──→ user_room_assignments.family_id
                        ├──→ payments.family_id
                        ├──→ notes.family_id
                        └──→ files.family_id

guest.user_id ──────────┬──→ flights.user_id
                        ├──→ user_room_assignments.user_id
                        ├──→ payments.user_id
                        └──→ notes.user_id

rooms.rooms_id ─────────┬──→ room_taken.room_id
                        └──→ user_room_assignments.room_id

expenses_category.id ───┬──→ expenses_sub_category.expenses_category_id
                        ├──→ expenses.expenses_category_id
                        └──→ future_expenses.expenses_category_id

income_category.id ─────┬──→ income_sub_category.income_category_id
                        └──→ income.expenses_category_id
```

**Important:** No foreign key constraints exist in the database. All relationships are enforced only at the application level.

---

## Issues & Observations

### Data Type Issues
1. **Dates stored as varchar** — `arrival_date`, `departure_date`, `birth_date`, `payment_date` are still `varchar(45)`. `room_taken.start_date`/`end_date` were migrated to `DATE` in `001_fix_rooms.js`.
2. **Numeric amounts stored as varchar** — `total_amount`, `amount`, `expenditure`, `expenditure_ils`, `number_of_guests`, `number_of_rooms`, `age`, `size`, `floor`, `base_occupancy`, `max_occupancy` are all varchar. This prevents SUM/AVG aggregations and proper numeric comparisons.

### Missing Constraints (remaining)
3. **Partial unique constraints** — `rooms(rooms_id)` and `families(family_id)` now have UNIQUE keys. `guest.user_id`, `vacation_id` in `vacations` do not yet.
4. **Partial foreign keys** — `room_taken` and `user_room_assignments` now have FKs to `rooms` and `families`. Other tables (payments, flights, notes) still have no FKs.
5. **No indexes** beyond primary keys and the new constraints — `guest.family_id`, `guest.user_id`, `flights.user_id`, `payments.family_id` etc. would benefit from indexes.

### Schema Inconsistencies (remaining)
6. **`notes` table** has `parent_id` and `child_id` columns that appear to be legacy — current code only uses `user_id` and `family_id`.
7. **`expenses` has duplicate date columns** — both `payment_date` and `planned_payment_date` exist; the code uses `planned_payment_date` as the primary date.
8. **`user` table** — `type` column is NULL for all users; unclear purpose.
9. **`vacation_date`** — `vacation_id` is varchar(45) but `vacations.vacation_id` is varchar(455). Inconsistent sizing.

### Security Concerns (remaining)
10. **SQL injection via vacationId** — Query builders interpolate `vacationId` directly into SQL schema names (e.g., `` `trip_tracker_${vacationId}` ``). Sanitized at entry points but not at the query layer.
11. **`updateRoom` column whitelist** — now uses `ALLOWED_ROOM_COLUMNS` whitelist in `roomsQuery.js`. Other dynamic-column queries (`updateGuest` etc.) may still be unguarded.

### Fixed in 001_fix_rooms.js
- ✅ `is_taken` column dropped from `rooms`
- ✅ `family_room_details` table dropped
- ✅ `room_taken.start_date`/`end_date` changed to proper DATE type
- ✅ UNIQUE KEY added on `rooms(rooms_id)` and `families(family_id)`
- ✅ UNIQUE KEY added on `room_taken(room_id, family_id)`
- ✅ Foreign keys added on `room_taken` and `user_room_assignments`
