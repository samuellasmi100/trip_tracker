"""
import_excel_pesach25.py
=======================
One-time import of Pesach 2025 Excel data into trip_tracker_{vacationId}.

Usage:
    python scripts/import_excel_pesach25.py --vacation-id <id> [--dry-run] [--steps <steps>]

Steps (run in order):
    families   - Create families + room assignments from נרשמים כללי.xlsx  (safe to re-run)
    guests     - Import guests from כלל אורחי המלון כולל צוות.xlsx
                 (no flight data in this file — sets flying_with_us flag only)
    flights    - Enrich flights rows from טיסות.xlsx (run AFTER guests)
                 Sheets: HISKY (182p), Tarom (58p), El Al (53p), not-flying (25p)

Default: families only (wait for approval before adding more steps)

Key differences vs Pesach 2024:
  - Families sheet renamed to 'נרשמים כללי'; column indices all shifted +1 or +2
  - New col[0] = head ID (ת.ז.), col[1] = registration date, col[16] = USD amount
  - 'הערות על החדרים' (room notes, col[13]) NOW IMPORTED → families.special_requests
  - No טפסי לקוחות sheet (voucher/special-requests data) — skipped
  - Guest file has NO flight data columns — col[10] = V/X/blank/צוות marker only
  - Staff embedded in guest file: skip rows where col[10] = 'צוות'
  - Bare-concatenated room numbers (e.g. '409410417512') expanded into 3-digit groups
  - New non-room tokens: 'מלון דירות', 'אוכל בלבד', 'דירה'

Requirements:
    pip install pandas openpyxl mysql-connector-python python-dotenv
"""

import argparse
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re
import uuid
import math
from pathlib import Path
from datetime import datetime

import pandas as pd
import mysql.connector
from dotenv import load_dotenv

# ── Config ────────────────────────────────────────────────────────────────────

BASE_FOLDER = r"C:\Users\Shmuel\Downloads\אבימור פסח 25\נרשמים"

FILES = {
    "families": os.path.join(BASE_FOLDER, "נרשמים כללי.xlsx"),
    "guests":   os.path.join(BASE_FOLDER, "כלל אורחי המלון כולל צוות.xlsx"),
    "flights":  r"C:\Users\Shmuel\Downloads\אבימור פסח 25\טיסות\טיסות.xlsx",
}

# Vacation dates (from billing file מסלול column '9.4-21.4')
PESACH_START = "2025-04-09"
PESACH_END   = "2025-04-21"

# ── Non-room tokens in the room column ────────────────────────────────────────
# Tokens that represent a physical location but not a numbered hotel room.
# These are stored as notes in special_requests only (no room_taken row).
NON_ROOM_TOKENS   = {'דירה', 'מלון דירות', 'אוכל בלבד'}
# Multi-word tokens that must be matched BEFORE splitting raw value
MULTI_NON_ROOM    = {'מלון דירות', 'אוכל בלבד'}
# Placeholder tokens meaning "not yet assigned"
UNASSIGNED_TOKENS = {'0', 'x', 'X'}
# Virtual rooms — stored in room_taken (so they show in the room column of
# FamilyList) but have no matching entry in the rooms table.
# The room board filters these out via an INNER JOIN on rooms.
VIRTUAL_ROOMS     = {'קסה'}

# ── Guest-file spelling → billing-file spelling ────────────────────────────────
SPELLING_ALIASES = {
    # NOTE: 'הלוי מלק' is NOT in the P25 billing — הלוי guests will be skipped
    # Pesach 2025 specific
    'אללוף':    'אלאלוף',      # spelling variant
    'בירנבום':  'בירנבוים',    # spelling variant
    'ווייס':    'וייס',        # spelling variant
    # Parens-content aliases (used when guest has "X (Y)" form and Y has a typo)
    'קרקובב':   'הררי (קרקובר)',  # guest file typo 'קרקובב'; billing = הררי (קרקובר)
}

# ── Guest last name → billing parent family name ───────────────────────────────
# Value is either a string (unique target) or a tuple (family_name, male_head_hint)
SUB_FAMILY_MAP = {
    # ── Carried over from Pesach 2024 (same families returning) ──────────────
    'לרנר':             'שטרן',
    'יעקובזון':         'שטרן',
    'בייטלר':           'שטרן',
    'עציון':            'רייס',
    'עציון רייס':       'רייס',
    'גרין':             'רייס',
    'גרין רייס':        'רייס',
    'שרעבי':            ('הררי', 'מרקו'),   # inside הררי מרקו/שנטל block
    # ── Pesach 2025 specific ─────────────────────────────────────────────────
    # ברוזה: billing family name is "ברוזה (בקר)" with parens
    'ברוזה':            'ברוזה (בקר)',
    # חרמון / מונסה חרמון — these 6 guests fly "הלוך בלבד! - HISKY"; billing = חרמון
    'מונסה חרמון':      'חרמון',
    'חרמון מונסה':      'חרמון',

    # ── From block analysis of כלל אורחי המלון כולל צוות.xlsx ────────────────
    # ברנשטיין: ביאנקה's maiden name (same pattern as P24); billing = ליינר
    'ברנשטיין':         'ליינר',
    # רוזנברג (7 guests) embedded inside וולגמוט block
    'רוזנברג':          'וולגמוט',
    'ברכה וולגמוט':     'וולגמוט',   # compound surname variant within וולגמוט block
    # טויטו (7 guests) + דגן (1) complete רוזנפלד's 16-guest count
    'טויטו':            'רוזנפלד',
    'דגן':              'רוזנפלד',
    # Single guest before לוי block (name ג'קובס = Jacobs)
    "ג'קובס":           'לוי',
    # Embedded in גולדשמידט block
    'סוקניק בן דוד':    'גולדשמידט',
    'מקובר':            'גולדשמידט',
    # Compound-surname guests embedded in their blocks
    'לזנובסקי-שטיינברג': 'שטיינברג',
    'פרנקנטל - כהן':    'פרנקנטל',   # ורדה (female_head) with maiden name
    # סימן טוב (4 guests) embedded inside דותן block
    'סימן טוב':         'דותן',
    # מהרי אהרונסון (6 guests) immediately after אהרונסון rows
    'מהרי אהרונסון':    'אהרונסון',
    # Single guests sandwiched inside their billing-family blocks
    'אינדורסקי':        'מרבך',
    'מוסא':             'קוטאי',
    # שטרית (5 guests) + מוסא (1) complete קוטאי's 7-guest count
    'שטרית':            'קוטאי',
    # בונפיס (4) + גרטנר בונפיס (1) complete אספיס's 9-guest count (4 direct + 5 בונפיס)
    'בונפיס':           'אספיס',
    'גרטנר בונפיס':     'אספיס',     # compound surname (wife's maiden name Gartner)
    # אייזן is the second of פישל's 2-guest family
    'אייזן':            'פישל',
    # כהן מאוריציו block (7 guests total) — all compound-surname relatives
    'כהן וייזר':        'כהן מאוריציו',   # Mauricio himself (surname Weizer)
    'רפפורט לייזרוביץ': 'כהן מאוריציו',   # wife
    'כהן רפפורט':       'כהן מאוריציו',   # children with compound surname
    'רפפורט הוניג':     'כהן מאוריציו',   # sub-family
    'לאיזרוביץ ספורן':  'כהן מאוריציו',   # sub-family
    # פאלק: אופירה's maiden name; billing = בירנבוים (female_head = אופירה)
    'פאלק':             'בירנבוים',
}

