# Excel Vacation Import Guide

**Scripts:**
- `server/scripts/import_excel_pesach24.py` — Pesach 2024 (complete, fully reconciled)
- `server/scripts/import_excel_pesach25.py` — Pesach 2025 (families + guests steps; no flights file in נרשמים folder)
- `server/scripts/import_payments_pesach24.py` — Pesach 2024 client payments (תשלומים מלקוח.xlsx)
- `server/scripts/import_budget_pesach24.py` — Pesach 2024 budget data (expenses + exchange rates + income)

**Last updated:** Pesach 2025 analysis + import script created 2026-02-22
**Rule:** Update this file every time you discover something new during an import.

---

## Quick Start for a New Vacation

```bash
# 1. Copy the script and rename it for the new vacation
cp scripts/import_excel_pesach24.py scripts/import_<trip_name>.py

# 2. Update BASE_FOLDER and FILES paths at the top of the script

# 3. Update PESACH_START / PESACH_END to the new trip dates

# 4. Run migration on the new vacation DB
node server/migrations/run_migration.js --vacation-id <id>

# 5. Dry run — no writes, just shows what would happen
python scripts/import_<trip_name>.py --vacation-id <id> --dry-run

# 6. Live run, families first
python scripts/import_<trip_name>.py --vacation-id <id> --steps families

# 7a. Review SKIPPED families — add missing ones manually, fix SUB_FAMILY_MAP
# 7b. Review CREATED families — remove phantoms ("יוסי 3", "מסר אבי", etc.)
#     Red-highlighted rows are auto-skipped; the script prints which ones it detected
# 7c. Verify red detection worked: check that no cancelled families appear in CREATED

# 8. Live run, guests
python scripts/import_<trip_name>.py --vacation-id <id> --steps guests

# 9. Review SKIPPED guests — diagnose each one (see Section 9)
# 10. Fix mappings, re-run guests until skipped count is stable
# 11. Import flights (enrichment — run after guests)
python scripts/import_<trip_name>.py --vacation-id <id> --steps flights
# 12. Review SKIPPED in flights output — mostly expected (no first name, not in DB)
```

---

## 1. Excel Files — Structure and Column Mappings

### כללי נרשמים.xlsx — Billing / Family Registration

The **authoritative source for family records**. One row = one billing group (family unit).
Must be imported **before** the guests file.

**Sheet: גיליון1** — `header=0` (data starts at row 1)

| col | Header | DB field | Notes |
|-----|--------|----------|-------|
| 0 | תאריך הרשמה | — | Not imported |
| 1 | פקג | — | Not imported |
| 2 | שם משפחה | `families.family_name` | Primary identifier |
| 3 | פרטי זכר | `families.male_head` | Father / male head first name |
| 4 | פרטי נקבה | `families.female_head` | Mother / female head first name |
| 5 | סה"כ נפשות | `families.number_of_guests` | Total travellers |
| 6 | מספר נפשות הלוך | `families.number_of_pax_outbound` | Outbound count |
| 7 | מספר נפשות חזור | `families.number_of_pax_return` | Return count |
| 8 | תינוקות | `families.number_of_babies` | Babies |
| 9 | מס' חדרים | `families.number_of_rooms` | Room count |
| 10 | כמות סוויטות | `families.number_of_suites` | Suites |
| 11 | מספר חדר | `room_taken.room_id` | Room numbers — see Section 5 |
| 12 | הערות חדר | — | Room notes, not imported |
| 13 | סה"כ ש"ח | `families.total_amount` | NIS price (VARCHAR, not DECIMAL) |
| 14 | סה"כ אירו | `families.total_amount_eur` | EUR price (VARCHAR, not DECIMAL) |
| 15–18 | סטטוס/חריגות/טיולים | — | Not imported |
| 19 | טלפון 1 | `guest.phone_a` (main guest) | Goes on guest, NOT families |
| 20 | טלפון 2 | — | Not imported |
| 21 | טלפון קווי | — | Not imported |
| 22 | אימייל | `guest.email` (main guest) | Goes on guest, NOT families |
| 23 | כתובת | `guest.address` (main guest) | Goes on guest, NOT families |

> **CRITICAL:** The `families` table has **no** phone/email/address columns. Contact fields go on `guest` only.

**Header offset trap:** Use `header=0`. If you accidentally use `header=1`, the first data row (e.g. רייס) becomes the column names and is silently lost — with no error message.

**Sheet: טפסי לקוחות** — `header=1`

| col | Content | DB field |
|-----|---------|----------|
| 0 | שם משפחה | key for matching |
| 5 | מספר שובר | `families.voucher_number` |
| 11 | הערות | `families.special_requests` |

---

### כלל האורחים.xlsx — Individual Guests and Flights

The **authoritative source for individual travellers**. One row = one person.
Must be imported **after** families.

**Sheet name (Pesach 2024):** `"כליי שיוך לטיסות מעודכן 14.3.24"` — `header=1` (two header rows)

| col | Content | DB table/field |
|-----|---------|---------------|
| 0 | marker/flag | — |
| 1 | שם משפחה (Hebrew) | `guest.hebrew_last_name` + family lookup key |
| 2 | שם פרטי (Hebrew) | `guest.hebrew_first_name` |
| 3 | שם משפחה (English) | `guest.english_last_name` |
| 4 | שם פרטי (English) | `guest.english_first_name` |
| 5 | מספר דרכון | `flights.passport_number` |
| 6 | תוקף דרכון | `flights.validity_passport` |
| 7 | תאריך לידה | `guest.birth_date` + `flights.birth_date` |
| 8 | תעודת זהות | `guest.identity_id` |
| 9 | גיל | `guest.age` + `flights.age` |
| 10 | תאריך טיסת הלוך | `flights.outbound_flight_date` |
| 11 | חברת תעופה הלוך | `flights.outbound_airline` |
| 12 | מספר טיסה הלוך | `flights.outbound_flight_number` |
| 13 | שעת המראה | `flights.outbound_flight_time` |
| 14 | תאריך טיסת חזור | `flights.return_flight_date` |
| 15 | חברת תעופה חזור | `flights.return_airline` |
| 16 | מספר טיסה חזור | `flights.return_flight_number` |
| 17 | שעת נחיתה | `flights.return_flight_time` |
| 18 | הערות | — |

**Sheet: גיליון7** — Seat preferences
`[0]=last_name, [1]=first_name, [4]=seat_preference` → `flights.seat_preference`

**Header offset trap (CORRECTED):** Use `header=0` for this file. Despite an earlier assumption, the Pesach 2024 sheet has **one** header row only. Using `header=1` caused pandas to consume the first data row (צפורה רייס) as column names — silently dropping her. Always verify by checking the column-map diagnostic printout and counting how many rows were parsed vs. expected.

---

### טיסות כללי.xlsx — Flight Enrichment

This file **supplements** כלל האורחים — it does not replace it. Run the `flights` step AFTER the `guests` step.
It adds: booking/PNR codes, more accurate flight details for sub-groups, and `flying_with_us` status for independent fliers.

The file has **multiple sheets**, each covering a different travel segment. Process only the sheets below; the others (e.g. 'הלוך חזור מרכזי היסקי', 'תוכנית העברות') are operational and not imported.

---

#### Pattern 1 — Multiple flight sheets

Every vacation may organize flights differently:

