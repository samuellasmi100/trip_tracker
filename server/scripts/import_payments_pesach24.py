"""
import_payments_pesach24.py
===========================
One-time import of Pesach 2024 client payment data into trip_tracker_{vacationId}.

Source:  הנהלת חשבונות/תשלומים מלקוח.xlsx  →  sheet "תיעוד"
Target:  payments table (one row per installment, up to 5 per family)

Column layout of "תיעוד" (header=0):
  col[ 0]  'משפחה'           — family name
  col[ 1]  'פרטי'             — contact first name (disambiguation hint)
  col[ 2]  'סכום העסקה'      — total deal amount (optional update families.total_amount)
  col[ 3]  'תאריך'           ┐
  col[ 4]  'סכום'            │ Payment slot 1
  col[ 5]  'צורת העברה'      │
  col[ 6]  'יצאה חשבונית'    ┘
  col[ 7..10]                — Payment slot 2
  col[11..14]                — Payment slot 3
  col[15..18]                — Payment slot 4
  col[19..22]                — Payment slot 5
  col[24]  'סה"כ ייתרה'     — remaining balance (reference only)
  col[25]  (notes)           — free-text notes on the row

Usage:
    python scripts/import_payments_pesach24.py --vacation-id <id> [--dry-run]
    python scripts/import_payments_pesach24.py --vacation-id <id> --date-fallback 2024-01-01
    python scripts/import_payments_pesach24.py --vacation-id <id> --update-totals

Options:
    --dry-run               Print what would happen, write nothing
    --date-fallback D       Use date D (YYYY-MM-DD) for slots missing a date.
                            Default: skip such slots (reported in SKIPPED SLOTS).
    --update-totals         Also update families.total_amount from 'סכום העסקה' col
                            (only fills NULL/empty cells — never overwrites existing value)

Requirements:
    pip install pandas openpyxl mysql-connector-python python-dotenv
"""

import argparse
import math
import os
import re
import sys
import uuid
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

import mysql.connector
import pandas as pd
from dotenv import load_dotenv

# ── Config ─────────────────────────────────────────────────────────────────────

PAYMENTS_FILE = (
    r"C:\Users\Shmuel\Downloads\אבימור 24 פסח\אבימור פסח 24"
    r"\הנהלת חשבונות\תשלומים מלקוח.xlsx"
)
SHEET_NAME = 'תיעוד'

# Column indices in "תיעוד" (header=0)
COL_FAMILY  = 0   # 'משפחה'
COL_CONTACT = 1   # 'פרטי' — first name / contact
COL_TOTAL   = 2   # 'סכום העסקה'

# (date_col, amount_col, method_col, receipt_col) for each of 5 payment slots
PAYMENT_SLOTS = [
    ( 3,  4,  5,  6),   # slot 1: תאריך, סכום, צורת העברה, יצאה חשבונית
    ( 7,  8,  9, 10),   # slot 2
    (11, 12, 13, 14),   # slot 3
    (15, 16, 17, 18),   # slot 4
    (19, 20, 21, 22),   # slot 5
]

COL_BALANCE = 24   # 'סה"כ ייתרה' — info only
COL_NOTES   = 25   # unnamed notes column

# ── Payment method normalizer ──────────────────────────────────────────────────
# Maps Excel values → DB canonical. Unknown values are kept as-is (truncated to 45).

PAYMENT_METHOD_MAP = {
    'מזומן':           'מזומן',
    'העברה':           'העברה',
    'העברה בנקאית':    'העברה',
    'ביט':             'העברה',
    'פייבוקס':         'העברה',
    'אשראי':           'אשראי',
    "צ'ק":             "צ'ק",
    'שיק':             "צ'ק",
    'check':           "צ'ק",
    'אשראי דחוי':      'אשראי',
}
DEFAULT_METHOD = 'מזומן'

# ── Family disambiguation (same billing file as families/guests import) ─────────