# ── Per-individual overrides for ambiguous same-name families ──────────────────
# Key: (raw_last_name_from_excel, hebrew_first_name)
# Value: (billing_family_name, head_hint_for_pick_by_head_or_None)
INDIVIDUAL_OVERRIDES = {
    # כהן has 3 billing entries: צביקה/רחל-חן (6p), יוסי (2p), חיים/שירה (4p)
    # First person in each group seeds block_ctx for the rest.
    # חיים resolves via direct head match; only the other two need overrides.
    ('כהן', 'צבי עלי'):  ('כהן', 'צביקה'),  # head of 6-person צביקה/רחל-חן group
    ('כהן', 'יוסף'):     ('כהן', 'יוסי'),   # head of 2-person יוסי group (יוסי=יוסף)
    # פוגלר has 2 billing entries: עידית (2p), רותי (6p)
    # דוד appears first in the file before עידית; he belongs to פוגלר-עידית.
    # רותי herself resolves via head match; subsequent רותי-group rows use block_ctx.
    ('פוגלר', 'דוד'):    ('פוגלר', 'עידית'),
    # ברוזה (בקר) / צופיה חיה: parens 'בקר' wrongly resolves to billing family 'בקר'.
    # Override to route her to the correct family 'ברוזה (בקר)'.
    ('ברוזה (בקר)', 'צופיה חיה'): ('ברוזה (בקר)', None),
    # הלוי שירה flies El Al with הררי מרקו group (PDF: "הררי הלוי שירה.pdf").
    # 'הלוי מלק' is NOT in the P25 billing — route her to הררי directly.
    ('הלוי', 'שירה'): ('הררי', 'מרקו'),
}