| Sheet | Who | Purpose |
|-------|-----|---------|
| `טסים דרכינו` | Main charter passengers | Redundant with כלל האורחים — skip (don't re-import) |
| `טסים באופן עצמאי` | Independently-arranged flights | Set `flying_with_us=0` or update flight details |
| `טיסות נוספות` | Sub-groups on scheduled flights | Better flight numbers + PNR codes |
| `צוות` | Staff flights | Not imported into `guest`/`flights` |
| `טיסות לטיפול` | Problem cases needing manual action | Review manually; not imported |

**For future vacations:** the sheet names may change. Always print the sheet list first:
```python
xl = pd.ExcelFile(FILES["flights"])
print(xl.sheet_names)
```

---

#### Pattern 2 — 'טסים באופן עצמאי' sheet (independent fliers)

**Column layout (Pesach 2024):**

| col | Content | DB field |
|-----|---------|----------|
| 0 | שם משפחה (Hebrew) | matching key |
| 1 | שם פרטי (Hebrew) | matching key |
| 4 | דרכון | passport (preferred match key) |
| 9 | תאריך הלוך | `flights.outbound_flight_date` |
| 10 | חברת תעופה הלוך | `flights.outbound_airline` |
| 11 | מספר טיסה הלוך | `flights.outbound_flight_number` |
| 12 | שעת המראה | `flights.outbound_flight_time` |
| 13 | תאריך חזור | `flights.return_flight_date` |
| 14 | חברת תעופה חזור | `flights.return_airline` |
| 15 | מספר טיסה חזור | `flights.return_flight_number` |
| 16 | שעת נחיתה | `flights.return_flight_time` |

**IMPORTANT:** No leading blank column — col[0]=last, col[1]=first. This is **different** from the 'טיסות נוספות' sheet which has a blank col[0] (col[1]=last, col[2]=first).

**X markers:** `X` in a flight column means "unknown / not booked through us". The script treats both uppercase and lowercase `X` as null.

---

#### Pattern 3 — One-way flights (return cols = X)

If the return-flight columns (col[13]–col[16] in 'טסים באופן עצמאי' or col[15]–col[18] in 'טיסות נוספות') are all `X`, the passenger has a **one-way arrangement** — they booked their own return or are staying longer.

In this case the script calls `_update_flight()` with `ret_*=None` for all return fields. The COALESCE pattern ensures the existing return data is not overwritten with NULL. This is correct behavior.

**Pesach 2024 example:** פירר and הרמן families flew one-way on the charter; their return was arranged independently.

---

#### Pattern 4 — No flights at all (flying_with_us = 0)

When **all** flight columns (cols 9–16 inclusive in 'טסים באופן עצמאי') contain `X`, the passenger arranged their own travel completely — driving from abroad, flying locally, etc.

The script detects this via:
```python
all_x = all(_is_x(row.iloc[j]) for j in range(9, 17))
```
If `all_x` is True, it runs:
```sql
UPDATE guest SET flying_with_us = 0 WHERE user_id = %s
```
This disables the passenger from appearing in flight manifests and charter seat counts.

**Pesach 2024 examples:**
- מסר family (6+ members) — all cols X → `flying_with_us=0`
- גולדברגר family — drives from Europe; all cols X but rows had no first-name data, so they were logged as skipped. Handle manually: `UPDATE guest SET flying_with_us = 0 WHERE hebrew_last_name = 'גולדברגר'`

**Note on rows with no first name:** Some families are listed in this sheet with only the last name (no first name column). The script cannot match them by `(last, '')` because the DB stores actual first names. These will appear in the SKIPPED report. Review them manually.

---

#### Pattern 5 — PNR/booking reference codes ('טיסות נוספות')

**Column layout (Pesach 2024):**

| col | Content | DB field |
|-----|---------|----------|
| 0 | (blank) | — |
| 1 | שם משפחה (Hebrew) | matching key |
| 2 | שם פרטי (Hebrew) | matching key |
| 5 | דרכון | passport (preferred match key) |
| 10 | תאריך הלוך | `flights.outbound_flight_date` |
| 11 | חברת תעופה הלוך | `flights.outbound_airline` |
| 12 | מספר טיסה הלוך | `flights.outbound_flight_number` |
| 13 | שעת המראה | `flights.outbound_flight_time` |
| 14 | מי קנה | — (skip — who purchased the ticket) |
| 15 | תאריך חזור | `flights.return_flight_date` |
| 16 | חברת תעופה חזור | `flights.return_airline` |
| 17 | מספר טיסה חזור | `flights.return_flight_number` |
| 18 | שעת נחיתה | `flights.return_flight_time` |
| 19 | קוד הזמנה | `flights.booking_reference` |

**Booking reference** (col[19]): A 6-character alphanumeric PNR code (e.g. `U46UKJ`, `N3WYR4`). This is the airline's booking code — use it to retrieve the booking via the airline's website. Stored in `flights.booking_reference VARCHAR(10)` (added in migration step [25]).

**Header note:** Row 0 is a header row; skip it (`if i == 0: continue`). Row 1 is the first data row. Unlike the main guests sheet, there is only one header row.

**IMPORTANT:** Skip rows where `raw_last` (col[1]) is empty — even if `heb_first` contains a value. The file sometimes has meal category labels (e.g. `מנת`) in the first-name column without a corresponding last name. The script checks `if not raw_last: continue` to prevent these from matching DB guests.

---

#### Matching strategy for flight enrichment

1. **Passport number** — most reliable. Stored in `flights.passport_number`, queried via `LEFT JOIN flights f ON g.user_id = f.user_id`.
2. **Name** `(hebrew_last_name, hebrew_first_name)` — fallback. Fails if the person's name in the flights file differs from what was imported (maiden names, spelling variants, etc.).
3. **Only UPDATEs** — the flights step never creates new `guest` or `flights` rows. It only enriches existing records using COALESCE so existing non-NULL values are never overwritten.

---

### חדרים.xlsx — Room Assignments

**Sheet: גיליון5** — Pre-cleaned room assignments (use after manually fixing in Excel).
Columns: room_id, guest_name_in_room, num_persons, single_bed, double_mattress, baby_crib
Maps to: `room_taken`, `user_room_assignments`

---

### צוות.xlsx — Staff

**Sheet: צוות**

| col | Content | DB field |
|-----|---------|----------|
| 0 | מספר אנשים | `staff.persons_count` |
| 1 | שם / תפקיד | `staff.name` |
| 2 | מיקום | `staff.location` |
| 3 | חדר | `staff.room_number` |
| 9 | הערות | `staff.notes` |

---

### רכבים.xlsx — Vehicles

| col | Content | DB field |
|-----|---------|----------|
| 2 | סוג רכב | `vehicles.vehicle_type` |
| 3 | שם משפחה | `vehicles.family_name` + resolved `family_id` |
| 4 | עלות | `vehicles.cost` + `vehicles.currency` |

---

## 2. The Resolution Engine — How Guest→Family Matching Works

When the script encounters a guest row in כלל האורחים, it must find the correct `family_id` in the DB. The function `_resolve_family(raw_name, name_to_families, heb_first, block_ctx)` runs these steps in order:

```
Step 1: INDIVIDUAL_OVERRIDES
        Hard-coded (last_name, first_name) → (billing_family, head_hint)
        Use when block context or head matching can't solve the case automatically.

Step 2: Parenthetical suffix in the raw name
        "לרנר (שטרן)" → try "שטרן" as the billing family.
        Also checks SPELLING_ALIASES on the parens content.

Step 3: SPELLING_ALIASES on the bare last name
        "שטיינבוך" → "שטרנבוך"

Step 4: SUB_FAMILY_MAP
        "בייטלר" → "שטרן"   (string target = unique billing family)
        "שרעבי"  → ("הררי", "מרקו")  (tuple = family name + male_head hint)

Step 5: Look up resolved name in DB
        If not found → SKIP (reason logged)

Step 6: If only one billing entry with that name → done.

Step 7: Multiple entries with same name → disambiguation:
        a. head_hint from SUB_FAMILY_MAP tuple
        b. guest's first name matches a billing male_head or female_head
           → also sets block_ctx so following rows in same block inherit it
        c. block_ctx from a prior row in this block
        d. AMBIGUITY_PREFER fallback (dominant group)
        → None of the above → SKIP with "ambiguous" message
           → must add to INDIVIDUAL_OVERRIDES
```

`block_ctx` is a plain `dict` that is mutated as rows are processed. It stores `{canonical_name: family_id}`. Once the לוי ברוך head row is processed and matched, all subsequent "לוי" rows in the same visual block will inherit that family_id via `block_ctx['לוי']`.

---

## 3. Block Pattern — How to Find Sub-Families

### What is a "block"?

In כלל האורחים, guests are arranged in **visual groups** (blocks). Each block belongs to one billing family. The block begins with the billing head (whose name matches `male_head` in the billing file) and continues with all family members. Sometimes a **sub-family** (relatives with a different last name) is embedded inside the block — their rows appear between the billing family's own rows.

**Example from Pesach 2024:**

```
row 132: לוי  | ברוך       ← billing head of "לוי ברוך" family
row 133: לוי  | (unnamed)  ← family member
row 134: לוי  | יונתן      ← family member
row 135: לוי  | איתן       ← family member
row 136: פירר | דב         ← OWN billing family (not sub-family!)
row 137: הרמן | לביאה      ← sub-family of פירר billing block
row 138: רוט  | לוציה      ← next billing family starts
```

Sub-families appear because relatives travel together even if they have different last names and are billed separately or under a parent family.

### How to diagnose a SKIPPED guest

When the script reports `'X' not found in DB`:

**Step 1 — Read the raw Excel rows around that guest:**
```python
df_raw = pd.read_excel(FILE, sheet_name=SHEET, header=None)
for i, row in df_raw.iterrows():
    print(f"row {i}: {row.iloc[1]} | {row.iloc[2]}")
```

**Step 2 — Identify the block:**
- What last name appears in the 5–10 rows immediately before?
- What last name appears in the 5–10 rows immediately after?
- Is the skipped guest a single row, or are there multiple rows with the same last name?

**Step 3 — Check the billing file:**
- Is the guest's last name (or any variant) in כללי נרשמים col[2]?
- If yes and there's only one entry → add a `SPELLING_ALIASES` entry
- If yes and the name is different → add a `SUB_FAMILY_MAP` entry
- If no → guest has no billing entry; genuine skip

**Step 4 — Check the billing file for the guest as a HEAD:**
- Sometimes the guest file lists `שלוש | קוסאי` (last=שלוש, first=קוסאי) but the billing file has a family named `קוסאי` with no heads — meaning the billing family name IS the person's first name. Add `'שלוש': 'קוסאי'` to `SUB_FAMILY_MAP`.

**Step 5 — Check maiden name pattern:**
- Guest file: `ברנשטיין | ביאנקה` (last=maiden name)
- Billing file: `ליינר | אלכסנדר | ביאנקה` — ביאנקה is female_head of ליינר
- Guest is listed under her maiden name but billed under married name
- Add `'ברנשטיין': 'ליינר'` to `SUB_FAMILY_MAP`

### Patterns that indicate a sub-family

| Pattern | Example | Action |
|---------|---------|--------|
| Single row embedded inside a multi-row block | הרמן inside פירר block | `SUB_FAMILY_MAP` |
| Row immediately after a 1–2 person block | פרידמן after לודמיר | `SUB_FAMILY_MAP` |
| Guest first name appears as a billing family name | קוסאי שלוש → billing "קוסאי" | `SUB_FAMILY_MAP` |
| Maiden name matches female_head of a billing entry | ברנשטיין → ליינר female_head ביאנקה | `SUB_FAMILY_MAP` |
| Compound billing name (first+last as family name) | מאיר טבאל → billing "מאיר טבאל" | `SUB_FAMILY_MAP` |
| Parens in guest file last name | "לרנר (שטרן)" | Auto-handled by engine |

### Patterns that are NOT sub-families

| Pattern | Example | Action |
|---------|---------|--------|
| Guest has own billing entry with matching name | פירר דב → billing "פירר דב" | Do NOT add to SUB_FAMILY_MAP; direct match works |
| Guest in late additions section with no billing entry | דויטש, גלז, צוק שלמה | Genuine skip — import manually if needed |

---

## 4. Disambiguation — Same-Name Families

### The problem

When two families share the same last name (e.g. two הררי families), a guest named "הררי" is ambiguous. The engine needs to pick the right one.

### How פרטי זכר/נקבה (male_head/female_head) drives disambiguation

The billing file has `male_head` and `female_head` for each family. These are the **first names of the father and mother**. The engine uses these to match against the guest's own first name:

```
Guest row: "הררי | מרקו"
DB lookup:
  → הררי family 1: male_head=מרקו  female_head=שנטל  ← "מרקו" matches! Pick this one.
  → הררי family 2: male_head=שלום בנימין  female_head=NULL
Result: guest assigned to הררי מרקו/שנטל family
        block_ctx['הררי'] = that family_id
        → next 12 הררי rows in the block also go to הררי מרקו/שנטל
```

Once the head row establishes `block_ctx`, all subsequent rows of the SAME last name in the SAME block automatically inherit the assignment without needing a head match.

### When block context fails

The **first row in an ambiguous block** has no block context yet. If the person happens to be a child (not the billing head), their first name won't match either `male_head` or `female_head`. Add to `INDIVIDUAL_OVERRIDES`:

```python
INDIVIDUAL_OVERRIDES = {
    # (guest_last_name, guest_first_name): (billing_family_name, head_hint)
    ('אונגר', 'מאיר אליהו'): ('אונגר', 'רבקה'),  # first row in block, not the head
    ('פוגלר', 'דוד'):        ('פוגלר', 'עידית'),  # first row in block
}
```

### The empty-string head hint for headless billing entries

Some billing entries have no `male_head` and no `female_head`:
```
תהילה | NULL | NULL   ← billing entry with no head data
```

To target this specific entry from `INDIVIDUAL_OVERRIDES`, use `''` as the head hint:
```python
('תהילה', 'עמנואל'): ('תהילה', ''),  # '' = pick the family with NO head data
```
This works because `_pick_family_by_head(families, '')` specifically returns the entry where both `male_head` and `female_head` are empty.

### SUB_FAMILY_MAP tuple for ambiguous parent names

When a sub-family maps to a parent name that is ALSO shared by multiple billing entries, use a tuple:
```python
'שרעבי': ('הררי', 'מרקו'),  # → הררי family, specifically the one where male_head contains 'מרקו'
```
The engine will call `_pick_family_by_head` with 'מרקו' to pick the right הררי.

### AMBIGUITY_PREFER — last resort fallback

For the dominant group of an ambiguous name, when no override or block context helps:
```python
AMBIGUITY_PREFER = {
    'הררי': 'מרקו',  # If all else fails, הררי → הררי מרקו/שנטל (the larger family)
}
```
Use this only for names where one billing entry is clearly "the default" family.

### Bidirectional head matching

`_pick_family_by_head` checks BOTH directions:
- Does `head_hint` appear as a substring of `male_head`? (hint ⊆ billing)
- Does `male_head` appear as a substring of `head_hint`? (billing ⊆ hint)

This handles compound names: billing has `female_head='רבקה'`, guest first name is `'רבקה הדסה'`. The check `'רבקה' in 'רבקה הדסה'` succeeds. Without the bidirectional check, it would fail.

### Disambiguation reference — Pesach 2024

| Family | # billing entries | Rule |
|--------|------------------|------|
| הררי | 2 | rows 53–65 → head match on מרקו → הררי מרקו/שנטל; row 66 (שלום בנימין) → INDIVIDUAL_OVERRIDES |
| לוי | 4 | each block starts with billing head (מנשה row 67, ברוך row 132); ציפי group via INDIVIDUAL_OVERRIDES; אביעד לוי group via INDIVIDUAL_OVERRIDES |
| פוגלר | 3 | דוד → INDIVIDUAL_OVERRIDES → פוגלר עידית; עידית → head match sets block_ctx |
| אונגר | 2 | מאיר אליהו → INDIVIDUAL_OVERRIDES → אונגר רבקה; אלי/שרה → head match (אלי/שרה are the heads) |
| תהילה | 2 | יאיר → INDIVIDUAL_OVERRIDES → תהילה מיכל; עמנואל/בלהה → empty-string hint → headless entry |
| רוט | 2 | לוציה → INDIVIDUAL_OVERRIDES → רוט אמא אברימי; אברהם מרדכי et al. → empty-string hint |

---

## 5. Room Number Parsing

### Room number formats in the Excel

**Format 1 — Comma-separated (clean, preferred):**
```
409,410,411    → three rooms: 409, 410, 411
```

**Format 2 — Shorthand with spaces (original Excel format):**
The first token is the full room number. Each subsequent token replaces the **last N digits** of the base, where N = length of that token.

| Raw cell | Expanded | Rule |
|----------|----------|------|
| `412 13 14 15` | 412, 413, 414, 415 | len=2 → replace last 2 of "412" |
| `305 6 7 8` | 305, 306, 307, 308 | len=1 → replace last 1 of "305" |
| `211 12 13` | 211, 212, 213 | len=2 → replace last 2 of "211" |
| `101` | 101 | single room |

**Recommendation:** Manually expand shorthand to comma-separated in Excel before running the import. Parsing edge cases arise when token length equals or exceeds base length — these are treated as new full room numbers.

**Format 3 — Semicolons:**
`409;410;411` — also handled by `expand_rooms()` (splits on `,` and `;`).

### Non-room values in the room column

Some cells contain values that are NOT hotel room IDs:

| Token | Meaning | Script behaviour |
|-------|---------|-----------------|
| `קסה` | External location (cash office / off-site) | Appended to `families.special_requests` as `\| מיקום: קסה`; NOT inserted into `room_taken` |
| `0` | Placeholder — not yet assigned | Skipped silently (logged in SKIPPED report) |
| `X` / `x` | Placeholder — not yet assigned | Skipped silently (logged in SKIPPED report) |

These are defined in `NON_ROOM_TOKENS` and `UNASSIGNED_TOKENS` at the top of the script. Add new tokens there if you encounter others.

**Why קסה can't go in room_taken:** The `room_taken` table has a foreign key (or validated ID) referencing the `rooms` table. "קסה" is not a room ID. Trying to insert it causes a constraint error. Instead, the import appends it as a human-readable note to `families.special_requests`.

**Families with `קסה` in Pesach 2024:** סלומון, גבעון, טאוב, פוגלר (×2), סרגוביץ, ברכר, שור

### Room validation

Every room ID is validated against `rooms.rooms_id` in the DB before inserting into `room_taken`. Rooms not in the DB are listed in the SKIPPED ROOMS report. The rooms table must be populated before running the import (either from the hotel import or from חדרים.xlsx).

### Vacation dates for Pesach 2024
`start_date = 2024-04-10`, `end_date = 2024-05-02`

### Vacation dates for Pesach 2025
`start_date = 2025-04-09`, `end_date = 2025-04-21`

### Families with `קסה` in Pesach 2025
שוורץ, פרקש, אדרעי, כהן (יוסי), חרמון — plus `מלון דירות` (גשייד), `אוכל בלבד` (מזרחי), `דירה` (כהן מאוריציו, partial)

### Room number formats added in Pesach 2025
See `expand_rooms()` in import_excel_pesach25.py. All these formats are now handled:
- Dot-shorthand: `305.6.7.8.9.10` → [305,306,307,308,309,310]
- Bare 3-digit concatenation: `409410417512` → [409,410,417,512] (split into groups of 3)
- Comma-shorthand: `212,13,17` → [212,213,217]
- Multi-word non-room: `מלון דירות`, `אוכל בלבד` (matched BEFORE split)
- Single non-room: `דירה` (added to NON_ROOM_TOKENS alongside `קסה`)
- Mixed: `204, קסה, דירה` → room 204 + 2 location notes

**Room data conflicts found in Pesach 2025 Excel** (need manual fix before or after import):
- Room 302: assigned to both `סירקין` AND `פישל`
- Room 410: assigned to both `הררי` (409,410,417,512) AND `בירנבוים`

---

## 6. Known Edge Cases

### Duplicate / phantom billing entries

כללי נרשמים sometimes has extra rows that are NOT real families:

- **Red-highlighted rows** — cancelled or withdrawn registrations (e.g. `ויזנפלד/שפיר`, `הורביץ`, `שכטר`). Detected automatically by `_get_red_family_names()` and skipped.
- **Sub-entries for the same billing group** — e.g. `מסר אבי` and `יוסי 3` are sub-billing lines for the מסר / יוסי groups, not independent families. In Pesach 2024 these were also red-highlighted. If not red, they still look wrong in the CREATED report (same base name, no heads).
- **Notation variants** — e.g. `מסר אבי` (name order reversed) vs the main `מסר` entry.

The script's composite key `(family_name, male_head, female_head)` prevents same-key rows from colliding. But if names differ (e.g. `מסר` vs `מסר אבי`), each gets its own `family_id`. Always review the CREATED report after the families step — any entry that looks like "X 3", "X אבי", or a plain number suffix is a phantom entry.

**Check for phantoms that have room assignments:**
```sql
SELECT f.family_name, rt.room_id
FROM room_taken rt JOIN families f ON f.family_id = rt.family_id
WHERE f.family_name LIKE '%3' OR f.family_name LIKE '% אבי';
```

### Negative amounts = cancellations

A row where `total_amount` (NIS) or `total_amount_eur` is negative is a **cancelled booking**. Skip it with `continue`. Do NOT use a "seen" flag that would also block the next positive row for the same family name. Two families with the same name can have: one cancelled row and one real row.

### Same last name, multiple billing entries

See Section 4. Always check `male_head`/`female_head` from the billing file before adding `INDIVIDUAL_OVERRIDES`.

### Guest in billing file but listed under maiden name

Pattern: `ברנשטיין | ביאנקה` in guest file, but billing file has `ליינר | אלכסנדר | ביאנקה`. The guest is listed under her maiden name; the billing file has her married name with her as `female_head`. Detection: when a guest is skipped, search the billing file's `male_head` and `female_head` columns for the guest's first name — if found, the billing family of that row is the target. Fix: add `'ברנשטיין': 'ליינר'` to `SUB_FAMILY_MAP`.

### First name used as billing family name

Pattern: `שלוש | קוסאי` (last=שלוש, first=קוסאי) in guest file. Billing file has family `קוסאי` (no heads). The billing "family name" is the person's first name. Fix: `'שלוש': 'קוסאי'` in `SUB_FAMILY_MAP`. This pattern appears in small single-person families added late (rows 295+ in Pesach 2024).

### Compound billing family name

Pattern: `טבאל | מאיר` in guest file. Billing has family `מאיר טבאל` (compound first+last as name, no heads). Fix: `'טבאל': 'מאיר טבאל'` in `SUB_FAMILY_MAP`.

### Billing family that LOOKS like a sub-family but isn't

**Pesach 2024 example — פירר:**
Row 136 (פירר דב) sits right after the לוי ברוך block (rows 132–135). It looks like a sub-family. BUT: the billing file has a row `פירר | דב | NULL` — פירר has its own billing entry. Do NOT add פירר to `SUB_FAMILY_MAP`; the direct name match picks it up correctly.

**Rule:** Before adding any name to `SUB_FAMILY_MAP`, always check the billing file first.

### Late additions section

The guest Excel often has a section at the end (in Pesach 2024, rows ~295–338) where individual families are added one at a time without being grouped into multi-person blocks. These rows often have unusual patterns:
- Family name = person's first name (billing file uses first name as identifier)
- Compound family name
- Person not in billing file at all

When a guest from this section is SKIPPED, check ALL of the billing file's rows carefully, not just family names — also check `male_head` and `female_head` columns.

### Header row offset

| File | `header=` | Why |
|------|-----------|-----|
| כללי נרשמים גיליון1 | 0 | Single header row |
| כללי נרשמים טפסי לקוחות | 1 | Two header rows |
| כלל האורחים (Pesach 2024) | **0** | Single header row — was incorrectly documented as 1, causing צפורה רייס (first data row) to be lost |

Getting this wrong silently drops the first data row with no error message. Always verify by checking the column map diagnostic printout AND comparing parsed row count against the expected guest count.

### Red-highlighted rows = cancelled / not attending

Rows highlighted in red in כללי נרשמים represent **cancelled or withdrawn registrations**. They must NOT be imported. The script detects these automatically using `openpyxl` before the pandas pass.

**Red families from Pesach 2024:**

| Family | Heads | Why |
|--------|-------|-----|
| איצקוביץ | None / מרים | Cancelled — caught by negative-amount filter |
| דוקאן | — | Cancelled — red row |
| ויזנפלד/שפיר | נחום / חיה | Cancelled — red row |
| הורביץ | — | Cancelled — red row |
| שכטר | None / רחל | Cancelled — red row |
| מסר אבי | — | Sub-entry of מסר, cancelled — red row |
| יוסי 3 | — | Placeholder/non-family entry — red row; had a room_taken entry for room 313 (also deleted) |

The `_get_red_family_names()` helper uses RGB threshold detection: R > 150 and R > G+30 and R > B+30. This catches standard red (`FF0000`) and dark red variants. For future vacations, verify the threshold still works if highlighting color changes.

### Phone/email/address

The `families` table has no contact columns. Contact info goes on `guest`, NOT `families`.

---

## 7. Data Flow — Excel → DB Tables

```
כללי נרשמים.xlsx
  גיליון1          →  families (INSERT or UPDATE by composite key)
                   →  room_taken (room assignments, validated against rooms table)
  טפסי לקוחות     →  families.voucher_number, families.special_requests

כלל האורחים.xlsx
  כליי שיוך...    →  guest (one row per person)
                   →  flights (one row per person, linked by same user_id)
  גיליון7          →  flights.seat_preference

טיסות כללי.xlsx   (run AFTER guests — enrichment only, never creates records)
  טיסות נוספות    →  flights.outbound_*, flights.return_*, flights.booking_reference
  טסים באופן עצמאי →  flights.outbound_*, flights.return_* (when not X)
                   →  guest.flying_with_us = 0 (when all flight cols = X)

צוות.xlsx
  צוות            →  staff (DELETE + re-insert on each run)

רכבים.xlsx
  Sheet 0          →  vehicles (DELETE + re-insert, resolved family_id)

חדרים.xlsx
  גיליון5          →  room_taken (optional, use --import-rooms flag)
                   →  user_room_assignments
```

---

## 8. Sub-Family Mappings — Pesach 2024 Reference

These are the confirmed `SUB_FAMILY_MAP` entries from the Pesach 2024 import. For future vacations, some will carry over (e.g. stable family names) and others will need to be re-discovered. Always start from the current billing file.

### Confirmed from parenthetical tags in the guest file

| Guest last name | → Billing family | Evidence |
|-----------------|-----------------|---------|
| בק | קליין | Invoice inside [קליין] folder |
| בק (בראון) | קליין | Same |
| בן חיים | אמונה | Invoice in [אמונה עזרא] folder |
| הדרי שלוסברג | שלוסברג | Parens tag + no independent billing entry |
| חדד (שלוסברג) | שלוסברג | Parens tag |
| חדד | שלוסברג | Plain form — same target |
| לרנר (שטרן) | שטרן | Parens tag |
| לרנר | שטרן | Plain form — same target |
| יעקובזון (שטרן) | שטרן | Parens tag |
| יעקובזון | שטרן | Plain form — same target |
| גרין רייס (גרין) | רייס | Parens tag |
| קריסטל | מסר | Block analysis — sits inside מסר block; NOT inside יוסי block |
| זוהר | זוהר דיאמנט | "זוהר" alone is a sub-entry of the "זוהר דיאמנט" billing |
| זוהר דיאמנט (זוהר) | זוהר דיאמנט | Parens variant |

### Confirmed from block analysis

| Guest last name | → Billing family | Block position |
|-----------------|-----------------|----------------|
| עציון | רייס | Rows 9–13 inside רייס block |
| עציון רייס | רייס | Same |
| גרין | רייס | Rows 3–8 inside רייס block |
| גרין רייס | רייס | Same |
| יעקובזון | שטרן | Rows 14–22 inside שטרן block |
| בייטלר | שטרן | Rows 27–31 inside שטרן block |
| לרנר | שטרן | Rows 32–35 inside שטרן block |
| שרעבי | הררי (מרקו) | Rows 55,57,58 interleaved inside הררי מרקו block |
| חמבי | הרשמן | Rows 183,185,186 interleaved inside הרשמן block |
| פסקר | הרשמן | Rows 187–191 inside הרשמן block |
| ליברטי | בן מנחם | Rows 243–249 inside בן מנחם block |
| הרשטיק | שור | Rows 285,287 inside שור block |
| וואננוביץ | שור | Row 286 inside שור block |
| הרמן | פירר | Row 137 immediately after פירר's single-person billing block |
| פרידמן | לודמיר | Row 93 immediately after לודמיר ברוך (user confirmed) |

### Confirmed from billing file cross-check

| Guest last name | → Billing family | Evidence |
|-----------------|-----------------|---------|
| ברנשטיין | ליינר | ביאנקה is `female_head` of ליינר in billing file; guest listed under maiden name |
| קוקבקה | הלל | Billing family named "הלל"; guest first name is הלל |
| שלוש | קוסאי | Billing family named "קוסאי"; guest first name is קוסאי |
| טבאל | מאיר טבאל | Billing family compound name "מאיר טבאל" |

> **Do NOT add פירר to SUB_FAMILY_MAP.** דב פירר has his own billing entry (`פירר | דב`). The direct name match works correctly without any mapping.

### Spelling variants confirmed

| Guest file spelling | → Billing file spelling | Evidence |
|--------------------|------------------------|---------|
| שטיינבוך | שטרנבוך | Folder [שטרנבוך דינה] contains invoices for "דינה שטיינבוך" |
| טואבמן | טאובמן | Folder [טאוזמן] contains file טאובמן.jpg |
| הלוי | הלוי מלק | Guest file uses short form; full billing name is הלוי מלק |

---

## 9. Handling a New SKIPPED Guest — Decision Tree

When the script reports a skipped guest, follow this process:

```
Guest "X | firstName" not found in DB
│
├─ 1. Does the billing file (כללי נרשמים) have a row where col[2] = "X"?
│     YES → spelling variant or exact match missing from DB
│            → check if it's a spelling issue (add to SPELLING_ALIASES)
│            → or the family wasn't imported (re-run families step)
│
├─ 2. Does the billing file have a row where col[3]=firstName OR col[4]=firstName?
│     YES → guest is listed under wrong last name (maiden name / alias)
│            → billing family name = col[2] of that billing row
│            → add to SUB_FAMILY_MAP: 'guestLastName': 'billingFamilyName'
│
├─ 3. Does the billing file have a row where col[2] = firstName (of the guest)?
│     YES → billing family NAME = guest's FIRST NAME (unusual pattern)
│            → add to SUB_FAMILY_MAP: 'guestLastName': 'billingFirstNameFamily'
│
├─ 4. Look at the raw Excel rows 5–15 before and after this guest.
│     Is the guest inside a multi-row block of a known billing family?
│     YES → add to SUB_FAMILY_MAP: 'guestLastName': 'billingFamilyOfBlock'
│            If target family has multiple billing entries, use tuple form:
│            'guestLastName': ('familyName', 'headHint')
│
├─ 5. Is the guest's last name a compound (first+last) of a billing entry?
│     (e.g., guest: "טבאל | מאיר", billing: "מאיר טבאל")
│     YES → add to SUB_FAMILY_MAP: 'טבאל': 'מאיר טבאל'
│
└─ 6. None of the above → genuine skip.
       The person has no billing entry. Options:
         a. Import them manually via the app under the correct family
         b. Accept the skip (e.g. placeholder rows, staff)
         c. Ask the trip manager which family they're billed under
```

### Genuine skips from Pesach 2024

These 4 people + 1 placeholder have no matching billing entry and were not imported:

| First name | Last name in Excel | Why skipped |
|------------|-------------------|-------------|
| עופר | צוק שלמה | No billing family with this compound name |
| אפרת חנה | גלז | Not in billing file |
| מיכל | אקרמן (ארביב) | `ארביב` not a billing family name |
| ברוך | דויטש | Not in billing file |
| X | X | Placeholder row — skip permanently |

---

## 10. Common Pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Wrong `header=` for כללי נרשמים | First family (e.g. רייס) silently missing | Use `header=0` |
| Wrong `header=` for כלל האורחים | First guest (e.g. צפורה רייס) silently consumed as column names | Use `header=0` — the sheet has ONE header row, not two |
| Red-highlighted families imported | Cancelled families (ויזנפלד/שפיר, יוסי 3, etc.) appear in DB | Run `_get_red_family_names()` via openpyxl before pandas — script now does this automatically |
| Red-row family has room_taken entry | Room is occupied by a cancelled/phantom family | Delete room_taken + family rows; verify via `SELECT rt.* FROM room_taken rt JOIN families f ON f.family_id = rt.family_id WHERE f.family_name = 'X'` |
| Matching by name only | Two הררי families collapse into one | Match by `(family_name, male_head, female_head)` composite |
| Negative amount row not skipped | Cancelled family imported | Check `total_nis < 0` before INSERT |
| Negative row sets a "seen" flag | Next valid row for same name skipped | Use `continue` on negative, NOT a `seen` dict |
| Adding a sub-family map before checking billing | Family that has own entry mapped wrong | Always check billing file first |
| Removing פירר from billing-own exception | דב פירר imported under לוי ברוך | פירר resolves directly — no SUB_FAMILY_MAP needed |
| Misassigned guest from prior run creates duplicate | Same person appears in two families | DELETE the wrong record, re-run. Key is `(family_id, heb_first, heb_last)` |
| Room shorthand not expanded | Only first room imported | Fix in Excel or let `expand_rooms()` parse it |
| Room ID not in rooms table | Room assignment silently skipped | Check SKIPPED ROOMS report; rooms table must be populated first |
| `קסה` token inserted into room_taken | FK constraint error | `קסה` goes to `special_requests`, not `room_taken` |
| Contact fields on families table | Column not found | phone/email/address → `guest` table only |
| `total_amount_eur` parsed as float | Type mismatch | It's `VARCHAR(45)` in the DB |
| Block context carrying across family boundaries | Member of family B assigned to family A | Block context is keyed by billing family name; won't bleed if family names differ |
| Head match is one-directional | "רבקה" doesn't match "רבקה הדסה" | `_pick_family_by_head` checks both `hint in head` AND `head in hint` |
| Empty-string hint skipped | INDIVIDUAL_OVERRIDES entry `('X','Y'): ('Name', '')` not working | Ensure `_pick_family_by_head` handles `head_hint == ''` explicitly |
| Stale NULL-headed records from a prior partial run | 4 הררי instead of 2 in DB | DELETE rows where `(family_name, male_head, female_head)` = the bad composite, then re-run |
| Late additions section (rows 295+) look isolated | All skipped | Check billing file col[2], col[3], col[4] — unusual naming patterns common here |

---

## 11. Script Usage

```bash
# Dry run — no writes; shows what would happen
python scripts/import_<trip>.py --vacation-id <id> --dry-run

# Live run — families only (default, safe starting point)
python scripts/import_<trip>.py --vacation-id <id>

# Specific steps
python scripts/import_<trip>.py --vacation-id <id> --steps families,guests

# All steps (recommended order)
python scripts/import_<trip>.py --vacation-id <id> --steps families,guests,flights,staff,vehicles
```

Windows Hebrew output:
```cmd
set PYTHONIOENCODING=utf-8 && python scripts/import_<trip>.py --vacation-id <id>
```
Or add `sys.stdout.reconfigure(encoding='utf-8')` at the top of the script (already present in import_excel_pesach24.py).

Always run the migration before importing into a new vacation:
```bash
node server/migrations/run_migration.js
```

### Recommended import order

1. Run migration
2. Open כללי נרשמים.xlsx — visually scan for red-highlighted rows **before** running the script; confirm they match what `_get_red_family_names()` will detect
3. Import `families` — the script auto-skips red rows and prints them
4. Review CREATED report:
   - Any phantom entries that slipped through (e.g. "X 3", "X אבי", numbered sub-entries)?
   - Are any cancelled families showing as CREATED? → Check that red detection worked
5. Review SKIPPED families report — add any legitimately missing families manually
6. Import `guests` — review SKIPPED report; work through each skip using Section 9
7. Check first-row coverage: expected total guests ≈ billing file's `number_of_guests` sum. If short by 1, check if the first row in the guest Excel was consumed as a header (compare raw row 0 to column names)
8. Add any new `SUB_FAMILY_MAP` / `INDIVIDUAL_OVERRIDES` entries discovered
9. Re-run `guests` until SKIPPED count is stable
10. Import `flights` — enriches booking references + sets flying_with_us=0 for independent travelers
11. Import `staff`, `vehicles`

### Resetting a vacation (start fresh)

```sql
USE `trip_tracker_<vacation_id>`;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE guest;
TRUNCATE TABLE flights;
TRUNCATE TABLE families;
TRUNCATE TABLE staff;
TRUNCATE TABLE vehicles;
TRUNCATE TABLE room_taken;
TRUNCATE TABLE user_room_assignments;
SET FOREIGN_KEY_CHECKS = 1;
```

### Cleaning up a misassigned guest

When a guest was imported under the wrong family in a prior run and you've fixed the mapping:
```sql
-- Find the wrong record
SELECT g.user_id, g.hebrew_first_name, g.hebrew_last_name, f.family_name
FROM guest g JOIN families f ON g.family_id = f.family_id
WHERE g.hebrew_last_name = 'שם_משפחה';

-- Delete the wrong record (and its flights row)
DELETE FROM flights WHERE user_id = '<wrong_user_id>';
DELETE FROM guest   WHERE user_id = '<wrong_user_id>';
-- Then re-run the import — it will INSERT correctly this time
```

---

## 14. Payments File — תשלומים מלקוח.xlsx

**Script:** `import_payments_pesach24.py`
**Source:** `הנהלת חשבונות/תשלומים מלקוח.xlsx`  →  sheet `תיעוד`

### Column layout (`header=0`)

| col | Header | Purpose |
|-----|--------|---------|
| 0 | `משפחה` | Billing family name — resolution key |
| 1 | `פרטי` | Contact first name — disambiguation hint for same-name families |
| 2 | `סכום העסקה` | Total deal amount — optionally updates `families.total_amount` |
| 3 | `תאריך` | Payment slot 1 — date |
| 4 | `סכום` | Payment slot 1 — amount |
| 5 | `צורת העברה` | Payment slot 1 — method |
| 6 | `יצאה חשבונית` | Payment slot 1 — receipt issued (כן/לא) |
| 7–10 | `תאריך.1` … | Payment slot 2 (same 4-col pattern) |
| 11–14 | `תאריך.2` … | Payment slot 3 |
| 15–18 | `תאריך.3` … | Payment slot 4 |
| 19–22 | `תאריך.4` … | Payment slot 5 |
| 24 | `סה"כ ייתרה` | Remaining balance — reference only, not imported |
| 25 | (unnamed) | Free-text row notes — stored in `payments.notes` if present |

### Known edge cases

- **Amount without date:** Some families have an amount in a slot but no date (e.g. שטרן slots 1 and 3). These are skipped by default. Use `--date-fallback 2024-01-01` to import them with a placeholder date; they get a note `תאריך לא ידוע` in `payments.notes`.
- **Missing total:** Some rows have no value in `סכום העסקה` (e.g. שוורץ). The families step should have already set `total_amount` from the billing file; the `--update-totals` flag won't overwrite it.
- **Negative balance:** A negative `סה"כ ייתרה` means the family overpaid. Individual payment slots are still imported normally.
- **Refunds:** A negative amount in a slot is imported as `status='cancelled'` with note `החזר / זיכוי`.

### Payment method values seen in Pesach 2024

Run with `--dry-run` to see the full list printed at the end of the diagnostic. Add any unknown values to `PAYMENT_METHOD_MAP` in the script before a live run.

### Idempotency

Key: `(family_id, payment_date, abs(amount))`. Safe to re-run — already-existing rows are reported as SKIPPED, not duplicated.

### Usage

```bash
# 1. Dry run — no writes, shows column map + what would happen
set PYTHONIOENCODING=utf-8 && python scripts/import_payments_pesach24.py \
  --vacation-id ce7c7ed2_4d76_41f0_92e5_699f6082cb27 --dry-run

# 2. Check SKIPPED FAMILIES report — add to INDIVIDUAL_OVERRIDES if needed
# 3. Check "אמות שהתגלו" (method values) — add unknown ones to PAYMENT_METHOD_MAP
# 4. Live run
set PYTHONIOENCODING=utf-8 && python scripts/import_payments_pesach24.py \
  --vacation-id ce7c7ed2_4d76_41f0_92e5_699f6082cb27

# 5. With date fallback for slots missing a date:
set PYTHONIOENCODING=utf-8 && python scripts/import_payments_pesach24.py \
  --vacation-id ce7c7ed2_4d76_41f0_92e5_699f6082cb27 --date-fallback 2024-01-01

# 6. Also update families.total_amount from the deal-amount column:
... --update-totals
```

---

## 15. Budget File — פסח תחשיב 24 גליון 2.xlsx

**Script:** `import_budget_pesach24.py`

### Steps

| Step | Source | Target table | Idempotency |
|------|--------|-------------|-------------|
| `exchange_rates` | Hard-coded from budget sheet | `exchange_rates` | Skip if `ccy` already exists |
| `budget` | גיליון1 right block (cols 13-18) | `expenses` | Skip per-row if sub-category already has a row |
| `invoices` | שוק מקומי רומניה.xlsx | `expenses` | Skip entire step if שוק מקומי sub-cat already has rows |
| `income` | DB: families.total_amount + payments sum | `income` | Skip if income_category_id=1 already has rows |

### Exchange rates imported
- `יורו` = 4.0 NIS (from budget sheet)
- `דולר` = 3.7 NIS ("דולר לפי 3.7" column header in budget sheet)
- `RON` = 0.8 NIS (approximate: EUR/RON ≈ 4.97 in Apr 2024)

### Column layout — גיליון1 (header=None)

The sheet has two side-by-side blocks. We import the **right block** only (planned vs. actual — right block is more accurate):

| col | Header | Purpose |
|-----|--------|---------|
| 13 | `סוג הוצאה` | Expense category name — maps via `EXPENSE_NAME_MAP` → DB sub-category |
| 14 | `מחיר יורו` | EUR amount → `expenditure` (preferred) |
| 15 | `מחיר דולר` | USD amount → `expenditure` (if no EUR) |
| 16 | `סה"כ שקל` | NIS total → `expenditure_ils` |
| 17 | `שולם` | Paid amount → `is_paid=1` if non-empty |
| 18 | `תאריך` | Payment date → `actual_payment_date` if paid |

Currency priority: EUR > USD > NIS.

### All 36 pre-seeded sub-categories are covered

The budget sheet rows map to the pre-seeded `expenses_sub_category` rows. If any row surfaces in the SKIPPED report, add it to `EXPENSE_NAME_MAP` in the script.

### Known filename quirk
The file has a **double space** between `פסח` and `תחשיב`: `פסח  תחשיב 24 גליון 2.xlsx`. The script finds it via `glob.glob("פסח*תחשיב 24 גליון 2.xlsx")`.

### Romanian invoices
- 93 data rows, amounts in RON
- All mapped to sub-category `שוק מקומי` (id=19, cat=1)
- `is_paid=0` for rows flagged "לא שולם!" in notes column
- `expenditure_ils` calculated as RON × 0.8 (approximate)

### Income row
- One aggregate row created: total of all `families.total_amount` values
- `is_paid=1` if ≥95% of total has been received (from `payments` table)
- `description` = `תשלומי משפחות - פסח 2024`

### Usage

```bash
# 1. Dry run — verify everything before writing
set PYTHONIOENCODING=utf-8 && python scripts/import_budget_pesach24.py \
  --vacation-id ce7c7ed2_4d76_41f0_92e5_699f6082cb27 --dry-run

# 2. Live run (all steps)
set PYTHONIOENCODING=utf-8 && python scripts/import_budget_pesach24.py \
  --vacation-id ce7c7ed2_4d76_41f0_92e5_699f6082cb27

# 3. Individual steps
... --steps exchange_rates
... --steps budget
... --steps invoices
... --steps income

# 4. Reset and re-run a step (example: invoices)
# DELETE FROM expenses WHERE expenses_sub_category_id = 19;
# then re-run --steps invoices
```

---

## 12. DB Schema Reference — Import-Relevant Columns

### families table (import-added columns via migration)

| Column | Type | Migration step | Source |
|--------|------|---------------|--------|
| `total_amount_eur` | VARCHAR(45) | 20 | כללי נרשמים col[14] |
| `number_of_pax_outbound` | VARCHAR(10) | 20 | כללי נרשמים col[6] |
| `number_of_pax_return` | VARCHAR(10) | 20 | כללי נרשמים col[7] |
| `number_of_babies` | VARCHAR(10) | 20 | כללי נרשמים col[8] |
| `voucher_number` | VARCHAR(20) | 20 | טפסי לקוחות col[5] |
| `special_requests` | TEXT | 20 | טפסי לקוחות col[11]; also appended with `מיקום: קסה` notes |
| `number_of_suites` | VARCHAR(10) | 23 | כללי נרשמים col[10] |
| `male_head` | VARCHAR(45) | 24 | כללי נרשמים col[3] |
| `female_head` | VARCHAR(45) | 24 | כללי נרשמים col[4] |

### flights table — import-added columns

| Column | Type | Migration step | Source |
|--------|------|---------------|--------|
| `booking_reference` | VARCHAR(10) | 25 | טיסות כללי — 'טיסות נוספות' col[19] |

### Idempotency keys

| Step | Idempotency key | Result |
|------|----------------|--------|
| families | `(family_name, male_head, female_head)` | UPDATE if exists, INSERT if new |
| guests | `(family_id, hebrew_first_name, hebrew_last_name)` | UPDATE if exists, INSERT if new |
| flights (guests step) | `user_id` (same as guest) | Created together with guest, updated together |
| flights (flights step) | passport → `user_id`, or `(heb_last, heb_first)` → `user_id` | UPDATE only — never creates records |
| room_taken | `ON DUPLICATE KEY UPDATE` on `(room_id)` | Safe to re-run |

---

## 13. Pesach 2025 — Structural Differences vs Pesach 2024

### Families file changes
| Feature | Pesach 2024 | Pesach 2025 |
|---------|-------------|-------------|
| File name | `כללי נרשמים.xlsx` | `נרשמים כללי.xlsx` |
| Main sheet | `גיליון1` | `נרשמים כללי` |
| family_name col | [2] | **[3]** (+1) |
| male_head col | [3] | **[4]** (+1) |
| female_head col | [4] | **[5]** (+1) |
| room col | [11] | **[12]** (+1) |
| room notes col | [12] (not imported) | **[13] NOW IMPORTED** → `special_requests` prefixed with `הערות חדר: ` |
| total NIS col | [13] | **[14]** (+1) |
| total EUR col | [14] | **[15]** (+1) |
| USD col | absent | **[16] NEW** → stored as `מחיר $: <amount>` in `special_requests` (no DB column) |
| phone/email/address | [19]/[22]/[23] | [21]/[24]/[25] (+2 contact offset) |
| `טפסי לקוחות` sheet | 73 rows (voucher + notes) | **EMPTY — skip** |
| Red detection | any cell in row | **family cell only** (col D = index 3) |
| Red-cancelled | 7 families | 2: `פשנדזה יצחק יחיאל בלעך`, `כהנא` |
| Total families | 97 rows | 61 rows (59 imported, 2 cancelled) |
| Total guests (sum) | ~338 | 319 |

### Guest file changes
| Feature | Pesach 2024 | Pesach 2025 |
|---------|-------------|-------------|
| File name | `כלל האורחים.xlsx` | `כלל אורחי המלון כולל צוות.xlsx` |
| Main sheet | `כליי שיוך לטיסות מעודכן 14.3.24` | `גיליון1` |
| Cols [10]–[17] | Full flight data (dates/airlines/numbers/times) | **ABSENT** — col[10] = flag only (`V`/`X`/`הלוך בלבד!/צוות`/blank) |
| Staff | Separate `צוות.xlsx` file | **Embedded in guest file** — skip rows where col[10]='צוות' (36 rows) |
| flying_with_us | Set by flights step | **Set at import time** from col[10] marker |
| `גיליון7` (seats) | 19 rows — seat preferences | **ABSENT** |
| `גיליון3` | absent | Room+age list (not imported) |

### flying_with_us logic for P25
- `V` → 1 (charter flight)
- `הלוך בלבד! - HISKY` → 1 (outbound charter only; מונסה חרמון family, 6 people)
- `X` → 0 (no charter; 26 guests)
- blank/NaN → 0 (hotel guest only; most guests)
- `צוות` → skip (staff)

### New/updated SUB_FAMILY_MAP entries for P25
| Guest last name | → Billing family | Note |
|-----------------|-----------------|------|
| `ברוזה` | `ברוזה (בקר)` | Billing family has parens in name |
| `מונסה חרמון` | `חרמון` | One-way charter guests |
| `חרמון מונסה` | `חרמון` | Same |

### New SPELLING_ALIASES for P25
| Guest file | → Billing file |
|-----------|---------------|
| `אללוף` | `אלאלוף` |
| `בירנבום` | `בירנבוים` |
| `ווייס` | `וייס` |
| `קרקובב` (parens content) | `הררי (קרקובר)` (typo fix) |

### P25 families with room data conflicts (same room assigned twice in Excel)
- Room 302: `סירקין` AND `פישל` — confirm with trip manager which is correct
- Room 410: `הררי` (409,410,417,512) AND `בירנבוים` — last import write wins; fix manually

### P25 guest-file block analysis — SUB_FAMILY_MAP entries (full list)

Block analysis of `כלל אורחי המלון כולל צוות.xlsx` (319 non-staff guests).
All 318 guests resolve correctly after the mappings below. 1 guest skipped.

| Guest last name | → Billing family | Evidence |
|-----------------|-----------------|---------|
| `ברוזה` | `ברוזה (בקר)` | billing family name includes parens |
| `מונסה חרמון` | `חרמון` | one-way HISKY charter group |
| `חרמון מונסה` | `חרמון` | same |
| `ברנשטיין` | `ליינר` | ביאנקה's maiden name (P24 pattern repeated) |
| `רוזנברג` (7p) | `וולגמוט` | embedded inside וולגמוט block; וולגמוט billing=16 |
| `ברכה וולגמוט` | `וולגמוט` | compound surname variant |
| `טויטו` (7p) | `רוזנפלד` | immediately follows רוזנפלד block; 8+8=16 guests |
| `דגן` (1p) | `רוזנפלד` | single guest inside טויטו/רוזנפלד block |
| `ג'קובס` (1p) | `לוי` | appears directly before לוי block; default→לוי-מנשה |
| `סוקניק בן דוד` | `גולדשמידט` | embedded in גולדשמידט block |
| `מקובר` | `גולדשמידט` | embedded in גולדשמידט block |
| `לזנובסקי-שטיינברג` | `שטיינברג` | compound surname, inside שטיינברג block |
| `פרנקנטל - כהן` | `פרנקנטל` | ורדה (female_head) with maiden name כהן |
| `סימן טוב` (4p) | `דותן` | embedded inside דותן block (billing=11) |
| `מהרי אהרונסון` (6p) | `אהרונסון` | compound surname, right after אהרונסון rows |
| `אינדורסקי` (1p) | `מרבך` | sandwiched inside מרבך block |
| `מוסא` (1p) | `קוטאי` | inside קוטאי block; מוסא+שטרית+יפת=7=billing total |
| `שטרית` (5p) | `קוטאי` | follows מוסא; קוטאי billing=7: 1+1+5=7 ✓ |
| `בונפיס` (4p) | `אספיס` | after אספיס rows; 4+5=9=אספיס billing total ✓ |
| `גרטנר בונפיס` (1p) | `אספיס` | compound surname (wife's maiden name Gartner) |
| `אייזן` (1p) | `פישל` | second of פישל's 2-guest billing |
| `כהן וייזר` | `כהן מאוריציו` | Mauricio's compound surname (Weizer) |
| `רפפורט לייזרוביץ` | `כהן מאוריציו` | wife |
| `כהן רפפורט` (3p) | `כהן מאוריציו` | children with combined surname |
| `רפפורט הוניג` | `כהן מאוריציו` | sub-family; total block=7=billing ✓ |
| `לאיזרוביץ ספורן` | `כהן מאוריציו` | sub-family |
| `פאלק` | `בירנבוים` | אופירה's maiden name; billing female_head=אופירה |

### P25 ambiguous families — disambiguation strategy

| Family | Billing entries | Strategy |
|--------|----------------|---------|
| `כהן` | צביקה/רחל-חן (6p), יוסי (2p), חיים/שירה (4p) | INDIVIDUAL_OVERRIDE seeds block_ctx for first row of each group: `צבי עלי`→צביקה, `יוסף`→יוסי; חיים resolves via head match |
| `שטרן` | אברהם (32p), משה/שרה (2p) | AMBIGUITY_PREFER→אברהם; משה and שרה resolve via head match |
| `לוי` | דניס (2p), מנשה (6p) | דניס עמנואל resolves via head match; AMBIGUITY_PREFER→מנשה for others |
| `פוגלר` | עידית (2p), רותי (6p) | INDIVIDUAL_OVERRIDE `דוד`→עידית; רותי resolves via head match |

### P25 INDIVIDUAL_OVERRIDES

| Key (raw_last, heb_first) | → (billing_family, head_hint) | Reason |
|--------------------------|-------------------------------|--------|
| `('כהן', 'צבי עלי')` | `('כהן', 'צביקה')` | first of כהן-צביקה 6p group; seeds block_ctx |
| `('כהן', 'יוסף')` | `('כהן', 'יוסי')` | first of כהן-יוסי 2p group; seeds block_ctx |
| `('פוגלר', 'דוד')` | `('פוגלר', 'עידית')` | appears before עידית; both in 2p group |
| `('ברוזה (בקר)', 'צופיה חיה')` | `('ברוזה (בקר)', None)` | parens 'בקר' wrongly resolves to billing family 'בקר'; override to correct family |

### P25 one skipped guest (expected)

| Guest | Reason |
|-------|--------|
| `הלוי / שירה` | `הלוי מלק` not registered for P25. Skipped. Decide manually which family she belongs to and add INDIVIDUAL_OVERRIDE if needed. |
