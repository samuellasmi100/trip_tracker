"""
import_excel_pesach24.py
=======================
One-time import of Pesach 2024 Excel data into trip_tracker_{vacationId}.

Usage:
    python scripts/import_excel_pesach24.py --vacation-id <id> [--dry-run] [--steps <steps>]

Steps (run in order):
    families   - Create families + room assignments from כללי נרשמים.xlsx  (safe to re-run)
    guests     - Import guests + flights from כלל האורחים.xlsx
    flights    - Enrich flight data from טיסות כללי.xlsx (booking refs, independent fliers)
    staff      - Import staff from צוות.xlsx
    vehicles   - Import vehicles from רכבים.xlsx

Default: families only (wait for approval before adding more steps)

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

BASE_FOLDER = r"C:\Users\Shmuel\Downloads\אבימור 24 פסח\אבימור פסח 24\נרשמים"

FILES = {
    "families": os.path.join(BASE_FOLDER, "כללי נרשמים.xlsx"),
    "guests":   os.path.join(BASE_FOLDER, "כלל האורחים.xlsx"),
    "rooms":    os.path.join(BASE_FOLDER, "חדרים.xlsx"),
    "staff":    os.path.join(BASE_FOLDER, "צוות.xlsx"),
    "vehicles": os.path.join(BASE_FOLDER, "רכבים.xlsx"),
    "flights":  r"C:\Users\Shmuel\Downloads\אבימור 24 פסח\אבימור פסח 24\טיסות\טיסות כללי.xlsx",
}

PESACH_START = "2024-04-10"
PESACH_END   = "2024-05-02"

# ── Non-room tokens in the room column ────────────────────────────────────────
# These appear where a room number is expected but are NOT hotel room IDs.
NON_ROOM_TOKENS  = {'קסה'}           # External location (e.g. staff cash office)
UNASSIGNED_TOKENS = {'0', 'x', 'X'}  # Placeholder meaning "not yet assigned"

# ── Guest-file spelling → billing-file spelling ────────────────────────────────
SPELLING_ALIASES = {
    'שטיינבוך': 'שטרנבוך',
    'טואבמן':   'טאובמן',
    'הלוי':     'הלוי מלק',   # guest file uses short form; billing name is הלוי מלק
}

# ── Guest last name → billing parent family name ───────────────────────────────
# Value is either a string (unique target) or a tuple (family_name, male_head_hint)
# when the target family name is shared by multiple billing entries.
SUB_FAMILY_MAP = {
    # Previously confirmed
    'בק':               'קליין',
    'קריסטל':           'מסר',         # billing family is מסר (not יוסי)
    'בן חיים':          'אמונה',
    'הדרי שלוסברג':     'שלוסברג',
    'לרנר':             'שטרן',
    'יעקובזון':         'שטרן',
    'עציון':            'רייס',
    'עציון רייס':       'רייס',
    'גרין':             'רייס',
    'גרין רייס':        'רייס',
    'זוהר':             'זוהר דיאמנט',
    # Confirmed from block analysis
    'חדד':              'שלוסברג',   # plain חדד (without parens) also maps to שלוסברג
    'בייטלר':           'שטרן',
    'שרעבי':            ('הררי', 'מרקו'),    # inside הררי מרקו/שנטל block
    'חמבי':             'הרשמן',
    'פסקר':             'הרשמן',
    'ליברטי':           'בן מנחם',
    'הרשטיק':           'שור',
    'וואננוביץ':        'שור',
    # NOTE: פירר removed — דב פירר is head of his OWN billing family (billing row 24)
    'הרמן':             'פירר',          # row 137: immediately after פירר billing family row
    # New mappings from skipped-guest analysis
    'פרידמן':           'לודמיר',        # row 93: immediately after לודמיר ברוך (user confirmed)
    'ברנשטיין':         'ליינר',         # row 174: ביאנקה is female_head of ליינר billing family
    'קוקבקה':           'הלל',           # row 300: billing family הלל; guest first-name = הלל
    'שלוש':             'קוסאי',         # row 307: billing family קוסאי; guest first-name = קוסאי
    'טבאל':             'מאיר טבאל',     # row 330: billing family compound-name מאיר טבאל
}

# ── Per-individual overrides for ambiguous same-name families ──────────────────
# Key: (raw_last_name, hebrew_first_name)  →  (billing_family_name, head_hint_or_None)
# head_hint is matched against male_head OR female_head of the billing entry.
INDIVIDUAL_OVERRIDES = {
    # הררי: שלום בנימין is the head of the second הררי family, not the main group
    ('הררי', 'שלום בנימין'): ('הררי', 'שלום בנימין'),
    # לוי ציפי group (rows 152-153) — ציפי is female_head in billing
    ('לוי', 'יהונתן'):       ('לוי', 'ציפי'),
    ('לוי', 'צפורה פייגל'):  ('לוי', 'ציפי'),
    # אביעד לוי group (rows 309-311) — billing family name is "אביעד לוי"
    ('לוי', 'אביעד'):        ('אביעד לוי', None),
    ('לוי (פימה)', 'נעמי'):  ('אביעד לוי', None),
    ('לוי', 'ינון'):         ('אביעד לוי', None),
    # אונגר: first group (מאיר אליהו + רבקה הדסה) → אונגר רבקה
    # Row order: מאיר אליהו comes before רבקה הדסה so no block-context yet
    ('אונגר', 'מאיר אליהו'): ('אונגר', 'רבקה'),
    # תהילה: first group (יאיר + מיכל דזי) → תהילה מיכל
    # Row order: יאיר comes before מיכל דזי so no block-context yet
    ('תהילה', 'יאיר'):       ('תהילה', 'מיכל'),
    # תהילה: second group (עמנואל + בלהה) → the תהילה with NO head data
    # Empty-string head hint = pick the family entry with no male/female head
    ('תהילה', 'עמנואל'):     ('תהילה', ''),
    ('תהילה', 'בלהה'):       ('תהילה', ''),
    # פוגלר: first person in the file (דוד) comes before עידית who would set context
    ('פוגלר', 'דוד'):        ('פוגלר', 'עידית'),
    # רוט: first group — one member, לוציה; billing head is "אמא אברימי"
    ('רוט', 'לוציה'):        ('רוט', 'אמא אברימי'),
    # רוט: second group — no head data in billing; empty hint picks the headless family
    ('רוט', 'אברהם מרדכי'):  ('רוט', ''),
    ('רוט', 'רבקה'):         ('רוט', ''),
    ('רוט', 'שירה רחל'):     ('רוט', ''),
    ('רוט', 'אהרון משה'):    ('רוט', ''),
}

# ── Ambiguity fallback: when a name has multiple families and no other hint ────
# Most direct-named guests (e.g. הררי) go to the larger/primary family.
AMBIGUITY_PREFER = {
    'הררי': 'מרקו',    # default: הררי guests → הררי מרקו/שנטל (13-person family)
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

    Rule: the first token is the full room number.  Each subsequent token
    replaces the *last N digits* of the base number, where N = len(token).

    Examples:
        "412 13 14 15"  ->  ["412", "413", "414", "415"]
        "305 6 7 8"     ->  ["305", "306", "307", "308"]
        "101"           ->  ["101"]
        "101, 202"      ->  ["101", "202"]  (both are full numbers)

    If a subsequent token is longer than or equal to the base, it is treated
    as a new full room number and becomes the new base.
    """
    if not raw:
        return []
    tokens = [t.strip() for t in re.split(r'[,;]+', raw)]   # split on comma/semicolon first
    result = []
    for token_group in tokens:
        parts = token_group.split()   # split on whitespace within each comma-group
        if not parts:
            continue
        base = parts[0]
        if re.match(r'^\d+$', base):
            result.append(base)
        else:
            result.append(base)   # non-numeric, add as-is for skip handling
            continue
        for part in parts[1:]:
            if not re.match(r'^\d+$', part):
                result.append(part)   # non-numeric, add as-is
                continue
            if len(part) >= len(base):
                # Full room number — new base
                result.append(part)
                base = part
            else:
                # Shorthand: replace last len(part) digits of base
                expanded = base[:len(base) - len(part)] + part
                result.append(expanded)
                # base stays the same (412 stays base for 412,413,414,415)
    return result