# ── Ambiguity fallback ────────────────────────────────────────────────────────
AMBIGUITY_PREFER = {
    'הררי': 'מרקו',   # default: הררי guests → הררי מרקו/שנטל (18-person family)
    # שטרן has 2 entries: אברהם (32p) and משה/שרה (2p).
    # משה and שרה resolve via head match; all others default to אברהם.
    'שטרן': 'אברהם',
    # לוי has 2 entries: דניס (2p) and מנשה (6p).
    # דניס resolves via head match (heb_first='דניס עמנואל' contains 'דניס').
    # ג'קובס/שירה appears before the לוי block — falls back to the larger מנשה group.
    'לוי': 'מנשה',
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def safe_str(val, max_len=None):
    """Return clean string or None for empty/nan."""
    if val is None:
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    s = str(val).strip()
    if s in ("", "nan", "NaT", "None"):
        return None
    if max_len and len(s) > max_len:
        s = s[:max_len]
    return s

def safe_int(val):
    try:
        if val is None or (isinstance(val, float) and math.isnan(val)):
            return None
        return int(float(val))
    except (ValueError, TypeError):
        return None

def safe_date(val):
    """Return date as YYYY-MM-DD string, or None."""
    if val is None:
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    # pandas NaT has strftime but raises ValueError — must check before calling
    try:
        import pandas as _pd
        if _pd.isnull(val):
            return None
    except (TypeError, ValueError):
        pass
    if hasattr(val, 'strftime'):
        return val.strftime('%Y-%m-%d')
    s = str(val).strip()
    if s in ('', 'nan', 'NaT', 'None', 'NaTType'):
        return None
    for fmt in ('%Y-%m-%d %H:%M:%S', '%d/%m/%Y', '%m/%d/%Y', '%Y-%m-%d'):
        try:
            return datetime.strptime(s, fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue
    return s[:10] if len(s) >= 10 else s

def db_query(conn, sql, params=()):
    """Execute a SELECT and return list of rows."""
    cur = conn.cursor()
    cur.execute(sql, params)
    rows = cur.fetchall()
    cur.close()
    return rows

def new_uuid():
    return str(uuid.uuid4()).replace("-", "_")

def connect(vacation_id):
    load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        database=f"trip_tracker_{vacation_id}",
        charset="utf8mb4",
    )
    conn.autocommit = False
    return conn

def db_exec(conn, sql, params, dry_run, label=""):
    """Execute SQL or print dry-run label. Returns lastrowid or None."""
    if dry_run:
        print(f"    [DRY] {label}")
        return None
    cur = conn.cursor()
    cur.execute(sql, params)
    return cur.lastrowid

def is_negative_amount(val):
    """Return True if val is a non-empty numeric string that is negative."""
    s = safe_str(val)
    if not s:
        return False
    cleaned = s.replace(",", "").replace(" ", "").strip()
    try:
        return float(cleaned) < 0
    except (ValueError, TypeError):
        return False


def expand_rooms(raw):
    """
    Expand room shorthand notation into a list of full room number strings.

    Handles all formats seen in Pesach 2025:
      "305.6.7.8.9.10"  → ["305","306","307","308","309","310"]  (dot shorthand)
      "409410417512"     → ["409","410","417","512"]             (bare 3-digit concat)
      "212,13,17"        → ["212","213","217"]                   (comma shorthand)
      "509,10"           → ["509","510"]                         (comma shorthand)
      "102.317.511.515"  → ["102","317","511","515"]             (dot-separated full)
      "205.6.7"          → ["205","206","207"]
      "קסה"              → ["קסה"]                               (non-room token)
      "X"                → ["X"]
      "204, קסה, דירה"   → ["204","קסה","דירה"]

    Rule for shorthand: if a token is SHORTER than the current base, it replaces
    the last len(token) digits of the base. If same length or longer, it's a new
    full room number (and becomes the new base).
    """
    if not raw:
        return []

    raw = str(raw).strip()

    # ── Multi-word non-room tokens: return before splitting ──────────────────
    if raw in MULTI_NON_ROOM:
        return [raw]

    # ── Bare concatenation: expand e.g. "409410417512" → "409 410 417 512" ──
    # Purely numeric run of ≥ 6 chars whose length is a multiple of 3
    # is assumed to be consecutive 3-digit room numbers with no separator.
    def _split_bare(m):
        s = m.group(0)
        if len(s) >= 6 and len(s) % 3 == 0:
            return ' '.join(s[i:i+3] for i in range(0, len(s), 3))
        return s  # leave unchanged (e.g. a single 4- or 5-digit number)

    raw = re.sub(r'\d{6,}', _split_bare, raw)

    # ── Split on all separators: commas, semicolons, dots, whitespace ────────
    parts = [t.strip() for t in re.split(r'[,;.\s]+', raw)]
    parts = [p for p in parts if p]

    if not parts:
        return []

    # ── Apply shorthand expansion ─────────────────────────────────────────────
    result = []
    base = None
    for part in parts:
        if not re.match(r'^\d+$', part):
            # Non-numeric token (e.g. קסה, X, דירה) — add as-is, reset base
            result.append(part)
            base = None
            continue
        if base is None or len(part) >= len(base):
            # New full room number
            result.append(part)
            base = part
        else:
            # Shorthand: replace last len(part) digits of current base
            expanded = base[:len(base) - len(part)] + part
            result.append(expanded)
            # base stays the same
    return result


# ── Families + Room assignments from נרשמים כללי ──────────────────────────────
#
# Column mapping (P25 — ALL OFFSETS DIFFER FROM P24):
#   [0]  ת.ז.                   — head ID (not imported to families table)
#   [1]  registration date       — not imported
#   [2]  מסלול                   — not imported
#   [3]  משפחה                   → families.family_name         *** WAS [2] ***
#   [4]  פרטי זכר               → families.male_head            *** WAS [3] ***
#   [5]  פרטי נקבה              → families.female_head           *** WAS [4] ***
#   [6]  נפשות כולל תינוקות    → families.number_of_guests      *** WAS [5] ***
#   [7]  נפשות הלוך             → families.number_of_pax_outbound *** WAS [6] ***
#   [8]  נפשות חזור             → families.number_of_pax_return  *** WAS [7] ***
#   [9]  תינוקות                → families.number_of_babies      *** WAS [8] ***
#   [10] חדרים                  → families.number_of_rooms       *** WAS [9] ***
#   [11] סוויטות                → families.number_of_suites      *** WAS [10] ***
#   [12] סוג חדר (room)         → room_taken                     *** WAS [11] ***
#   [13] הערות על החדרים        → families.special_requests      *** NEW — WAS not imported ***
#   [14] סה"כ מחיר (NIS)        → families.total_amount          *** WAS [13] ***
#   [15] סה"כ ביורו             → families.total_amount_eur      *** WAS [14] ***
#   [16] סה"כ בדולר (USD)        — note appended to special_requests (no DB column) *** NEW ***
#   [17] טיסות                  — not imported
#   [18] חריגים לטיסות          — not imported
#   [21] נייד 1                 → guest.phone_a (contact on guest, not families)
#   [24] מייל                   → guest.email   (contact on guest, not families)
#   [25] כתובת                  → guest.address (contact on guest, not families)
#
# Note: contact fields (phone/email/address) go on GUEST, not families.
# They are read here only to store temporarily; the families step does NOT write them.
# (Families table has no phone/email/address columns.)

def _get_red_family_names(path):
    """
    Use openpyxl to detect red-highlighted rows in 'נרשמים כללי'.
    Returns a set of family names (col D, index 3 = families column) whose row
    has a red fill. Red fill: R > 150 and R > G+30 and R > B+30.
    """
    import openpyxl

    def _is_red(cell):
        fill = cell.fill
        if not fill or fill.fill_type in ("none", None):
            return False
        fg = fill.fgColor
        if not fg or fg.type != "rgb":
            return False
        rgb = fg.rgb
        if len(rgb) != 8:
            return False
        r, g, b = int(rgb[2:4], 16), int(rgb[4:6], 16), int(rgb[6:8], 16)
        return r > 150 and r > g + 30 and r > b + 30

    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb["נרשמים כללי"]   # ← sheet renamed from גיליון1 in P24
    red_names = set()
    for row in ws.iter_rows():
        if row[0].row == 1:   # header row
            continue
        # Family name is column D (0-indexed col 3) — shifted from P24's col 2
        family_cell = row[3] if len(row) > 3 else None
        if not family_cell or not family_cell.value:
            continue
        # P25: only check the family name cell itself (col D) for red highlight.
        # Checking any cell in the row was too broad — some rows have other red cells
        # (e.g. payment dates, amounts) without the whole row being cancelled.
        if _is_red(family_cell):
            red_names.add(str(family_cell.value).strip())
    wb.close()
    return red_names


def import_families(conn, dry_run):
    print("\n=== Families from נרשמים כללי.xlsx ===")

    # ---- Detect red (cancelled) rows via openpyxl BEFORE pandas ----
    red_family_names = _get_red_family_names(FILES["families"])
    print(f"\n  Red-highlighted (cancelled) families to skip: {sorted(red_family_names)}")

    xl = pd.ExcelFile(FILES["families"])

    # ---- Diagnose headers ----
    df_head = xl.parse("נרשמים כללי", header=0, nrows=2)
    print("\n  Column map (header | first-data-row sample):")
    for i, col in enumerate(df_head.columns):
        sample = safe_str(df_head.iloc[0, i]) if len(df_head) > 0 else "-"
        print(f"    col[{i:2d}]  '{col}'  |  '{sample}'")

    # ---- Parse main sheet ----
    df = xl.parse("נרשמים כללי", header=0)
    # Filter to rows with a family name (col[3])
    df = df[df.iloc[:, 3].apply(lambda v: bool(safe_str(v)))]
    print(f"\n  {len(df)} data rows in 'נרשמים כללי' (before red filter)")

    # ---- No 'טפסי לקוחות' sheet in P25 — skip gracefully ----
    print("  'טפסי לקוחות' sheet: not present in P25 — skipping (0 voucher/notes rows)")

    # ---- Load valid room IDs from DB ----
    cur = conn.cursor()
    cur.execute("SELECT rooms_id FROM rooms")
    valid_rooms = {str(r[0]).strip() for r in cur.fetchall()}
    cur.close()
    sample_rooms = sorted(valid_rooms)[:8]
    print(f"  {len(valid_rooms)} valid room IDs in DB (sample: {sample_rooms})")

    # ---- Load existing families: (name, male_head, female_head) -> family_id ----
    cur = conn.cursor()
    cur.execute("SELECT family_name, family_id, male_head, female_head FROM families")
    family_id_map = {}
    for fname_db, fid, mh, fh in cur.fetchall():
        key = (fname_db.strip(), (mh or '').strip(), (fh or '').strip())
        family_id_map[key] = fid
    cur.close()
    print(f"  {len(family_id_map)} families already in DB\n")

    # ── tracking ──────────────────────────────────────────────────────────────
    created       = []
    updated       = []
    skipped_fam   = []
    rooms_ok      = []
    rooms_skipped = []

    for _, row in df.iterrows():
        # ── P25 column indices (shifted +1 or +2 vs P24) ─────────────────────
        fname      = safe_str(row.iloc[3], 45)    # col[3] family name
        if not fname:
            continue

        # ── Skip red-highlighted (cancelled) rows ──────────────────────────────
        if fname in red_family_names:
            skipped_fam.append((fname, "RED HIGHLIGHT — cancelled/not attending"))
            continue

        male_head  = safe_str(row.iloc[4], 45)            # col[4]
        female_head= safe_str(row.iloc[5], 45)            # col[5]
        total_pax  = safe_int(row.iloc[6])                # col[6]
        pax_out    = safe_str(safe_int(row.iloc[7]),  10) # col[7]
        pax_ret    = safe_str(safe_int(row.iloc[8]),  10) # col[8]
        babies     = safe_str(safe_int(row.iloc[9]),  10) # col[9]
        num_rooms  = safe_str(safe_int(row.iloc[10]), 45) # col[10]
        num_suites = safe_str(safe_int(row.iloc[11]), 10) # col[11]
        room_raw   = safe_str(row.iloc[12])               # col[12] room numbers
        room_notes = safe_str(row.iloc[13])               # col[13] NEW — room notes
        total_nis  = safe_str(row.iloc[14], 45)           # col[14]
        total_eur  = safe_str(row.iloc[15], 45)           # col[15]
        total_usd  = safe_str(row.iloc[16], 45) if len(row) > 16 else None  # col[16] NEW

        num_guests = safe_str(total_pax, 45) if total_pax else pax_out

        # ── Skip cancellations: negative NIS or EUR amount ────────────────────
        if is_negative_amount(total_nis) or is_negative_amount(total_eur):
            skipped_fam.append((fname,
                f"NEGATIVE AMOUNT — NIS={total_nis}, EUR={total_eur} (cancellation?)"))
            continue

        # ── Build special_requests from room notes + USD note ─────────────────
        # Room notes (col[13]) are stored with prefix "הערות חדר: "
        # USD amounts (col[16]) are stored as "מחיר $: <amount>"
        # Multiple notes are joined with " | "
        notes_parts = []
        if room_notes:
            notes_parts.append(f"הערות חדר: {room_notes}")
        if total_usd:
            notes_parts.append(f"מחיר $: {total_usd}")
        built_notes = " | ".join(notes_parts) if notes_parts else None

        # Composite key: (family_name, male_head, female_head)
        key = (fname, male_head or '', female_head or '')

        # ── INSERT or UPDATE family ───────────────────────────────────────────
        if key in family_id_map:
            family_id = family_id_map[key]
            sql_upd = """
                UPDATE families SET
                  male_head              = COALESCE(%s, male_head),
                  female_head            = COALESCE(%s, female_head),
                  number_of_guests       = COALESCE(%s, number_of_guests),
                  number_of_rooms        = COALESCE(%s, number_of_rooms),
                  number_of_suites       = COALESCE(%s, number_of_suites),
                  number_of_pax_outbound = COALESCE(%s, number_of_pax_outbound),
                  number_of_pax_return   = COALESCE(%s, number_of_pax_return),
                  number_of_babies       = COALESCE(%s, number_of_babies),
                  total_amount           = COALESCE(%s, total_amount),
                  total_amount_eur       = COALESCE(%s, total_amount_eur),
                  special_requests       = COALESCE(%s, special_requests)
                WHERE family_id = %s
            """
            db_exec(conn, sql_upd,
                    (male_head, female_head,
                     num_guests, num_rooms, num_suites, pax_out, pax_ret, babies,
                     total_nis, total_eur, built_notes, family_id),
                    dry_run,
                    f"UPDATE '{fname}' ({male_head}/{female_head}) | guests={num_guests} | NIS={total_nis} | notes={repr(built_notes)}")
            updated.append((fname, family_id))
        else:
            family_id = new_uuid()
            sql_ins = """
                INSERT INTO families
                  (family_id, family_name, male_head, female_head,
                   number_of_guests, number_of_rooms, number_of_suites,
                   number_of_pax_outbound, number_of_pax_return, number_of_babies,
                   total_amount, total_amount_eur, special_requests,
                   doc_token)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,UUID())
            """
            db_exec(conn, sql_ins,
                    (family_id, fname, male_head, female_head,
                     num_guests, num_rooms, num_suites,
                     pax_out, pax_ret, babies,
                     total_nis, total_eur, built_notes),
                    dry_run,
                    f"INSERT '{fname}' ({male_head}/{female_head}) | guests={num_guests} | NIS={total_nis} | notes={repr(built_notes)}")
            family_id_map[key] = family_id
            created.append((fname, family_id))

        # ── Room assignment ───────────────────────────────────────────────────
        if not room_raw:
            continue

        expanded = expand_rooms(room_raw)
        print(f"  ROOMS  '{fname}': raw='{room_raw}' => {expanded}")

        for tok in expanded:
            tok = tok.strip()

            # ── Virtual rooms (e.g. קסה) → room_taken row, no rooms-table entry ──
            # These show in the FamilyList room column but are filtered out of
            # the room board (getBoardBookings uses INNER JOIN on rooms).
            if tok in VIRTUAL_ROOMS:
                sql_rt = """
                    INSERT INTO room_taken (family_id, room_id, start_date, end_date)
                    VALUES (%s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                      family_id  = VALUES(family_id),
                      start_date = VALUES(start_date),
                      end_date   = VALUES(end_date)
                """
                db_exec(conn, sql_rt,
                        (family_id, tok, PESACH_START, PESACH_END),
                        dry_run, f"  virtual-room room_taken '{tok}' -> '{fname}'")
                rooms_ok.append((fname, tok))
                continue

            # ── Non-room location → append to special_requests ─────────────────
            if tok in NON_ROOM_TOKENS:
                note = f' | מיקום: {tok}'
                db_exec(conn,
                        "UPDATE families SET special_requests = CONCAT(COALESCE(special_requests,''), %s) WHERE family_id = %s",
                        (note, family_id), dry_run,
                        f"  location note '{tok}' appended to '{fname}'")
                rooms_ok.append((fname, f'[{tok}]'))
                continue

            # ── Unassigned placeholder (0, X) → skip silently ────────────────
            if tok in UNASSIGNED_TOKENS:
                rooms_skipped.append((fname, room_raw, f"'{tok}' = unassigned placeholder"))
                continue

            if not re.match(r'^\d+$', tok):
                rooms_skipped.append((fname, room_raw, f"'{tok}' not a number"))
                continue

            if tok not in valid_rooms:
                rooms_skipped.append((fname, room_raw,
                    f"room '{tok}' not in DB (valid sample: {sample_rooms})"))
                continue

            sql_rt = """
                INSERT INTO room_taken (family_id, room_id, start_date, end_date)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                  family_id  = VALUES(family_id),
                  start_date = VALUES(start_date),
                  end_date   = VALUES(end_date)
            """
            db_exec(conn, sql_rt,
                    (family_id, tok, PESACH_START, PESACH_END),
                    dry_run, f"  room_taken room {tok} -> '{fname}'")
            rooms_ok.append((fname, tok))

    # ── Report ────────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  FAMILIES CREATED:  {len(created)}")
    print(f"  FAMILIES UPDATED:  {len(updated)}")
    print(f"  FAMILIES SKIPPED:  {len(skipped_fam)}")
    print(f"  ROOMS ASSIGNED:    {len(rooms_ok)}")
    print(f"  ROOMS SKIPPED:     {len(rooms_skipped)}")
    print(f"{'='*60}")

    print(f"\n  --- Created ({len(created)}) ---")
    for fname, _ in created:
        room_ids = [r for f, r in rooms_ok if f == fname]
        print(f"    + {fname:<35}  rooms: {', '.join(room_ids) or '(none)'}")

    if updated:
        print(f"\n  --- Updated ({len(updated)}) ---")
        for fname, _ in updated:
            room_ids = [r for f, r in rooms_ok if f == fname]
            print(f"    ~ {fname:<35}  rooms: {', '.join(room_ids) or '(none)'}")

    if skipped_fam:
        print(f"\n  --- Skipped families ({len(skipped_fam)}) ---")
        for fname, reason in skipped_fam:
            print(f"    - {fname}: {reason}")

    if rooms_skipped:
        print(f"\n  --- Skipped room assignments ({len(rooms_skipped)}) ---")
        for fname, raw, reason in rooms_skipped:
            print(f"    - {fname}: raw='{raw}' => {reason}")


# ── Guest file helpers ────────────────────────────────────────────────────────

def _strip_parens(s):
    """Remove (parenthetical) suffix. 'כהן (לוי)' → 'כהן'."""
    return re.sub(r'\s*\(.*?\)\s*', '', s).strip()

def _extract_parens(s):
    """Return content inside first parens, or None."""
    m = re.search(r'\((.+?)\)', s)
    return m.group(1).strip() if m else None

def _pick_family_by_head(families, head_hint):
    """
    From a list of (family_id, male_head, female_head) pick a matching family.
    head_hint == None  → return None
    head_hint == ''    → pick family with NO male_head AND NO female_head
    head_hint == <str> → substring match on male_head or female_head (bidirectional)
    """
    if head_hint is None:
        return None
    if head_hint == '':
        for fid, mh, fh in families:
            if not mh and not fh:
                return fid
        return None
    for fid, mh, fh in families:
        if mh and (head_hint in mh or mh in head_hint):
            return fid
        if fh and (head_hint in fh or fh in head_hint):
            return fid
    return None

def _resolve_family(raw_name, name_to_families, heb_first=None, block_ctx=None):
    """
    Map a guest's raw last name to a family_id.
    Resolution order: INDIVIDUAL_OVERRIDES → parens alias → SPELLING_ALIASES →
                      SUB_FAMILY_MAP → exact DB match → disambiguation.
    Returns (family_id, canonical_name) or (None, reason_string).
    """
    if not raw_name:
        return None, 'empty name'

    # ── 1. Individual overrides ──────────────────────────────────────────────
    override = INDIVIDUAL_OVERRIDES.get((raw_name, heb_first or ''))
    if override:
        override_name, override_head = override
        if override_name not in name_to_families:
            return None, f"override target '{override_name}' not in DB"
        fams = name_to_families[override_name]
        if len(fams) == 1:
            # Seed block_ctx so subsequent rows with same last name inherit this family
            if block_ctx is not None:
                block_ctx[override_name] = fams[0][0]
            return fams[0][0], override_name
        fid = _pick_family_by_head(fams, override_head)
        if fid:
            if block_ctx is not None:
                block_ctx[override_name] = fid
            return fid, override_name
        return None, f"override target '{override_name}' ambiguous (head '{override_head}' not found)"

    parens_content = _extract_parens(raw_name)
    base_name      = _strip_parens(raw_name)

    # ── 2. Parens content = explicit billing parent ──────────────────────────
    if parens_content:
        p = SPELLING_ALIASES.get(parens_content, parens_content)
        if p in name_to_families:
            fams = name_to_families[p]
            if len(fams) == 1:
                return fams[0][0], p
            fid = _pick_family_by_head(fams, heb_first)
            if fid:
                return fid, p
            if block_ctx and p in block_ctx:
                return block_ctx[p], p
            pref = AMBIGUITY_PREFER.get(p)
            if pref:
                fid = _pick_family_by_head(fams, pref)
                if fid:
                    return fid, p
            return None, f"ambiguous: multiple families named '{p}'"

    # ── 3. Spelling alias ────────────────────────────────────────────────────
    canonical  = SPELLING_ALIASES.get(base_name, base_name)
    head_hint  = None

    # ── 4. Sub-family map ────────────────────────────────────────────────────
    billing = SUB_FAMILY_MAP.get(canonical)
    if billing:
        if isinstance(billing, tuple):
            canonical, head_hint = billing
        else:
            canonical = billing

    if canonical not in name_to_families:
        return None, f"'{canonical}' not found in DB"

    fams = name_to_families[canonical]

    # ── 5. Unique match ──────────────────────────────────────────────────────
    if len(fams) == 1:
        if block_ctx is not None:
            block_ctx[canonical] = fams[0][0]
        return fams[0][0], canonical

    # ── Multiple families — disambiguation ────────────────────────────────────
    # a. head_hint from SUB_FAMILY_MAP tuple
    if head_hint:
        fid = _pick_family_by_head(fams, head_hint)
        if fid:
            return fid, canonical

    # b. guest's first name matches a billing head
    if heb_first:
        fid = _pick_family_by_head(fams, heb_first)
        if fid:
            if block_ctx is not None:
                block_ctx[canonical] = fid
            return fid, canonical

    # c. block context from a previous row in the same block
    if block_ctx and canonical in block_ctx:
        return block_ctx[canonical], canonical

    # d. AMBIGUITY_PREFER fallback
    pref = AMBIGUITY_PREFER.get(canonical)
    if pref:
        fid = _pick_family_by_head(fams, pref)
        if fid:
            if block_ctx is not None:
                block_ctx[canonical] = fid
            return fid, canonical

    return None, f"ambiguous: multiple families named '{canonical}' — add to INDIVIDUAL_OVERRIDES"


# ── Guests from כלל אורחי המלון כולל צוות ────────────────────────────────────
#
# Column mapping (P25 guest file — sheet 'גיליון1'):
#   [0]  blank / flag            — not imported
#   [1]  משפחה (Hebrew last)     → guest.hebrew_last_name + family lookup key
#   [2]  פרטי (Hebrew first)     → guest.hebrew_first_name
#   [3]  משפחה.1 (English last)  → guest.english_last_name
#   [4]  פרטי.1 (English first)  → guest.english_first_name
#   [5]  דרכון                   → flights.passport_number
#   [6]  תוקף                    → flights.validity_passport
#   [7]  ת.לידה                  → guest.birth_date + flights.birth_date
#   [8]  ת.ז.                    → guest.identity_id
#   [9]  גיל                     → guest.age + flights.age
#   [10] טיסות כלולות?           — V / X / blank / 'הלוך בלבד! - HISKY' / 'צוות'
#                                  NOT actual flight data — use only to set flying_with_us
#                                  SKIP rows where value = 'צוות' (staff rows)
#   [11] notes                   — not imported
#
# flying_with_us logic:
#   'V'              → 1  (has charter flight)
#   'הלוך בלבד...'  → 1  (has outbound charter, return independent)
#   'X'              → 0  (no charter flight, hotel only)
#   blank/NaN        → 0  (hotel guest, no charter)
#   'צוות'           → SKIP (staff, not imported as guest)
#
# No actual flight date/airline/number data in this file.
# The flights row is still created for each guest (passport + DOB stored),
# but all date/airline/number fields will be NULL.

def import_guests(conn, dry_run):
    print("\n=== Guests from כלל אורחי המלון כולל צוות.xlsx ===")
    xl = pd.ExcelFile(FILES["guests"])
    sheet_name = "גיליון1"

    # ---- Diagnose headers ----
    df_head = xl.parse(sheet_name, header=0, nrows=2)
    print("\n  Column map (header | first-data-row sample):")
    for i, col in enumerate(df_head.columns):
        sample = safe_str(df_head.iloc[0, i]) if len(df_head) > 0 else "-"
        print(f"    col[{i:2d}]  '{col}'  |  '{sample}'")

    # ---- Parse guest sheet ----
    df = xl.parse(sheet_name, header=0)
    df = df[df.iloc[:, 1].apply(lambda v: bool(safe_str(v)))]
    print(f"\n  {len(df)} data rows with a family name in '{sheet_name}'")

    # ---- Load families from DB ----
    name_to_families = {}
    for (fname_db, fid, mh, fh) in db_query(
            conn, "SELECT family_name, family_id, male_head, female_head FROM families"):
        name_to_families.setdefault(fname_db.strip(), []).append(
            (fid, (mh or '').strip(), (fh or '').strip()))
    print(f"  {len(name_to_families)} unique family names in DB\n")

    # ---- Load existing guests for idempotency ----
    existing_guests = {}
    for (fid, hfn, hln, uid) in db_query(
            conn, "SELECT family_id, hebrew_first_name, hebrew_last_name, user_id FROM guest"):
        key = (fid, (hfn or '').strip(), (hln or '').strip())
        existing_guests[key] = uid

    # ── tracking ──────────────────────────────────────────────────────────────
    created        = []
    updated        = []
    skipped        = []
    skipped_staff  = 0
    block_ctx      = {}

    for _, row in df.iterrows():
        raw_last  = safe_str(row.iloc[1], 45)
        heb_first = safe_str(row.iloc[2], 45)
        eng_last  = safe_str(row.iloc[3], 45)
        eng_first = safe_str(row.iloc[4], 45)
        passport  = safe_str(row.iloc[5], 45)
        validity  = safe_str(row.iloc[6], 45)
        birth_dt  = safe_date(row.iloc[7])         if len(row) > 7  else None
        id_num    = safe_str(row.iloc[8], 45)       if len(row) > 8  else None
        age_val   = safe_str(safe_int(row.iloc[9]),45) if len(row) > 9  else None
        flight_marker = safe_str(row.iloc[10])      if len(row) > 10 else None

        if not raw_last:
            continue

        # ── Skip staff rows ────────────────────────────────────────────────────
        if flight_marker and 'צוות' in flight_marker:
            skipped_staff += 1
            continue

        # ── Determine flying_with_us ───────────────────────────────────────────
        if flight_marker == 'V' or (flight_marker and 'הלוך' in flight_marker):
            flying_with_us = 1
        else:
            # 'X', blank, or any other value → hotel guest, no charter
            flying_with_us = 0

        heb_last = _strip_parens(raw_last)

        # ── Resolve family ───────────────────────────────────────────────────
        family_id, resolve_result = _resolve_family(
            raw_last, name_to_families, heb_first=heb_first, block_ctx=block_ctx)

        if not family_id:
            skipped.append((raw_last, heb_first, resolve_result))
            continue

        # ── Idempotency check ────────────────────────────────────────────────
        guest_key    = (family_id, heb_first or '', heb_last or '')
        existing_uid = existing_guests.get(guest_key)

        if existing_uid:
            db_exec(conn, """
                UPDATE guest SET
                  english_first_name = COALESCE(%s, english_first_name),
                  english_last_name  = COALESCE(%s, english_last_name),
                  identity_id        = COALESCE(%s, identity_id),
                  age                = COALESCE(%s, age),
                  birth_date         = COALESCE(%s, birth_date),
                  flying_with_us     = %s
                WHERE user_id = %s
            """, (eng_first, eng_last, id_num, age_val, birth_dt,
                  flying_with_us, existing_uid),
            dry_run, f"UPDATE guest '{heb_first} {heb_last}' flying_with_us={flying_with_us}")

            db_exec(conn, """
                UPDATE flights SET
                  passport_number   = COALESCE(%s, passport_number),
                  validity_passport = COALESCE(%s, validity_passport),
                  birth_date        = COALESCE(%s, birth_date),
                  age               = COALESCE(%s, age)
                WHERE user_id = %s
            """, (passport, validity, birth_dt, age_val, existing_uid),
            dry_run, f"  UPDATE flights for '{heb_first} {heb_last}'")
            updated.append((raw_last, heb_first))
        else:
            user_id = new_uuid()
            db_exec(conn, """
                INSERT INTO guest
                  (user_id, family_id, hebrew_first_name, hebrew_last_name,
                   english_first_name, english_last_name,
                   identity_id, age, birth_date,
                   is_main_user, flying_with_us)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,0,%s)
            """, (user_id, family_id, heb_first, heb_last,
                  eng_first, eng_last, id_num, age_val, birth_dt,
                  flying_with_us),
            dry_run,
            f"INSERT guest '{heb_first} {heb_last}' -> '{resolve_result}' flying_with_us={flying_with_us}")

            # Create flights row — passport/DOB stored; flight details NULL (not in this file)
            db_exec(conn, """
                INSERT INTO flights
                  (user_id, family_id,
                   passport_number, validity_passport, birth_date, age,
                   is_source_user)
                VALUES (%s,%s,%s,%s,%s,%s,0)
            """, (user_id, family_id, passport, validity, birth_dt, age_val),
            dry_run, f"  INSERT flights (passport only) for '{heb_first} {heb_last}'")

            existing_guests[guest_key] = user_id
            created.append((raw_last, heb_first))

    # ── Report ────────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  GUESTS CREATED:  {len(created)}")
    print(f"  GUESTS UPDATED:  {len(updated)}")
    print(f"  GUESTS SKIPPED:  {len(skipped)}")
    print(f"  STAFF SKIPPED:   {skipped_staff}  (not imported — staff rows)")
    print(f"{'='*60}")

    if skipped:
        print(f"\n  --- Skipped guests ({len(skipped)}) ---")
        for raw_ln, fn, reason in skipped:
            print(f"    - {fn or ''} {raw_ln}: {reason}")


# ── Flights from טיסות.xlsx ───────────────────────────────────────────────────
#
# Sheets processed (in order):
#   1. 'הלוך -חזור טארום'      — Tarom, 58 pax, DOBs in col[5], dates hardcoded
#   2. 'הלוך - חזור'           — HISKY charter, 182 pax, dates hardcoded
#   3. 'אל על שטרן והררי'      — El Al, 53 pax, full data per row (2-row header)
#   4. 'לא טסים איתנו'         — 25 pax, set flying_with_us=0 only
#   5. 'צוות', 'גיליון7'       — SKIPPED (staff / return summary)
#
# Column mapping:
#   HISKY  (header row 0): [1]=heb_last [2]=heb_first [5]=DOB [7]=seat_notes
#   Tarom  (header row 0): [1]=heb_last [2]=heb_first [5]=DOB [7]=flag [9]=seat_notes
#     flag col[7] special values:
#       'הלוך בלבד! - הייסקי'  → outbound=HISKY/9.4; return=Tarom/21.4
#       'הלוך בלבד'             → outbound=Tarom/8.4; no return set
#       (blank)                 → standard Tarom round-trip 8.4→21.4
#     seat col[9] special values:
#       contains 'הלוך' and 'אל על' → override outbound_airline='El Al', date=8.4
#       contains 'ב20.4'            → return_flight_date='2025-04-20'
#   El Al  (2 header rows; skiprows=2): [0]=heb_last [1]=heb_first
#          [8]=out_date [9]=out_airline [10]=out_time [11]=out_fnum [12]=out_booking
#          [13]=ret_date [14]=ret_airline [15]=ret_time [16]=ret_fnum [17]=ret_booking
#     'קבוצה' booking-ref rows → fallback to ELAL_* constants for date/time/fnum
#     Outbound date typo '8.4.24' in שטרן group → corrected to 2025-04-08
#   Not-flying (header row 0): [1]=heb_last [2]=heb_first → UPDATE guest.flying_with_us=0
#
# HISKY and Tarom flight numbers are unknown (not in spreadsheet) → stored as NULL.
# Matching: (strip_parens(heb_last).strip(), heb_first.strip()) → user_id in guest table.
# אדלר/אלחנן and אדלר(כהן)/נעמה are NOT in billing → expected not_found.

# ── Flights-specific name overrides ───────────────────────────────────────────
# Some names in the flights sheets differ from what was stored in the DB
# (DB hebrew_last_name = _strip_parens(guest-file raw_last)):
#   Key:   (last_in_flights_sheet, first_in_flights_sheet)
#   Value: (db_hebrew_last_name,   db_hebrew_first_name)
FLIGHTS_OVERRIDES = {
    # HISKY row 77: first name field contains last name by mistake (ISAK/יצחק)
    ('גרטנר', 'גרטנר'):     ('גרטנר', 'יצחק'),
    # ליינר/אלכסנדר in HISKY; guest file (and DB) has truncated form 'אלכסנר'
    ('ליינר', 'אלכסנדר'):   ('ליינר', 'אלכסנר'),
}

# ── Flight date / airline constants ───────────────────────────────────────────
# HISKY charter (dates confirmed from El Al sheet context; numbers unknown)
HISKY_OUTBOUND_DATE  = "2025-04-09"
HISKY_RETURN_DATE    = "2025-04-21"
HISKY_AIRLINE        = "HISKY"

# Tarom (dates inferred: note 'הלוך - 8.4 - אל על' implies Tarom outbound = 8.4)
# TODO: confirm exact Tarom dates with operator before running live
TAROM_OUTBOUND_DATE  = "2025-04-08"
TAROM_RETURN_DATE    = "2025-04-21"
TAROM_AIRLINE        = "Tarom"

# El Al — fallback constants for rows that only say 'קבוצה' (group booking)
ELAL_AIRLINE         = "אל על"
ELAL_OUTBOUND_DATE   = "2025-04-09"
ELAL_OUTBOUND_TIME   = "18:30"
ELAL_OUTBOUND_FNUM   = "LY571"
ELAL_RETURN_DATE     = "2025-04-21"
ELAL_RETURN_TIME     = "10:45"
ELAL_RETURN_FNUM     = "LY574"


def _parse_flight_date(val):
    """Parse 'D.M.YY' or 'D.M.YYYY' date strings from El Al sheet → 'YYYY-MM-DD'."""
    s = safe_str(val)
    if not s:
        return None
    m = re.match(r'^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$', s)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if y < 100:
            y += 2000
        if y == 2024:   # typo correction (e.g. '8.4.24' in שטרן group → 2025)
            y = 2025
        return f"{y:04d}-{mo:02d}-{d:02d}"
    return safe_date(val)


def _parse_flight_time(val):
    """Parse time value (datetime.time or '18:30:00' string) → 'HH:MM' or None."""
    if val is None:
        return None
    if hasattr(val, 'strftime'):
        return val.strftime('%H:%M')
    s = safe_str(val)
    if not s:
        return None
    m = re.match(r'^(\d{1,2}):(\d{2})', s)
    if m:
        return f"{int(m.group(1)):02d}:{m.group(2)}"
    return s[:5] if len(s) >= 5 else None


def _build_guest_lookup(conn):
    """Return dict: (stripped_heb_last, heb_first) → [user_id, ...] from guest table."""
    lookup = {}
    for (uid, hfn, hln) in db_query(
            conn, "SELECT user_id, hebrew_first_name, hebrew_last_name FROM guest"):
        key = (_strip_parens(hln or '').strip(), (hfn or '').strip())
        lookup.setdefault(key, []).append(uid)
    return lookup


def _resolve_guest(lookup, raw_last, heb_first):
    """
    Find user_id by (stripped_last, first) key in the guest table lookup.
    Resolution order:
      1. FLIGHTS_OVERRIDES  — explicit (last, first) → (db_last, db_first) redirect
      2. Direct key match   — (stripped_last, first) in lookup
      3. SUB_FAMILY_MAP fallback — guest file used billing name (e.g. 'וולגמוט')
         while flights sheet uses real surname (e.g. 'רוזנברג')
    Returns (user_id, label_str) or (None, reason_str).
    """
    stripped = _strip_parens(raw_last or '').strip()
    first    = (heb_first or '').strip()
    if not stripped and not first:
        return None, "empty name"

    # ── 1. FLIGHTS_OVERRIDES ──────────────────────────────────────────────────
    override = FLIGHTS_OVERRIDES.get((stripped, first))
    if override:
        db_last, db_first = override
        matches = lookup.get((db_last, db_first), [])
        if len(matches) == 1:
            return matches[0], f"{db_first} {db_last} (override)"
        if len(matches) > 1:
            print(f"    [WARN] override for ({stripped},{first}) → ambiguous ({len(matches)} matches); using first")
            return matches[0], f"{db_first} {db_last} (override/first-of-{len(matches)})"

    # ── 2. Direct key match ───────────────────────────────────────────────────
    matches = lookup.get((stripped, first), [])
    if len(matches) == 1:
        return matches[0], f"{first} {stripped}"
    if len(matches) > 1:
        # Warn and pick first — likely a DB duplicate from a prior bad import
        print(f"    [WARN] ambiguous: {len(matches)} guests named '{first} {stripped}'; using first match")
        return matches[0], f"{first} {stripped} (first-of-{len(matches)})"

    # ── 3. SUB_FAMILY_MAP fallback ────────────────────────────────────────────
    # Flights sheet may use a guest's real surname (e.g. 'רוזנברג') while the
    # guest import stored them under the billing family name ('וולגמוט').
    billing = SUB_FAMILY_MAP.get(stripped)
    if billing:
        if isinstance(billing, tuple):
            billing = billing[0]
        matches2 = lookup.get((billing, first), [])
        if len(matches2) == 1:
            return matches2[0], f"{first} {billing} (via SUB_FAMILY_MAP)"
        if len(matches2) > 1:
            print(f"    [WARN] SUB_FAMILY_MAP fallback: ambiguous ({len(matches2)} matches); using first")
            return matches2[0], f"{first} {billing} (via SUB_FAMILY_MAP/first-of-{len(matches2)})"

    return None, f"not found: '{first} {stripped}'"


def import_flights(conn, dry_run):
    print("\n=== Flights from טיסות.xlsx ===")
    xl = pd.ExcelFile(FILES["flights"])

    # ---- Build guest lookup ----
    guest_lookup = _build_guest_lookup(conn)
    print(f"  {len(guest_lookup)} unique (last, first) keys in guest table\n")

    ok        = []   # (sheet, raw_last, heb_first)
    not_found = []   # (sheet, raw_last, heb_first, reason)

    # ── Direct-assignment UPDATE (sets the value unconditionally) ─────────────
    def _upd(uid, fields, label):
        if not fields:
            return
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        params     = list(fields.values()) + [uid]
        db_exec(conn, f"UPDATE flights SET {set_clause} WHERE user_id = %s",
                params, dry_run, label)

    # ── COALESCE UPDATE (only fills NULL columns — won't overwrite existing) ──
    def _upd_coalesce(uid, fields, label):
        if not fields:
            return
        set_clause = ", ".join(f"{k} = COALESCE(%s, {k})" for k in fields)
        params     = list(fields.values()) + [uid]
        db_exec(conn, f"UPDATE flights SET {set_clause} WHERE user_id = %s",
                params, dry_run, label)

    # ─────────────────────────────────────────────────────────────────────────
    # Sheet 1: Tarom — processed FIRST so that מונסה חרמון (mixed-airline guests)
    # get their return_airline=Tarom set before HISKY runs.  Subsequent HISKY
    # COALESCE updates won't overwrite the already-set Tarom return fields.
    # ─────────────────────────────────────────────────────────────────────────
    print("  --- Sheet: הלוך -חזור טארום (Tarom) ---")
    df_t = xl.parse('הלוך -חזור טארום', header=0)
    df_t = df_t[df_t.iloc[:, 1].apply(lambda v: bool(safe_str(v)))]

    for _, row in df_t.iterrows():
        raw_last  = safe_str(row.iloc[1])
        heb_first = safe_str(row.iloc[2])
        dob       = safe_date(row.iloc[5]) if len(row) > 5 else None
        flag      = safe_str(row.iloc[7]) if len(row) > 7 else None   # special flight note
        seat      = safe_str(row.iloc[9]) if len(row) > 9 else None   # seat / misc note

        uid, reason = _resolve_guest(guest_lookup, raw_last, heb_first)
        if not uid:
            not_found.append(('Tarom', raw_last, heb_first, reason))
            continue

        # ── Determine outbound / return based on flag in col[7] ──────────────
        if flag and 'הייסקי' in flag:
            # מונסה חרמון pattern: they fly HISKY outbound, Tarom return
            out_airline, out_date = HISKY_AIRLINE, HISKY_OUTBOUND_DATE
            ret_airline, ret_date = TAROM_AIRLINE, TAROM_RETURN_DATE
            out_time = ret_time = out_fnum = ret_fnum = None
        elif flag and 'הלוך בלבד' in flag:
            # One-way outbound Tarom only; return not set (they arrange independently)
            out_airline, out_date = TAROM_AIRLINE, TAROM_OUTBOUND_DATE
            ret_airline = ret_date = out_time = ret_time = out_fnum = ret_fnum = None
        else:
            # Standard Tarom round-trip
            out_airline, out_date = TAROM_AIRLINE, TAROM_OUTBOUND_DATE
            ret_airline, ret_date = TAROM_AIRLINE, TAROM_RETURN_DATE
            out_time = ret_time = out_fnum = ret_fnum = None

        # ── Per-person overrides from seat/notes col[9] ───────────────────────
        # 'הלוך - 8.4 - אל על': this person's outbound is El Al on 8.4 (not Tarom)
        if seat and 'הלוך' in seat and 'אל על' in seat:
            out_airline = 'El Al'
            out_date    = '2025-04-08'
            seat        = None   # don't store "הלוך - 8.4 - אל על" as seat preference
        # 'חוזרת ב20.4': early return on April 20
        if seat and 'ב20.4' in seat:
            ret_date = '2025-04-20'
            seat     = None

        fields = {k: v for k, v in {
            'outbound_airline':       out_airline,
            'outbound_flight_date':   out_date,
            'outbound_flight_time':   out_time,
            'outbound_flight_number': out_fnum,
            'return_airline':         ret_airline,
            'return_flight_date':     ret_date,
            'return_flight_time':     ret_time,
            'return_flight_number':   ret_fnum,
        }.items() if v is not None}

        _upd(uid, fields,
             f"Tarom '{heb_first} {raw_last}' "
             f"out={out_airline}/{out_date} ret={ret_airline}/{ret_date}")

        if dob:
            _upd_coalesce(uid, {'birth_date': dob},
                          f"  DOB '{heb_first} {raw_last}' = {dob}")
        if seat:
            _upd_coalesce(uid, {'seat_preference': seat[:45]},
                          f"  seat '{heb_first} {raw_last}': {seat}")

        ok.append(('Tarom', raw_last, heb_first))

    # ─────────────────────────────────────────────────────────────────────────
    # Sheet 2: HISKY charter
    # Use COALESCE for all fields so that Tarom's pre-set return_airline for
    # מונסה חרמון (mixed-airline guests) is not overwritten.
    # ─────────────────────────────────────────────────────────────────────────
    print("  --- Sheet: הלוך - חזור (HISKY) ---")
    df_h = xl.parse('הלוך - חזור', header=0)
    df_h = df_h[df_h.iloc[:, 1].apply(lambda v: bool(safe_str(v)))]

    for _, row in df_h.iterrows():
        raw_last  = safe_str(row.iloc[1])
        heb_first = safe_str(row.iloc[2])
        dob       = safe_date(row.iloc[5]) if len(row) > 5 else None
        seat      = safe_str(row.iloc[7]) if len(row) > 7 else None

        uid, reason = _resolve_guest(guest_lookup, raw_last, heb_first)
        if not uid:
            not_found.append(('HISKY', raw_last, heb_first, reason))
            continue

        # COALESCE: preserves Tarom's return_airline for mixed-airline guests
        _upd_coalesce(uid, {
            'outbound_airline':     HISKY_AIRLINE,
            'outbound_flight_date': HISKY_OUTBOUND_DATE,
            'return_airline':       HISKY_AIRLINE,
            'return_flight_date':   HISKY_RETURN_DATE,
        }, f"HISKY '{heb_first} {raw_last}'")

        if dob:
            _upd_coalesce(uid, {'birth_date': dob},
                          f"  DOB '{heb_first} {raw_last}' = {dob}")
        if seat:
            _upd_coalesce(uid, {'seat_preference': seat[:45]},
                          f"  seat '{heb_first} {raw_last}': {seat}")

        ok.append(('HISKY', raw_last, heb_first))

    # ─────────────────────────────────────────────────────────────────────────
    # Sheet 3: El Al — full data per row; 2-row header (skiprows=2)
    # ─────────────────────────────────────────────────────────────────────────
    print("  --- Sheet: אל על שטרן והררי (El Al) ---")
    df_e = xl.parse('אל על שטרן והררי', header=None, skiprows=2)

    for _, row in df_e.iterrows():
        raw_last  = safe_str(row.iloc[0])
        heb_first = safe_str(row.iloc[1])
        if not raw_last:
            continue   # blank spacer rows at bottom of sheet
        if not heb_first:
            continue   # הררי rows with no first name (rows 53-54) — can't identify

        dob         = safe_date(row.iloc[6])     if len(row) > 6  else None
        out_date_raw= _parse_flight_date(row.iloc[8])  if len(row) > 8  else None
        out_airline = safe_str(row.iloc[9])      if len(row) > 9  else None
        out_time    = _parse_flight_time(row.iloc[10]) if len(row) > 10 else None
        out_fnum    = safe_str(row.iloc[11])     if len(row) > 11 else None
        booking_out = safe_str(row.iloc[12])     if len(row) > 12 else None
        ret_date_raw= _parse_flight_date(row.iloc[13]) if len(row) > 13 else None
        ret_airline = safe_str(row.iloc[14])     if len(row) > 14 else None
        ret_time    = _parse_flight_time(row.iloc[15]) if len(row) > 15 else None
        ret_fnum    = safe_str(row.iloc[16])     if len(row) > 16 else None
        booking_ret = safe_str(row.iloc[17])     if len(row) > 17 else None

        # Use real booking ref (not 'קבוצה' placeholder)
        booking_ref = None
        if booking_out and booking_out.strip() not in ('קבוצה', ''):
            booking_ref = booking_out.strip()
        elif booking_ret and booking_ret.strip() not in ('קבוצה', ''):
            booking_ref = booking_ret.strip()

        # Fallback to group constants for 'קבוצה' rows (no date/time/fnum in cell)
        out_date    = out_date_raw  or ELAL_OUTBOUND_DATE
        out_time    = out_time      or ELAL_OUTBOUND_TIME
        out_fnum    = out_fnum      or ELAL_OUTBOUND_FNUM
        ret_date    = ret_date_raw  or ELAL_RETURN_DATE
        ret_time    = ret_time      or ELAL_RETURN_TIME
        ret_fnum    = ret_fnum      or ELAL_RETURN_FNUM
        out_airline = (out_airline or '').strip() or ELAL_AIRLINE
        ret_airline = (ret_airline or '').strip() or ELAL_AIRLINE

        uid, reason = _resolve_guest(guest_lookup, raw_last, heb_first)
        if not uid:
            not_found.append(('El Al', raw_last, heb_first, reason))
            continue

        fields = {
            'outbound_airline':       out_airline,
            'outbound_flight_date':   out_date,
            'outbound_flight_time':   out_time,
            'outbound_flight_number': out_fnum,
            'return_airline':         ret_airline,
            'return_flight_date':     ret_date,
            'return_flight_time':     ret_time,
            'return_flight_number':   ret_fnum,
        }
        if booking_ref:
            fields['booking_reference'] = booking_ref

        _upd(uid, fields,
             f"El Al '{heb_first} {raw_last}' out={out_date} {out_fnum} ref={booking_ref}")

        if dob:
            _upd_coalesce(uid, {'birth_date': dob},
                          f"  DOB '{heb_first} {raw_last}' = {dob}")

        ok.append(('El Al', raw_last, heb_first))

    # ─────────────────────────────────────────────────────────────────────────
    # Sheet 4: Not flying — set flying_with_us=0 on guest row
    # (guest step already sets this from col[10]='X'; this is a safety re-pass)
    # ─────────────────────────────────────────────────────────────────────────
    print("  --- Sheet: לא טסים איתנו ---")
    df_nf = xl.parse('לא טסים איתנו', header=0)
    df_nf = df_nf[df_nf.iloc[:, 1].apply(lambda v: bool(safe_str(v)))]

    for _, row in df_nf.iterrows():
        raw_last  = safe_str(row.iloc[1])
        heb_first = safe_str(row.iloc[2])

        uid, reason = _resolve_guest(guest_lookup, raw_last, heb_first)
        if not uid:
            not_found.append(('not_flying', raw_last, heb_first, reason))
            continue

        db_exec(conn,
                "UPDATE guest SET flying_with_us = 0 WHERE user_id = %s",
                (uid,), dry_run,
                f"not_flying '{heb_first} {raw_last}' → flying_with_us=0")
        ok.append(('not_flying', raw_last, heb_first))

    # ── Report ────────────────────────────────────────────────────────────────
    by_sheet = {}
    for sheet, *_ in ok:
        by_sheet[sheet] = by_sheet.get(sheet, 0) + 1

    print(f"\n{'='*60}")
    print(f"  ROWS PROCESSED:  {len(ok)}")
    for sheet, cnt in sorted(by_sheet.items()):
        print(f"    {sheet:<15} {cnt}")
    print(f"  NOT FOUND:       {len(not_found)}")
    print(f"{'='*60}")

    if not_found:
        print(f"\n  --- Not found / skipped ({len(not_found)}) ---")
        for sheet, ln, fn, reason in not_found:
            print(f"    [{sheet}] {fn or ''} {ln or ''}: {reason}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Import Pesach 2025 Excel data")
    parser.add_argument("--vacation-id", required=True,
                        help="Vacation UUID with underscores (e.g. 7ede9a79_2fe8_4ac1_b0a7_978647f1cf94)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Read from DB and print what would happen, but write nothing")
    parser.add_argument("--steps", default="families",
                        help="Comma-separated: families,guests,flights  (default: families)")
    args = parser.parse_args()

    steps = [s.strip() for s in args.steps.split(",")]

    print(f"\nImport Pesach 2025 -> trip_tracker_{args.vacation_id}")
    print(f"Mode:  {'DRY RUN (no writes)' if args.dry_run else 'LIVE'}")
    print(f"Steps: {steps}")
    print(f"Dates: {PESACH_START} → {PESACH_END}")

    # Verify Excel files exist
    for key in steps:
        path = FILES.get(key)
        if path and not os.path.exists(path):
            print(f"ERROR: File not found: {path}")
            sys.exit(1)

    conn = connect(args.vacation_id)
    try:
        if "families" in steps:
            import_families(conn, args.dry_run)

        if "guests" in steps:
            import_guests(conn, args.dry_run)

        if "flights" in steps:
            import_flights(conn, args.dry_run)

        if not args.dry_run:
            conn.commit()
            print("\nCommitted to database.")
    except Exception as e:
        conn.rollback()
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        conn.close()

    print("\nDone.")

if __name__ == "__main__":
    main()
