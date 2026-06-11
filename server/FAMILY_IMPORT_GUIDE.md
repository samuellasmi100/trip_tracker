# Family Import Guide

How to import a registration Excel (כללי נרשמים) into a vacation. This is the
**one and only** import mechanism — a UI flow, not a script. (The old
`server/scripts/import_*.py` scripts and `IMPORT_GUIDE.md` have been removed.)

## The flow

Home page (דף הבית, route `/workspace` → the `FamilyList` page) → **"ייבוא נתונים
מאקסל"** button → pick an `.xlsx` file → the browser parses it → `POST
/family-import/:vacationId` with the parsed rows → the server applies all rules
→ a **report dialog** shows what happened.

The target vacation is the one selected in the header (`vacationSlice.vacationId`).

### Files
- Client: `client/src/components/pages/FamilyList/FamilyList.jsx` (parser
  `parseFamilyWorkbook` + `FAMILY_COLS`, upload handlers),
  `FamilyList.view.jsx` (the button), `FamilyImportDialog/` (the report dialog),
  `client/src/apis/familyImportRequest.js`.
- Server: `server/services/familyImport/{familyImportController,familyImportService,familyImportDb}.js`,
  `server/sql/query/familyImportQuery.js`. Route registered in `server/index.js`
  as `/family-import` (after the auth middleware).

## Expected Excel column layout (by index, 0-based)

The browser reads the **first sheet**, skips the header row, and keeps only rows
that have a family name. Column positions are fixed (see `FAMILY_COLS` in
`FamilyList.jsx`):

| Idx | Hebrew header | Meaning | → field |
|----|----------------|---------|---------|
| 0  | תאריך הרשמה | Registration date `DD.MM.YY` | `families.created_at` (backdated) |
| 2  | אחר | Week / route assignment | `start_date` / `end_date` (see below) |
| 3  | משפחה | **Family name (required)** | `families.family_name` |
| 6  | נפשות כולל תינוקות | People incl. infants | `families.number_of_guests` |
| 9  | תינוקות | Infants | `families.number_of_babies` |
| 10 | חדרים | Rooms (quota) | `families.number_of_rooms` |
| 12 | סוג חדר | Room number(s) | `room_taken` (assignment) |
| 13 | הערות | Notes | `families.special_requests` |
| 14 | סה"כ מחיר | Total NIS (commas stripped) | `families.total_amount` |
| 15 | סה"כ ביורו | Total EUR (`€`/commas stripped) | `families.total_amount_eur` |

**Not imported** (ignored): col 1 ת.ז (ID), 4/5 male/female head, 7/8 pax
out/return, 11 suites, 16 USD, 17–19 flights, 20/21 trips, 22–24 phones,
25 email, 26 address. A row with no family name is skipped and reported.

## The "אחר" (week) column semantics

| Value in cell | Meaning | Result |
|---|---|---|
| bare number `N` | a single week | the part **שבוע N+1** *(see Week offset!)* — its dates are copied to the family (`type: week`) |
| `DD.MM-DD.MM` (e.g. `10.8-17.8`) | custom date range | **חריגים** exception family; dates parsed with year **2026** |
| `N+M` / `N+M+...` (e.g. `1+2`) | stays multiple weeks | **חריגים** exception — *consecutive* weeks collapse into one continuous range (earliest start → latest end) |
| non-consecutive combo (e.g. `1+3`) | — | **not guessed** → imported without dates, listed in the report |
| empty / unrecognised | — | imported without dates, listed in the report |

"חריגים" families simply get custom `start_date`/`end_date`; the `חריגים` part
itself carries empty dates and is matched by name only (families have no
`week_chosen` column — their part is implied by date range).

## ⚠ Week offset — READ BEFORE IMPORTING A NEW VACATION

The week mapping currently applies a **`N → שבוע N+1` offset**: a `1` in the
sheet becomes **שבוע 2**, `2` → שבוע 3, and so on.

**This offset is a ONE-TIME workaround for the current vacation only** — that
season had an **extra week added before and after** the registrants' weeks for a
technical reason, so the sheet's `1` really meant the second calendar week.

**Future vacations will NOT be shifted** — there, `1` must mean שבוע 1. Before
importing such a vacation, **remove the offset** (a ~2-minute change):

- File: `server/services/familyImport/familyImportService.js`
- Function: **`resolveWeek`**
- Change the **two** `+ 1` occurrences to `+ 0` (or drop them):
  - bare-number branch: `` `שבוע ${parseInt(t, 10) + 1}` `` → `` `שבוע ${parseInt(t, 10)}` ``
  - multi-week branch: `` partsByName.get(`שבוע ${n + 1}`) `` → `` partsByName.get(`שבוע ${n}`) ``

(The two were left hardcoded intentionally; there is no UI toggle.)

## Other mapping rules

- **Registration date → created_at**: `DD.MM.YY` (col 0) is parsed to a backdated
  `created_at` so the family sorts into its real registration order. Invalid
  dates are reported; the family is still imported (with `created_at = NOW()`).
  Manual UI adds always use `NOW()`.
- **Money**: NIS (col 14) strips thousands separators; EUR (col 15) strips `€`
  and commas.
- **Rooms** (col 12): split on comma/space/slash (`"302, 303"` → two rooms),
  assigned to `room_taken` via the existing assignment logic. Requires the
  family to have dates. A non-existent room number, a date overlap, or a family
  with no dates is **reported, never fatal** — the rest of the import proceeds.

## Dedup behaviour (idempotent, import-only)

- Dedup key: **normalized family name** within the vacation (BiDi marks stripped,
  whitespace collapsed) — the sheet has no ID and heads are not imported.
- A family whose name already exists is **skipped** (counted under "duplicates").
- **Re-importing ADDS only new families** (names not already present). It **never
  updates** existing rows — edit those in the UI.
- Concurrent imports for the same vacation are **serialized** by a MySQL named
  advisory lock (`family_import_<vacationId>`), so two overlapping uploads can't
  produce duplicates. A second upload that can't get the lock in time returns
  HTTP 409 ("ייבוא אחר מתבצע…").

## Safe wipe (to re-import a vacation from scratch)

The import only ever writes **`families`** + **`room_taken`**. To wipe:

```sql
DELETE FROM trip_tracker_<vacationId>.families;
```

- This **cascades** to `room_taken` (`fk_rt_family`, ON DELETE CASCADE) and
  `user_room_assignments` (`fk_ura_family`, ON DELETE CASCADE).
- It does **not** touch the `rooms` inventory (the `room_taken → rooms` FK is
  `RESTRICT`, which only protects *rooms*), nor `vacation_date` (the week parts,
  which live in the shared `trip_tracker` DB and are needed to resolve weeks).

If the vacation also has **manually-added** data — `guest`, `flights`, `notes`,
`payments`, `registration_requests`, `family_documents` (these have a
`family_id` column but **no** FK to `families`, so they do **not** cascade) —
delete those rows first, then delete `families`.