# ── Families + Room assignments from כללי נרשמים ──────────────────────────────

def _get_red_family_names(path):
    """
    Use openpyxl to detect red-highlighted rows in גיליון1.
    Returns a set of family names (col C, 0-indexed col 2) whose row has a red fill.
    Red fill: RGB where R > 150 and R > G+30 and R > B+30.
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
    ws = wb["גיליון1"]
    red_names = set()
    for row in ws.iter_rows():
        if row[0].row == 1:   # header row
            continue
        family_cell = row[2] if len(row) > 2 else None
        if not family_cell or not family_cell.value:
            continue
        if any(_is_red(c) for c in row):
            red_names.add(str(family_cell.value).strip())
    wb.close()
    return red_names


def import_families(conn, dry_run):
    print("\n=== Families from כללי נרשמים.xlsx ===")

    # ---- Detect red (cancelled) rows via openpyxl BEFORE pandas ----
    red_family_names = _get_red_family_names(FILES["families"])
    print(f"\n  Red-highlighted (cancelled) families to skip: {sorted(red_family_names)}")

    xl = pd.ExcelFile(FILES["families"])

    # ---- Diagnose headers ----
    df_head = xl.parse("גיליון1", header=0, nrows=2)
    print("\n  Column map (header | first-data-row sample):")
    for i, col in enumerate(df_head.columns):
        sample = safe_str(df_head.iloc[0, i]) if len(df_head) > 0 else "-"
        print(f"    col[{i:2d}]  '{col}'  |  '{sample}'")

    # ---- Parse main sheet (row-0 = header, row-1 = first data row = רייס) ----
    df = xl.parse("גיליון1", header=0)
    df = df[df.iloc[:, 2].apply(lambda v: bool(safe_str(v)))]
    print(f"\n  {len(df)} data rows in גיליון1 (before red filter)")

    # ---- Voucher / special-requests sheet ----
    extras = {}
    try:
        df2 = xl.parse("טפסי לקוחות", header=1)
        for _, row in df2.iterrows():
            fname = safe_str(row.iloc[0], 100)
            if not fname:
                continue
            voucher = safe_str(row.iloc[5], 20)   if len(row) > 5  else None
            notes   = safe_str(row.iloc[11], None) if len(row) > 11 else None
            if fname not in extras or voucher or notes:
                extras[fname] = {"voucher": voucher, "notes": notes}
        print(f"  {len(extras)} rows in 'טפסי לקוחות'")
    except Exception as e:
        print(f"  Warning: could not read 'טפסי לקוחות': {e}")

    # ---- Load valid room IDs from DB ----
    cur = conn.cursor()
    cur.execute("SELECT rooms_id FROM rooms")
    valid_rooms = {str(r[0]).strip() for r in cur.fetchall()}
    cur.close()
    sample_rooms = sorted(valid_rooms)[:8]
    print(f"  {len(valid_rooms)} valid room IDs in DB (sample: {sample_rooms})")

    # ---- Load existing families: (name, male_head, female_head) -> family_id ----
    # Using a composite key so same-surname families (e.g. two הררי) are distinct.
    cur = conn.cursor()
    cur.execute("SELECT family_name, family_id, male_head, female_head FROM families")
    family_id_map = {}
    for fname_db, fid, mh, fh in cur.fetchall():
        key = (fname_db.strip(), (mh or '').strip(), (fh or '').strip())
        family_id_map[key] = fid
    cur.close()
    print(f"  {len(family_id_map)} families already in DB\n")

    # ── tracking ──────────────────────────────────────────────────────────────
    created       = []   # (fname, fid)
    updated       = []   # (fname, fid)
    skipped_fam   = []   # (fname, reason)
    rooms_ok      = []   # (fname, room_id)
    rooms_skipped = []   # (fname, raw, reason)

    for _, row in df.iterrows():
        fname = safe_str(row.iloc[2], 45)
        if not fname:
            continue

        # ── Skip red-highlighted (cancelled) rows ──────────────────────────────
        if fname in red_family_names:
            skipped_fam.append((fname, "RED HIGHLIGHT — cancelled/not attending"))
            continue

        # ── Parse all fields up-front (needed for skip messages too) ──────────
        male_head  = safe_str(row.iloc[3], 45)       if len(row) > 3  else None
        female_head= safe_str(row.iloc[4], 45)       if len(row) > 4  else None
        total_pax  = safe_int(row.iloc[5])           if len(row) > 5  else None
        pax_out    = safe_str(safe_int(row.iloc[6]),  10) if len(row) > 6  else None
        pax_ret    = safe_str(safe_int(row.iloc[7]),  10) if len(row) > 7  else None
        babies     = safe_str(safe_int(row.iloc[8]),  10) if len(row) > 8  else None
        num_rooms  = safe_str(safe_int(row.iloc[9]),  45) if len(row) > 9  else None
        num_suites = safe_str(safe_int(row.iloc[10]), 10) if len(row) > 10 else None
        room_raw   = safe_str(row.iloc[11])          if len(row) > 11 else None
        total_nis  = safe_str(row.iloc[13], 45)      if len(row) > 13 else None
        total_eur  = safe_str(row.iloc[14], 45)      if len(row) > 14 else None
        # number_of_guests = total passengers (col 5), fall back to pax_out
        num_guests = safe_str(total_pax, 45) if total_pax else pax_out

        # ── Skip cancellations: negative NIS or EUR amount ────────────────────
        if is_negative_amount(total_nis) or is_negative_amount(total_eur):
            skipped_fam.append((fname,
                f"NEGATIVE AMOUNT — NIS={total_nis}, EUR={total_eur} (cancellation?)"))
            continue          # do NOT block later rows with the same name

        ext     = extras.get(fname, {})
        voucher = ext.get("voucher")
        notes   = ext.get("notes")

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
                  voucher_number         = COALESCE(%s, voucher_number),
                  special_requests       = COALESCE(%s, special_requests)
                WHERE family_id = %s
            """
            db_exec(conn, sql_upd,
                    (male_head, female_head,
                     num_guests, num_rooms, num_suites, pax_out, pax_ret, babies,
                     total_nis, total_eur, voucher, notes, family_id),
                    dry_run,
                    f"UPDATE '{fname}' ({male_head}/{female_head}) | guests={num_guests} | NIS={total_nis}")
            updated.append((fname, family_id))
        else:
            family_id = new_uuid()
            sql_ins = """
                INSERT INTO families
                  (family_id, family_name, male_head, female_head,
                   number_of_guests, number_of_rooms, number_of_suites,
                   number_of_pax_outbound, number_of_pax_return, number_of_babies,
                   total_amount, total_amount_eur, voucher_number, special_requests,
                   doc_token)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,UUID())
            """
            db_exec(conn, sql_ins,
                    (family_id, fname, male_head, female_head,
                     num_guests, num_rooms, num_suites,
                     pax_out, pax_ret, babies,
                     total_nis, total_eur, voucher, notes),
                    dry_run,
                    f"INSERT '{fname}' ({male_head}/{female_head}) | guests={num_guests} | NIS={total_nis}")
            family_id_map[key] = family_id   # register so re-encountering same key UPDATEs
            created.append((fname, family_id))

        # ── Room assignment ───────────────────────────────────────────────────
        if not room_raw:
            continue

        expanded = expand_rooms(room_raw)
        # Always print room expansion so user can verify
        print(f"  ROOMS  '{fname}': raw='{room_raw}' => {expanded}")

        for tok in expanded:
            tok = tok.strip()
            # ── Non-room location (e.g. קסה = external site) → store as note ──
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
        print(f"    + {fname:<30}  rooms: {', '.join(room_ids) or '(none)'}")

    if updated:
        print(f"\n  --- Updated ({len(updated)}) ---")
        for fname, _ in updated:
            room_ids = [r for f, r in rooms_ok if f == fname]
            print(f"    ~ {fname:<30}  rooms: {', '.join(room_ids) or '(none)'}")

    if skipped_fam:
        print(f"\n  --- Skipped families ({len(skipped_fam)}) ---")
        for fname, reason in skipped_fam:
            print(f"    - {fname}: {reason}")

    if rooms_skipped:
        print(f"\n  --- Skipped room assignments ({len(rooms_skipped)}) ---")
        for fname, raw, reason in rooms_skipped:
            print(f"    - {fname}: raw='{raw}' => {reason}")