SPELLING_ALIASES = {
    'שטיינבוך': 'שטרנבוך',
    'טואבמן':   'טאובמן',
    'הלוי':     'הלוי מלק',
}

# Payments file uses billing family names directly — sub-family mappings rarely
# needed here (those are for the guest file). Add entries if any appear in SKIPPED.
SUB_FAMILY_MAP: dict = {}

# Hard overrides for same-name families: (raw_name, contact_hint) → (billing_name, head_hint)
INDIVIDUAL_OVERRIDES: dict = {}

# Fallback for ambiguous same-name families when no other hint works
AMBIGUITY_PREFER = {
    'הררי': 'מרקו',   # הררי מרקו/שנטל is the larger family
}

# ── Helpers ────────────────────────────────────────────────────────────────────

def safe_str(val, max_len=None):
    if val is None:
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    s = str(val).strip()
    if s in ('', 'nan', 'NaT', 'None'):
        return None
    if max_len and len(s) > max_len:
        s = s[:max_len]
    return s


def safe_decimal(val):
    """Return float or None. Handles comma-thousands strings like '10,000'."""
    if val is None:
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip().replace(',', '').replace(' ', '')
    if not s:
        return None
    try:
        return float(s)
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
    if s in ('', 'nan', 'NaT', 'None', '?', '-', 'N/A', 'n/a'):
        return None
    for fmt in ('%Y-%m-%d %H:%M:%S', '%d/%m/%Y', '%d.%m.%Y', '%m/%d/%Y', '%Y-%m-%d'):
        try:
            return datetime.strptime(s, fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue
    # Could not parse — treat as missing date (do not pass raw garbage to MySQL)
    return None


def normalize_method(raw):
    s = safe_str(raw)
    if not s:
        return DEFAULT_METHOD
    return PAYMENT_METHOD_MAP.get(s, s[:45])


def normalize_receipt(raw):
    s = safe_str(raw)
    if not s:
        return 0
    return 1 if s.lower() in ('כן', 'v', '✓', '1', 'true', 'yes', 'x') else 0


def new_uuid():
    return str(uuid.uuid4()).replace('-', '_')


def connect(vacation_id):
    load_dotenv(dotenv_path=Path(__file__).parent.parent / '.env')
    return mysql.connector.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        database=f'trip_tracker_{vacation_id}',
        charset='utf8mb4',
        autocommit=False,
    )


def db_query(conn, sql, params=()):
    cur = conn.cursor()
    cur.execute(sql, params)
    rows = cur.fetchall()
    cur.close()
    return rows


def db_exec(conn, sql, params, dry_run, label=''):
    if dry_run:
        print(f'    [DRY] {label}')
        return None
    cur = conn.cursor()
    cur.execute(sql, params)
    return cur.lastrowid


# ── Family resolution engine ───────────────────────────────────────────────────
# The payment file uses billing family names (same source as כללי נרשמים).
# Direct lookup works for most families. Disambiguation handles same-name cases.

def _strip_parens(s):
    return re.sub(r'\s*\(.*?\)\s*', '', s).strip()

def _extract_parens(s):
    m = re.search(r'\((.+?)\)', s)
    return m.group(1).strip() if m else None