# ── Guests + Flights from כלל האורחים ─────────────────────────────────────────

def _strip_parens(s):
    """Remove (parenthetical) suffix. 'קליין (גנוט)' → 'קליין'."""
    return re.sub(r'\s*\(.*?\)\s*', '', s).strip()

def _extract_parens(s):
    """Return content inside first parens, or None."""
    m = re.search(r'\((.+?)\)', s)
    return m.group(1).strip() if m else None

def _pick_family_by_head(families, head_hint):
    """
    From a list of (family_id, male_head, female_head) pick a matching family.

    head_hint == None  → no-op, return None
    head_hint == ''    → pick the family that has NO male_head AND NO female_head
    head_hint == <str> → pick the family where head_hint is a substring of
                         male_head/female_head OR vice-versa (handles compound
                         names like 'רבקה הדסה' matching billing 'רבקה')
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

    Resolution order:
      1. INDIVIDUAL_OVERRIDES — per-(last, first) hard overrides
      2. Parens content       — explicit billing parent ('לרנר (שטרן)' → שטרן)
      3. Spelling alias       — corrected spelling of base name
      4. SUB_FAMILY_MAP       — billing parent (supports tuple head-hints)
      5. Exact match in DB
    When multiple families share the resolved name:
      a. head_hint from SUB_FAMILY_MAP tuple
      b. guest's first name matches a billing head
      c. block_ctx  — family established by a recent row in the same block
      d. AMBIGUITY_PREFER fallback
    block_ctx is mutated: when we successfully pick a family for an ambiguous name
    by head-matching, we store it so subsequent rows in the same block inherit it.

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
            return fams[0][0], override_name
        fid = _pick_family_by_head(fams, override_head)
        if fid:
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

    # ── 4. Sub-family map (supports tuple head-hints) ────────────────────────
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

    # ── Multiple families — disambiguation ───────────────────────────────────
    # a. head_hint from SUB_FAMILY_MAP tuple
    if head_hint:
        fid = _pick_family_by_head(fams, head_hint)
        if fid:
            return fid, canonical

    # b. guest's first name matches a billing head → establishes block context
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


def import_guests(conn, dry_run):
    print("\n=== Guests from כלל האורחים.xlsx ===")
    xl = pd.ExcelFile(FILES["guests"])
    sheet_name = "כליי שיוך לטיסות מעודכן 14.3.24"

    # ---- Diagnose headers ----
    # NOTE: This sheet has ONE header row only. header=0 is correct.
    # header=1 was wrong — it consumed צפורה רייס (first data row) as column names.
    df_head = xl.parse(sheet_name, header=0, nrows=2)
    print("\n  Column map (header | first-data-row sample):")
    for i, col in enumerate(df_head.columns):
        sample = safe_str(df_head.iloc[0, i]) if len(df_head) > 0 else "-"
        print(f"    col[{i:2d}]  '{col}'  |  '{sample}'")

    # ---- Parse guest sheet (ONE header row → header=0) ----
    df = xl.parse(sheet_name, header=0)
    df = df[df.iloc[:, 1].apply(lambda v: bool(safe_str(v)))]
    print(f"\n  {len(df)} data rows in '{sheet_name}'")

    # ---- Load seat preferences from גיליון7 ----
    # Columns: [0]=last_name, [1]=first_name, [4]=seat_preference
    seat_map = {}
    try:
        df7 = xl.parse("גיליון7", header=0)
        for _, row7 in df7.iterrows():
            ln = safe_str(row7.iloc[0])
            fn = safe_str(row7.iloc[1])
            sp = safe_str(row7.iloc[4]) if len(row7) > 4 else None
            if ln and fn and sp:
                seat_map[(ln.strip(), fn.strip())] = sp
        print(f"  {len(seat_map)} seat preferences loaded from גיליון7")
    except Exception as e:
        print(f"  Warning: could not read גיליון7: {e}")

    # ---- Load families from DB: name → [(family_id, male_head, female_head), ...] ----
    # Store head names so disambiguation can match guest's first name against billing head.
    name_to_families = {}
    for (fname_db, fid, mh, fh) in db_query(
            conn, "SELECT family_name, family_id, male_head, female_head FROM families"):
        name_to_families.setdefault(fname_db.strip(), []).append(
            (fid, (mh or '').strip(), (fh or '').strip()))
    print(f"  {len(name_to_families)} unique family names in DB\n")

    # ---- Load existing guests for idempotency ----
    # Key: (family_id, heb_first, heb_last) → user_id
    existing_guests = {}
    for (fid, hfn, hln, uid) in db_query(
            conn, "SELECT family_id, hebrew_first_name, hebrew_last_name, user_id FROM guest"):
        key = (fid, (hfn or '').strip(), (hln or '').strip())
        existing_guests[key] = uid

    # ── tracking ──────────────────────────────────────────────────────────────
    created   = []   # (raw_last, heb_first)
    updated   = []   # (raw_last, heb_first)
    skipped   = []   # (raw_last, heb_first, reason)
    block_ctx = {}   # canonical_name → family_id (updated as we walk rows)

    for _, row in df.iterrows():
        raw_last  = safe_str(row.iloc[1], 45)
        heb_first = safe_str(row.iloc[2], 45)
        eng_last  = safe_str(row.iloc[3], 45)
        eng_first = safe_str(row.iloc[4], 45)
        passport  = safe_str(row.iloc[5], 45)
        validity  = safe_str(row.iloc[6], 45)
        birth_dt  = safe_date(row.iloc[7])          if len(row) > 7  else None
        id_num    = safe_str(row.iloc[8], 45)        if len(row) > 8  else None
        age_val   = safe_str(safe_int(row.iloc[9]), 45) if len(row) > 9  else None
        out_date  = safe_date(row.iloc[10])          if len(row) > 10 else None
        out_airl  = safe_str(row.iloc[11], 45)       if len(row) > 11 else None
        out_fnum  = safe_str(row.iloc[12], 45)       if len(row) > 12 else None
        out_time  = safe_str(row.iloc[13], 10)       if len(row) > 13 else None
        ret_date  = safe_date(row.iloc[14])          if len(row) > 14 else None
        ret_airl  = safe_str(row.iloc[15], 45)       if len(row) > 15 else None
        ret_fnum  = safe_str(row.iloc[16], 45)       if len(row) > 16 else None
        ret_time  = safe_str(row.iloc[17], 10)       if len(row) > 17 else None

        if not raw_last:
            continue

        heb_last = _strip_parens(raw_last)

        # ── Seat preference lookup ───────────────────────────────────────────
        seat = (seat_map.get((heb_last, heb_first or '')) or
                seat_map.get((raw_last, heb_first or '')))

        # ── Resolve family ───────────────────────────────────────────────────
        family_id, resolve_result = _resolve_family(
            raw_last, name_to_families, heb_first=heb_first, block_ctx=block_ctx)

        if not family_id:
            skipped.append((raw_last, heb_first, resolve_result))
            continue

        # ── Idempotency check ────────────────────────────────────────────────
        guest_key = (family_id, heb_first or '', heb_last or '')
        existing_uid = existing_guests.get(guest_key)

        if existing_uid:
            # UPDATE existing guest
            db_exec(conn, """
                UPDATE guest SET
                  english_first_name = COALESCE(%s, english_first_name),
                  english_last_name  = COALESCE(%s, english_last_name),
                  identity_id        = COALESCE(%s, identity_id),
                  age                = COALESCE(%s, age),
                  birth_date         = COALESCE(%s, birth_date)
                WHERE user_id = %s
            """, (eng_first, eng_last, id_num, age_val, birth_dt, existing_uid),
            dry_run, f"UPDATE guest '{heb_first} {heb_last}'")

            # UPDATE existing flights row
            db_exec(conn, """
                UPDATE flights SET
                  passport_number        = COALESCE(%s, passport_number),
                  validity_passport      = COALESCE(%s, validity_passport),
                  birth_date             = COALESCE(%s, birth_date),
                  age                    = COALESCE(%s, age),
                  outbound_flight_date   = COALESCE(%s, outbound_flight_date),
                  outbound_airline       = COALESCE(%s, outbound_airline),
                  outbound_flight_number = COALESCE(%s, outbound_flight_number),
                  outbound_flight_time   = COALESCE(%s, outbound_flight_time),
                  return_flight_date     = COALESCE(%s, return_flight_date),
                  return_airline         = COALESCE(%s, return_airline),
                  return_flight_number   = COALESCE(%s, return_flight_number),
                  return_flight_time     = COALESCE(%s, return_flight_time),
                  seat_preference        = COALESCE(%s, seat_preference)
                WHERE user_id = %s
            """, (passport, validity, birth_dt, age_val,
                  out_date, out_airl, out_fnum, out_time,
                  ret_date, ret_airl, ret_fnum, ret_time,
                  seat, existing_uid),
            dry_run, f"  UPDATE flights for '{heb_first} {heb_last}'")
            updated.append((raw_last, heb_first))
        else:
            # INSERT new guest
            user_id = new_uuid()
            db_exec(conn, """
                INSERT INTO guest
                  (user_id, family_id, hebrew_first_name, hebrew_last_name,
                   english_first_name, english_last_name,
                   identity_id, age, birth_date,
                   is_main_user, flying_with_us)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,0,1)
            """, (user_id, family_id, heb_first, heb_last,
                  eng_first, eng_last, id_num, age_val, birth_dt),
            dry_run, f"INSERT guest '{heb_first} {heb_last}' -> family '{resolve_result}'")

            # INSERT flights row linked to same user_id
            db_exec(conn, """
                INSERT INTO flights
                  (user_id, family_id,
                   passport_number, validity_passport, birth_date, age,
                   outbound_flight_date, outbound_airline,
                   outbound_flight_number, outbound_flight_time,
                   return_flight_date, return_airline,
                   return_flight_number, return_flight_time,
                   seat_preference, is_source_user)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,0)
            """, (user_id, family_id,
                  passport, validity, birth_dt, age_val,
                  out_date, out_airl, out_fnum, out_time,
                  ret_date, ret_airl, ret_fnum, ret_time,
                  seat),
            dry_run, f"  INSERT flights for '{heb_first} {heb_last}'")

            existing_guests[guest_key] = user_id
            created.append((raw_last, heb_first))

    # ── Report ────────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  GUESTS CREATED:  {len(created)}")
    print(f"  GUESTS UPDATED:  {len(updated)}")
    print(f"  GUESTS SKIPPED:  {len(skipped)}")
    print(f"{'='*60}")

    if skipped:
        print(f"\n  --- Skipped guests ({len(skipped)}) ---")
        for raw_ln, fn, reason in skipped:
            print(f"    - {fn or ''} {raw_ln}: {reason}")


# ── Flights from טיסות כללי.xlsx ─────────────────────────────────────────────
#
# Two sheets processed:
#
#  'טיסות נוספות'  (93 rows, col[1]=heb_last, col[2]=heb_first)
#     Passengers who flew on scheduled/non-charter flights or on different dates
#     from the main group.  Has actual flight numbers, outbound dates, and —
#     most importantly — booking/PNR codes in col[19].
#     col layout: [10]=out_date [11]=out_airline [12]=out_fnum [13]=out_time
#                 [14]=מי קנה (skip)
#                 [15]=ret_date [16]=ret_airline [17]=ret_fnum [18]=ret_time
#                 [19]=booking_reference
#
#  'טסים באופן עצמאי'  (28 rows, col[0]=heb_last, col[1]=heb_first)
#     Passengers who arranged their own flights.
#     col layout: same as above but shifted left by 1.
#     X in any flight column = "unknown / not booked through us".
#     ALL flight columns X + note about driving → set guest.flying_with_us = 0.
#     Return cols all X → one-way (no return flight through us).
#
# Matching: passport_number first (most reliable); fallback to (heb_last, heb_first).
# Only UPDATEs existing records — never creates new guests.

def import_flights(conn, dry_run):
    print("\n=== Flights from טיסות כללי.xlsx ===")
    xl = pd.ExcelFile(FILES["flights"])

    # ── Build lookup: passport → (user_id, family_id)  +  name → list of user_ids
    passport_map = {}   # passport_number  → user_id
    name_map     = {}   # (heb_last, heb_first) → [user_id, ...]
    for (uid, passport, hln, hfn) in db_query(
            conn,
            """SELECT g.user_id, f.passport_number,
                      g.hebrew_last_name, g.hebrew_first_name
               FROM guest g
               LEFT JOIN flights f ON g.user_id = f.user_id"""):
        if passport:
            passport_map[str(passport).strip()] = uid
        key = ((hln or '').strip(), (hfn or '').strip())
        name_map.setdefault(key, []).append(uid)

    print(f"  {len(passport_map)} guests with passport in DB, {len(name_map)} name entries")

    updated_flights  = []
    updated_status   = []   # flying_with_us changes
    skipped          = []

    def _find_uid(raw_last, heb_first, passport):
        """Return user_id by passport (preferred) or name fallback."""
        if passport:
            uid = passport_map.get(str(passport).strip())
            if uid:
                return uid, 'passport'
        hl = _strip_parens(safe_str(raw_last) or '').strip()
        hf = (safe_str(heb_first) or '').strip()
        hits = name_map.get((hl, hf), [])
        if len(hits) == 1:
            return hits[0], 'name'
        if len(hits) > 1:
            return None, f"ambiguous name '{hl} {hf}' ({len(hits)} matches)"
        return None, f"not found: '{hl} {hf}'"

    def _is_x(val):
        """Return True if val is an 'X' placeholder (no data)."""
        s = safe_str(val)
        return s in ('X', 'x', 'None', '')

    def _update_flight(uid, out_date, out_airl, out_fnum, out_time,
                       ret_date, ret_airl, ret_fnum, ret_time, booking_ref, label):
        """UPDATE flights row for uid; only overwrites NULLs with non-NULL values."""
        db_exec(conn, """
            UPDATE flights SET
              outbound_flight_date   = COALESCE(%s, outbound_flight_date),
              outbound_airline       = COALESCE(%s, outbound_airline),
              outbound_flight_number = COALESCE(%s, outbound_flight_number),
              outbound_flight_time   = COALESCE(%s, outbound_flight_time),
              return_flight_date     = COALESCE(%s, return_flight_date),
              return_airline         = COALESCE(%s, return_airline),
              return_flight_number   = COALESCE(%s, return_flight_number),
              return_flight_time     = COALESCE(%s, return_flight_time),
              booking_reference      = COALESCE(%s, booking_reference)
            WHERE user_id = %s
        """, (out_date, out_airl, out_fnum, out_time,
              ret_date,  ret_airl, ret_fnum,  ret_time,
              booking_ref, uid),
        dry_run, f"UPDATE flights {label}")

    # ══ Sheet 1: טיסות נוספות ══════════════════════════════════════════════════
    print(f"\n  --- Sheet: 'טיסות נוספות' ---")
    df_nsp = xl.parse('טיסות נוספות', header=None)
    n_rows = 0
    for i, row in df_nsp.iterrows():
        if i == 0:   # header row
            continue
        raw_last  = safe_str(row.iloc[1])
        heb_first = safe_str(row.iloc[2])
        passport  = safe_str(row.iloc[5])
        if not raw_last:
            continue   # blank or label row (e.g. meal category "מנת" in first-name col)

        out_date  = None if _is_x(row.iloc[10]) else safe_date(row.iloc[10])
        out_airl  = None if _is_x(row.iloc[11]) else safe_str(row.iloc[11], 45)
        out_fnum  = None if _is_x(row.iloc[12]) else safe_str(row.iloc[12], 45)
        out_time  = None if _is_x(row.iloc[13]) else safe_str(row.iloc[13], 10)
        # col[14] = מי קנה — skip
        ret_date  = None if _is_x(row.iloc[15]) else safe_date(row.iloc[15])
        ret_airl  = None if _is_x(row.iloc[16]) else safe_str(row.iloc[16], 45)
        ret_fnum  = None if _is_x(row.iloc[17]) else safe_str(row.iloc[17], 45)
        ret_time  = None if _is_x(row.iloc[18]) else safe_str(row.iloc[18], 10)
        booking_ref = safe_str(row.iloc[19], 10) if len(row) > 19 else None

        uid, how = _find_uid(raw_last, heb_first, passport)
        if not uid:
            skipped.append((raw_last, heb_first, how))
            continue

        _update_flight(uid, out_date, out_airl, out_fnum, out_time,
                       ret_date, ret_airl, ret_fnum, ret_time, booking_ref,
                       f"'{heb_first} {raw_last}' (via {how})")
        updated_flights.append((raw_last, heb_first))
        n_rows += 1

    print(f"  Processed {n_rows} rows from 'טיסות נוספות'")

    # ══ Sheet 2: טסים באופן עצמאי ══════════════════════════════════════════════
    print(f"\n  --- Sheet: 'טסים באופן עצמאי' ---")
    df_ind = xl.parse('טסים באופן עצמאי', header=None)
    n_rows = 0
    for i, row in df_ind.iterrows():
        if i == 0:   # header row (has "6" in col[0], flight labels in col[9]/col[13])
            continue
        raw_last  = safe_str(row.iloc[0])
        heb_first = safe_str(row.iloc[1])
        passport  = safe_str(row.iloc[4])
        if not raw_last:
            continue

        # X in flight cols means no data / not booked through us
        out_date  = None if _is_x(row.iloc[9])  else safe_date(row.iloc[9])
        out_airl  = None if _is_x(row.iloc[10]) else safe_str(row.iloc[10], 45)
        out_fnum  = None if _is_x(row.iloc[11]) else safe_str(row.iloc[11], 45)
        out_time  = None if _is_x(row.iloc[12]) else safe_str(row.iloc[12], 10)
        ret_date  = None if _is_x(row.iloc[13]) else safe_date(row.iloc[13])
        ret_airl  = None if _is_x(row.iloc[14]) else safe_str(row.iloc[14], 45)
        ret_fnum  = None if _is_x(row.iloc[15]) else safe_str(row.iloc[15], 45)
        ret_time  = None if _is_x(row.iloc[16]) else safe_str(row.iloc[16], 10)

        # Detect "no flights at all" → set flying_with_us = 0 for every member
        all_x = all(_is_x(row.iloc[j]) for j in range(9, 17))

        uid, how = _find_uid(raw_last, heb_first, passport)
        if not uid:
            skipped.append((raw_last, heb_first, how))
            continue

        if all_x:
            # Passenger has no flights through us — set flying_with_us = 0
            db_exec(conn,
                    "UPDATE guest SET flying_with_us = 0 WHERE user_id = %s",
                    (uid,), dry_run,
                    f"  flying_with_us=0 for '{heb_first} {raw_last}'")
            updated_status.append((raw_last, heb_first, 'flying_with_us=0'))
        else:
            # Has at least some flight info — update what we have
            _update_flight(uid, out_date, out_airl, out_fnum, out_time,
                           ret_date, ret_airl, ret_fnum, ret_time, None,
                           f"'{heb_first} {raw_last}' (via {how})")
            updated_flights.append((raw_last, heb_first))

        n_rows += 1

    print(f"  Processed {n_rows} rows from 'טסים באופן עצמאי'")

    # ── Report ─────────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  FLIGHTS UPDATED:         {len(updated_flights)}")
    print(f"  flying_with_us=0 SET:    {len(updated_status)}")
    print(f"  SKIPPED (not in DB):     {len(skipped)}")
    print(f"{'='*60}")

    if updated_status:
        print(f"\n  --- flying_with_us set to 0 ---")
        for ln, fn, note in updated_status:
            print(f"    {fn} {ln}: {note}")

    if skipped:
        print(f"\n  --- Skipped ({len(skipped)}) ---")
        for ln, fn, reason in skipped:
            print(f"    - {fn or ''} {ln}: {reason}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Import Pesach 2024 Excel data")
    parser.add_argument("--vacation-id", required=True,
                        help="Vacation UUID with underscores")
    parser.add_argument("--dry-run", action="store_true",
                        help="Read from DB and print what would happen, but write nothing")
    parser.add_argument("--steps", default="families",
                        help="Comma-separated: families,guests,staff,vehicles  (default: families)")
    args = parser.parse_args()

    steps = [s.strip() for s in args.steps.split(",")]

    print(f"\nImport Pesach 2024 -> trip_tracker_{args.vacation_id}")
    print(f"Mode:  {'DRY RUN (no writes)' if args.dry_run else 'LIVE'}")
    print(f"Steps: {steps}")

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