def _pick_family_by_head(families, head_hint):
    """
    Pick a (family_id, male_head, female_head) tuple by head_hint.
    head_hint == ''   → pick the family with NO male_head AND NO female_head
    head_hint == str  → substring match in either direction (handles compound names)
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


def _resolve_family(raw_name, name_to_families, contact_hint=None):
    """
    Map a billing family name to a family_id.

    contact_hint = col[1] 'פרטי' — first name of contact person.
    Used as a head hint when multiple families share the same name.

    Returns (family_id, canonical_name) or (None, reason_string).
    """
    if not raw_name:
        return None, 'empty name'

    # 1. Hard overrides
    override = INDIVIDUAL_OVERRIDES.get((raw_name, contact_hint or ''))
    if override:
        o_name, o_head = override
        if o_name not in name_to_families:
            return None, f"override target '{o_name}' not in DB"
        fams = name_to_families[o_name]
        if len(fams) == 1:
            return fams[0][0], o_name
        fid = _pick_family_by_head(fams, o_head)
        return (fid, o_name) if fid else (None, f"override target '{o_name}' ambiguous")

    parens_content = _extract_parens(raw_name)
    base_name = _strip_parens(raw_name)

    # 2. Parens suffix = explicit billing parent
    if parens_content:
        p = SPELLING_ALIASES.get(parens_content, parens_content)
        if p in name_to_families:
            fams = name_to_families[p]
            if len(fams) == 1:
                return fams[0][0], p
            fid = _pick_family_by_head(fams, contact_hint)
            if fid:
                return fid, p

    # 3. Spelling alias
    canonical = SPELLING_ALIASES.get(base_name, base_name)
    head_hint = None

    # 4. Sub-family map (rarely needed for payments file)
    billing = SUB_FAMILY_MAP.get(canonical)
    if billing:
        canonical, head_hint = billing if isinstance(billing, tuple) else (billing, None)

    if canonical not in name_to_families:
        return None, f"'{canonical}' not found in DB"

    fams = name_to_families[canonical]

    if len(fams) == 1:
        return fams[0][0], canonical

    # 5. Disambiguation for same-name families
    if head_hint:
        fid = _pick_family_by_head(fams, head_hint)
        if fid:
            return fid, canonical

    if contact_hint:
        fid = _pick_family_by_head(fams, contact_hint)
        if fid:
            return fid, canonical

    pref = AMBIGUITY_PREFER.get(canonical)
    if pref:
        fid = _pick_family_by_head(fams, pref)
        if fid:
            return fid, canonical

    return None, f"ambiguous: {len(fams)} families named '{canonical}' — add to INDIVIDUAL_OVERRIDES"


# ── Main import ────────────────────────────────────────────────────────────────

def import_payments(conn, dry_run, date_fallback, update_totals):
    print('\n=== Payments from תשלומים מלקוח.xlsx ===')

    xl = pd.ExcelFile(PAYMENTS_FILE)

    # ── Diagnostic: print column map ──────────────────────────────────────────
    df_head = xl.parse(SHEET_NAME, header=0, nrows=3)
    print('\n  Column map (header | first-data-row sample):')
    for i, col in enumerate(df_head.columns):
        sample = safe_str(df_head.iloc[0, i]) if len(df_head) > 0 else '-'
        print(f"    col[{i:2d}]  '{col}'  |  '{sample}'")

    # ── Parse full sheet ───────────────────────────────────────────────────
    df = xl.parse(SHEET_NAME, header=0)
    # Keep only rows that have a non-empty family name
    df = df[df.iloc[:, COL_FAMILY].apply(lambda v: bool(safe_str(v)))]
    print(f'\n  {len(df)} data rows in "{SHEET_NAME}"')

    # ── Load families from DB ──────────────────────────────────────────────
    name_to_families = {}
    for (fname_db, fid, mh, fh) in db_query(
            conn, 'SELECT family_name, family_id, male_head, female_head FROM families'):
        name_to_families.setdefault(fname_db.strip(), []).append(
            (fid, (mh or '').strip(), (fh or '').strip()))
    print(f'  {len(name_to_families)} unique family names in DB')

    # ── Load existing payments for idempotency ─────────────────────────────
    # Key: (family_id, payment_date_str, amount_str_2dp)
    existing = set()
    for (fid, pdate, amt) in db_query(
            conn, 'SELECT family_id, payment_date, amount FROM payments'):
        existing.add((fid, str(pdate), f'{float(amt):.2f}'))
    print(f'  {len(existing)} existing payment rows in DB\n')

    # ── Tracking ───────────────────────────────────────────────────────────
    inserted      = []   # (family_name, slot_num, amount, pdate)
    skipped_fams  = []   # (family_name, reason)
    skipped_slots = []   # (family_name, slot_num, reason)
    totals_done   = []   # (family_name, amount) — families.total_amount updates

    for _, row in df.iterrows():
        raw_name = safe_str(row.iloc[COL_FAMILY], 45)
        if not raw_name:
            continue

        contact   = safe_str(row.iloc[COL_CONTACT], 45) if len(row) > COL_CONTACT else None
        total_amt = safe_decimal(row.iloc[COL_TOTAL])   if len(row) > COL_TOTAL   else None
        row_notes = safe_str(row.iloc[COL_NOTES])       if len(row) > COL_NOTES   else None

        # Resolve family_id
        family_id, resolve_result = _resolve_family(raw_name, name_to_families, contact)
        if not family_id:
            skipped_fams.append((raw_name, resolve_result))
            continue

        # Optionally update families.total_amount (never overwrites existing value)
        if update_totals and total_amt and total_amt > 0:
            db_exec(conn,
                    "UPDATE families "
                    "SET total_amount = COALESCE(NULLIF(TRIM(total_amount),''), %s) "
                    "WHERE family_id = %s",
                    (str(int(round(total_amt))), family_id), dry_run,
                    f"  UPDATE total_amount={int(round(total_amt))} for '{raw_name}'")
            totals_done.append((raw_name, total_amt))

        # Process each of the 5 payment slots
        for slot_num, (ci_date, ci_amt, ci_method, ci_receipt) in enumerate(PAYMENT_SLOTS, 1):
            # Amount
            amt_raw = row.iloc[ci_amt] if len(row) > ci_amt else None
            amount  = safe_decimal(amt_raw)
            if amount is None or amount == 0:
                continue   # empty slot

            is_refund = amount < 0

            # Date
            date_raw = row.iloc[ci_date] if len(row) > ci_date else None
            pdate    = safe_date(date_raw)
            date_note = ''
            if not pdate:
                if date_fallback:
                    pdate     = date_fallback
                    date_note = f'תאריך לא ידוע (ייבוא עם {date_fallback})'
                else:
                    skipped_slots.append((
                        raw_name, slot_num,
                        f'סכום {amount:.0f} ₪ ללא תאריך — השתמש ב-‑‑date-fallback כדי לייבא'))
                    continue

            # Payment method and receipt
            method_raw  = row.iloc[ci_method]  if len(row) > ci_method  else None
            receipt_raw = row.iloc[ci_receipt] if len(row) > ci_receipt else None
            method  = normalize_method(method_raw)
            receipt = normalize_receipt(receipt_raw)

            # Compose notes
            notes_parts = [p for p in [date_note,
                                        'החזר / זיכוי' if is_refund else None,
                                        row_notes] if p]
            notes_str = ' | '.join(notes_parts) if notes_parts else None

            # Idempotency: skip if (family_id, date, |amount|) already in DB
            idem_key = (family_id, pdate, f'{abs(amount):.2f}')
            if idem_key in existing:
                skipped_slots.append((raw_name, slot_num,
                    f'כבר קיים: {pdate}  {amount:.0f} ₪'))
                continue

            # Insert
            db_exec(conn,
                    "INSERT INTO payments "
                    "  (family_id, amount, payment_method, payment_date, "
                    "   notes, receipt, status, payment_gateway) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, 'manual')",
                    (family_id,
                     round(abs(amount), 2),
                     method,
                     pdate,
                     notes_str,
                     receipt,
                     'completed' if not is_refund else 'cancelled'),
                    dry_run,
                    f"INSERT '{raw_name}' slot {slot_num}  {pdate}  "
                    f"{amount:.0f} ₪  {method}  חשבונית={receipt}")

            existing.add(idem_key)   # guard against duplicate in same run
            inserted.append((raw_name, slot_num, amount, pdate))

    # ── Summary report ─────────────────────────────────────────────────────
    total_nis = sum(a for _, _, a, _ in inserted if a > 0)
    print(f'\n{"="*60}')
    print(f'  תשלומות שיובאו:       {len(inserted)}')
    print(f'  סה"כ סכום יובא:       ₪{total_nis:,.0f}')
    print(f'  משפחות שדולגו:        {len(skipped_fams)}')
    print(f'  תשלומות שדולגו:       {len(skipped_slots)}')
    if update_totals:
        print(f'  עודכן סכום עסקה:      {len(totals_done)}')
    print(f'{"="*60}')

    if inserted:
        print(f'\n  --- יובא ({len(inserted)}) ---')
        for fname, slot, amt, pdate in inserted:
            sign = '' if amt >= 0 else '↩ '
            print(f'    + {fname:<30}  slot {slot}  {pdate}  {sign}₪{abs(amt):,.0f}')

    if skipped_fams:
        print(f'\n  --- משפחות שדולגו ({len(skipped_fams)}) ---')
        print('      תקן ב-INDIVIDUAL_OVERRIDES או SPELLING_ALIASES ואז הרץ שוב')
        for fname, reason in skipped_fams:
            print(f'    - {fname}: {reason}')

    if skipped_slots:
        print(f'\n  --- תשלומות שדולגו ({len(skipped_slots)}) ---')
        for fname, slot, reason in skipped_slots:
            print(f'    - {fname} slot {slot}: {reason}')

    # Print method distribution for verification
    methods_seen = {}
    for _, slot, _, _ in inserted:
        pass   # already counted above
    # Collect from re-reading is complex; just remind user to verify
    print(f'\n  אמות שהתגלו בשדה "צורת העברה" (לאימות ה-method map):')
    raw_methods = set()
    df2 = xl.parse(SHEET_NAME, header=0)
    df2 = df2[df2.iloc[:, COL_FAMILY].apply(lambda v: bool(safe_str(v)))]
    for _, row in df2.iterrows():
        for _, _, ci_method, _ in PAYMENT_SLOTS:
            m = safe_str(row.iloc[ci_method]) if len(row) > ci_method else None
            if m:
                raw_methods.add(m)
    for m in sorted(raw_methods):
        mapped = normalize_method(m)
        flag = '  ← unknown (kept as-is)' if m not in PAYMENT_METHOD_MAP else ''
        print(f'    "{m}"  →  "{mapped}"{flag}')


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Import Pesach 2024 client payments')
    parser.add_argument('--vacation-id', required=True,
                        help='Vacation UUID with underscores (e.g. ce7c7ed2_4d76_...)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Print what would happen, write nothing')
    parser.add_argument('--date-fallback', default=None, metavar='YYYY-MM-DD',
                        help='Use this date for payments that have an amount but no date. '
                             'Default: skip such slots and report them.')
    parser.add_argument('--update-totals', action='store_true',
                        help='Update families.total_amount from "סכום העסקה" column '
                             '(only fills NULL/empty — never overwrites existing value)')
    args = parser.parse_args()

    print(f'\nImport Pesach 2024 payments  →  trip_tracker_{args.vacation_id}')
    print(f'Mode:           {"DRY RUN (no writes)" if args.dry_run else "LIVE"}')
    print(f'Date fallback:  {args.date_fallback or "skip payments with no date"}')
    print(f'Update totals:  {args.update_totals}')
    print(f'Source file:    {PAYMENTS_FILE}')

    if not os.path.exists(PAYMENTS_FILE):
        print(f'ERROR: File not found:\n  {PAYMENTS_FILE}')
        sys.exit(1)

    conn = connect(args.vacation_id)
    try:
        import_payments(conn, args.dry_run, args.date_fallback, args.update_totals)
        if not args.dry_run:
            conn.commit()
            print('\nCommitted to database.')
    except Exception as e:
        conn.rollback()
        print(f'\nERROR: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        conn.close()

    print('\nDone.')


if __name__ == '__main__':
    main()
