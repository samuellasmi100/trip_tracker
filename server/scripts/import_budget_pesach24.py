"""
import_budget_pesach24.py
========================
One-time import of Pesach 2024 financial data into the budget tables.

Sources:
  1. הנהלת חשבונות/פסח  תחשיב 24 גליון 2.xlsx  —  sheet גיליון1 (right block cols 13-18)
     →  expenses table (one row per cost category)
  2. הנהלת חשבונות/שוק מקומי רומניה הוצאות פסח 2024.xlsx  —  sheet גיליון1
     →  expenses table (Romanian local-market invoices, sub-cat: שוק מקומי)
  3. Exchange rates from the budget sheet:
     EUR = 4.0 NIS,  USD = 3.7 NIS,  RON ≈ 0.8 NIS (approximate)
     →  exchange_rates table
  4. families.total_amount already in DB  +  payments already imported
     →  income table (one aggregate row: תשלומי משפחות)

Steps (--steps flag, all run by default):
  exchange_rates   Insert EUR, USD, RON rates (skip if ccy already exists)
  budget           Import expense categories from גיליון1 (skip per-row if sub-cat exists)
  invoices         Import Romanian market invoices (skip if שוק מקומי already has rows)
  income           Create income entry from families total (skip if cat-1 already has rows)

Usage:
  python scripts/import_budget_pesach24.py --vacation-id <id> [--dry-run]
  python scripts/import_budget_pesach24.py --vacation-id <id> --steps budget,invoices

Requirements:
  pip install pandas openpyxl mysql-connector-python python-dotenv
"""

import argparse
import glob
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

ACCOUNTING_FOLDER = (
    r"C:\Users\Shmuel\Downloads\אבימור 24 פסח\אבימור פסח 24\הנהלת חשבונות"
)

# Budget file has a double-space in the name — find it dynamically
def _find_budget_file():
    candidates = glob.glob(os.path.join(ACCOUNTING_FOLDER, "פסח*תחשיב 24 גליון 2.xlsx"))
    return candidates[0] if candidates else None

INVOICES_FILE = os.path.join(ACCOUNTING_FOLDER, "שוק מקומי רומניה הוצאות פסח 2024.xlsx")

# ── Column indices — גיליון1 right block (header=None, row 0 = headers) ────────
#
# The sheet has a two-column-group layout:
#   Left  (cols  0-12): scenario/planned figures
#   Right (cols 13-18): actual figures with paid status and date
#
# We import the RIGHT block only.
BUDGET_COL_NAME = 13   # 'סוג הוצאה'
BUDGET_COL_EUR  = 14   # 'מחיר יורו'
BUDGET_COL_USD  = 15   # 'מחיר דולר'
BUDGET_COL_NIS  = 16   # 'סה"כ שקל'
BUDGET_COL_PAID = 17   # 'שולם'
BUDGET_COL_DATE = 18   # 'תאריך'

# ── Column indices — שוק מקומי (header=0) ─────────────────────────────────────
INV_COL_DATE     = 1   # 'תאריך'
INV_COL_SUPPLIER = 2   # 'שם ספק'
INV_COL_DESC     = 3   # 'תאור מוצר'
INV_COL_INVOICE  = 4   # 'מפר חשבונית'
INV_COL_AMOUNT   = 5   # 'סכום' (RON)
INV_COL_METHOD   = 7   # 'צורת תשלום'
INV_COL_NOTE1    = 8   # free notes (may contain 'לא שולם!')
INV_COL_NOTE2    = 9   # extra notes

# ── Exchange rates (source: budget sheet) ──────────────────────────────────────
EXCHANGE_RATES = [
    ('יורו', '4.0'),   # explicitly stated in budget sheet
    ('דולר', '3.7'),   # "דולר לפי 3.7" column header in budget sheet
    ('RON',  '0.8'),   # approximate: EUR/RON ≈ 4.97 in Apr 2024 → 4.0/4.97 ≈ 0.80
]
RON_TO_NIS = 0.8       # used to compute expenditure_ils for Romanian invoices

# ── Excel category name → DB sub-category name ────────────────────────────────
#
# Keys:   names as they appear in col[13] of גיליון1 (stripped)
# Values: exact names in expenses_sub_category table (some have trailing spaces in DB)
#
# The pre-seeded sub-categories cover all rows of the budget sheet.
# Add an entry here if any name surfaces in the SKIPPED report.
EXPENSE_NAME_MAP = {
    'מלון':                  'מלון',
    'טיסות':                 'טיסות כללי',
    'טיסות היי סקאי':        'טיסות קבוצה hisky',
    'טיסות אל על':           'טיסות קבוצה אל על ',   # trailing space in DB
    'העברות':                'העברות',
    'העברות פרטיות':         'העברות פרטיות',
    'טיולים אוטובוסים':      'אוטובוסים',
    'טיולים כניסות':         'טיולים כניסות',
    'חניות':                 'חניות',
    'קונטיינר':              'קונטיינר',
    'בשר':                   'בשר',
    'עופות':                 'עופות ',                 # trailing space in DB
    'דגים':                  'דגים',
    'שלומוביץ חלבי':         'שלומוביץ חלבי',
    'הובלה קונטיינר':        'הובלות קונטיינר',
    'הובלות אירופה':         'הובלות אירופה',
    'משאית קירור':           'משאית קירור ',           # trailing space in DB
    'רכב':                   'רכב',
    'אומנים מקומיים':        'אומנים מקומיים',
    'אומנים':                'אומנים',
    'הגברה':                 'הגברה',
    'שוק מקומי':             'שוק מקומי',
    'מטבח רכוש':             'מטבח רכוש',
    'צוות מטבח':             'צוות מטבח',
    'שף':                    'שף',
    'מחסנאי':                'מחסנאי',
    'קונדיטור':              'קונדיטור',
    'משגיח':                 'משגיח',
    'טיסות צוות':            'טיסות צוות',
    'מדריך':                 'מדריך',
    'מארחת':                 'מארחת',
    'תהילה':                 'תהילה',
    'כשרות':                 'כשרות',
    'פרסום':                 'פרסום',
    'משרד':                  'משרד',
    'משכורות':               'משכורות',
}

# ── Helpers ────────────────────────────────────────────────────────────────────

def safe_str(val, max_len=None):
    if val is None:
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    s = str(val).strip()
    if s in ('', 'nan', 'NaT', 'None', '?', '-'):
        return None
    if max_len and len(s) > max_len:
        s = s[:max_len]
    return s


def safe_decimal(val):
    if val is None:
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip().replace(',', '').replace(' ', '')
    if not s or s in ('nan', 'None', '-', '?'):
        return None
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


def safe_date(val):
    if val is None:
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    if hasattr(val, 'strftime'):
        return val.strftime('%Y-%m-%d')
    s = str(val).strip()
    if s in ('', 'nan', 'NaT', 'None', '?', '-'):
        return None
    for fmt in ('%Y-%m-%d %H:%M:%S', '%d/%m/%Y', '%d.%m.%Y', '%m/%d/%Y', '%Y-%m-%d'):
        try:
            return datetime.strptime(s, fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue
    return None


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


# ── Step 1: exchange_rates ─────────────────────────────────────────────────────

def import_exchange_rates(conn, dry_run):
    print('\n=== Exchange Rates ===')
    existing = {row[0] for row in db_query(conn, 'SELECT ccy FROM exchange_rates')}
    print(f'  Existing in DB: {sorted(existing) or "(empty)"}')

    inserted = []
    skipped  = []
    for ccy, amount in EXCHANGE_RATES:
        if ccy in existing:
            skipped.append(f'{ccy} = {amount}  (already exists)')
            continue
        db_exec(conn,
                'INSERT INTO exchange_rates (ccy, amount) VALUES (%s, %s)',
                (ccy, amount), dry_run,
                f'INSERT exchange_rate: {ccy} = {amount} NIS/unit')
        inserted.append(f'{ccy} = {amount}')

    for s in inserted:
        print(f'  + {s}')
    for s in skipped:
        print(f'  ~ {s}')
    if not dry_run and any('RON' in r for r in inserted):
        print('  NOTE: RON rate (0.8) is approximate. Adjust in the UI if needed.')


# ── Step 2: budget expenses from גיליון1 ──────────────────────────────────────

def import_budget(conn, dry_run):
    budget_file = _find_budget_file()
    if not budget_file:
        print(f'\nERROR: budget file not found under:\n  {ACCOUNTING_FOLDER}')
        print('  Expected name matching: פסח*תחשיב 24 גליון 2.xlsx')
        return
    print(f'\n=== Budget Expenses (גיליון1 right block) ===')
    print(f'  File: {budget_file}')

    # Load sub-categories from DB: stripped_name → (sub_id, cat_id)
    sub_cat_map = {}
    for (sid, cat_id, name) in db_query(
            conn, 'SELECT id, expenses_category_id, name FROM expenses_sub_category'):
        sub_cat_map[name.strip()] = (str(sid), str(cat_id))
    print(f'  {len(sub_cat_map)} sub-categories in DB')

    # Idempotency: which sub-category IDs already have at least one expense row
    existing_sub_ids = {
        str(row[0]) for row in db_query(
            conn,
            'SELECT DISTINCT expenses_sub_category_id FROM expenses '
            'WHERE expenses_sub_category_id IS NOT NULL')
    }
    print(f'  {len(existing_sub_ids)} sub-categories already have expense rows\n')

    df = pd.read_excel(budget_file, sheet_name='גיליון1', header=None)
    print(f'  Sheet shape: {df.shape}')

    # Print right-block column map (row 0 = header row)
    print('\n  Right-block column map (row 0):')
    for ci in [BUDGET_COL_NAME, BUDGET_COL_EUR, BUDGET_COL_USD,
               BUDGET_COL_NIS, BUDGET_COL_PAID, BUDGET_COL_DATE]:
        val = safe_str(df.iloc[0, ci]) if df.shape[1] > ci else '(col missing)'
        print(f'    col[{ci}] = {val!r}')
    print()

    inserted     = []   # (excel_name, sub_id, currency, expenditure, nis_str)
    already      = []   # (excel_name, sub_id) — already in DB
    skipped_rows = []   # (excel_name, reason)

    for i, row in df.iterrows():
        if i == 0:      # header row
            continue

        raw_name = safe_str(row.iloc[BUDGET_COL_NAME]) if df.shape[1] > BUDGET_COL_NAME else None
        if not raw_name:
            continue

        # ── Map Excel name → DB sub-category ──────────────────────────────
        db_sub_name = EXPENSE_NAME_MAP.get(raw_name)
        if db_sub_name is None:
            skipped_rows.append((raw_name, 'not in EXPENSE_NAME_MAP'))
            continue

        # Look up (sub_id, cat_id); try stripped variant if trailing-space mismatch
        entry = sub_cat_map.get(db_sub_name) or sub_cat_map.get(db_sub_name.strip())
        if not entry:
            # Last-resort: case-insensitive prefix match
            for k, v in sub_cat_map.items():
                if k.strip() == db_sub_name.strip():
                    entry = v
                    break
        if not entry:
            skipped_rows.append((raw_name, f'sub-cat "{db_sub_name}" not in DB'))
            continue

        sub_id, cat_id = entry

        # ── Idempotency: skip if this sub-category already has an expense row ──
        if sub_id in existing_sub_ids:
            already.append((raw_name, sub_id))
            continue

        # ── Parse amounts ──────────────────────────────────────────────────
        eur = safe_decimal(row.iloc[BUDGET_COL_EUR]) if df.shape[1] > BUDGET_COL_EUR else None
        usd = safe_decimal(row.iloc[BUDGET_COL_USD]) if df.shape[1] > BUDGET_COL_USD else None
        nis = safe_decimal(row.iloc[BUDGET_COL_NIS]) if df.shape[1] > BUDGET_COL_NIS else None

        if not eur and not usd and not nis:
            skipped_rows.append((raw_name, 'all amount columns empty'))
            continue

        # Choose primary currency (EUR > USD > NIS)
        if eur and eur > 0:
            expenditure = str(int(round(eur)))
            currency    = 'EUR'
        elif usd and usd > 0:
            expenditure = str(int(round(usd)))
            currency    = 'USD'
        else:
            expenditure = str(int(round(nis))) if nis else '0'
            currency    = 'שקל'

        nis_str = str(int(round(nis))) if nis else None

        # ── Parse paid status + date ───────────────────────────────────────
        paid_val = safe_decimal(row.iloc[BUDGET_COL_PAID]) if df.shape[1] > BUDGET_COL_PAID else None
        date_val = safe_date(row.iloc[BUDGET_COL_DATE])    if df.shape[1] > BUDGET_COL_DATE else None
        is_paid  = 1 if (paid_val and paid_val > 0) else 0
        act_date = date_val if is_paid else ''

        action_id = new_uuid()
        db_exec(conn, """
            INSERT INTO expenses
              (action_id, expenditure, payment_currency,
               expenses_category_id, expenses_sub_category_id,
               planned_payment_date, expenditure_ils,
               is_paid, actual_payment_date, is_unexpected, payment_date)
            VALUES (%s, %s, %s, %s, %s, '', %s, %s, %s, 0, %s)
        """,
        (action_id, expenditure, currency,
         cat_id, sub_id,
         nis_str,
         is_paid, act_date or '', act_date or ''),
        dry_run,
        f"INSERT expense: {raw_name:<30}  {expenditure:>10} {currency:<5}  "
        f"NIS={nis_str or '-':>10}  paid={is_paid}  date={act_date or '-'}")

        existing_sub_ids.add(sub_id)   # guard against duplicate within the same run
        inserted.append((raw_name, sub_id, currency, expenditure, nis_str))

    # ── Report ─────────────────────────────────────────────────────────────
    total_nis = sum(int(n) for _, _, _, _, n in inserted if n and n.lstrip('-').isdigit())
    print(f'\n{"="*60}')
    print(f'  INSERTED:     {len(inserted)} expense rows')
    print(f'  NIS total:    ₪{total_nis:,}')
    print(f'  ALREADY IN DB:{len(already)} rows skipped (idempotent)')
    print(f'  SKIPPED:      {len(skipped_rows)}')
    print(f'{"="*60}')

    if inserted:
        print(f'\n  --- Inserted ---')
        for name, _, cur, amt, nis in inserted:
            print(f'    + {name:<30}  {amt:>10} {cur:<5}  ₪{nis or "?"}')

    if already:
        print(f'\n  --- Already in DB ---')
        for name, sub_id in already:
            print(f'    ~ {name} (sub_id={sub_id})')

    if skipped_rows:
        print(f'\n  --- Skipped ---')
        for name, reason in skipped_rows:
            print(f'    - {name!r}: {reason}')
        if any('EXPENSE_NAME_MAP' in r for _, r in skipped_rows):
            print('\n  → Add unmapped names to EXPENSE_NAME_MAP at the top of this script.')


# ── Step 3: Romanian local-market invoices ─────────────────────────────────────

def import_invoices(conn, dry_run):
    print('\n=== Romanian Local Market Invoices ===')
    print(f'  File: {INVOICES_FILE}')

    if not os.path.exists(INVOICES_FILE):
        print('  ERROR: file not found')
        return

    # Resolve שוק מקומי sub-category
    rows = db_query(conn,
        "SELECT id, expenses_category_id "
        "FROM expenses_sub_category WHERE TRIM(name) = 'שוק מקומי'")
    if not rows:
        print('  ERROR: sub-category "שוק מקומי" not found in DB')
        return
    sub_id  = str(rows[0][0])
    cat_id  = str(rows[0][1])
    print(f'  "שוק מקומי" → sub_id={sub_id}, cat_id={cat_id}')

    # Idempotency: if any invoice rows already exist for this sub-category, skip entirely
    existing_count = db_query(
        conn,
        f'SELECT COUNT(*) FROM expenses WHERE expenses_sub_category_id = %s',
        (sub_id,))[0][0]
    if existing_count > 0:
        print(f'  שוק מקומי already has {existing_count} expense rows — skipping.')
        print('  Run: DELETE FROM expenses WHERE expenses_sub_category_id = '
              f'{sub_id};  to reset.')
        return

    df = pd.read_excel(INVOICES_FILE, sheet_name=0, header=0)
    # Drop rows with no supplier
    df = df[df.iloc[:, INV_COL_SUPPLIER].apply(lambda v: bool(safe_str(v)))]
    print(f'  {len(df)} invoice rows to process')

    # Diagnostic column map
    print('\n  Column map (header | first data row):')
    for i, col in enumerate(df.columns):
        sample = safe_str(df.iloc[0, i]) if len(df) > 0 else '-'
        print(f'    col[{i}]  {col!r}  |  {sample!r}')
    print()

    inserted = []   # (supplier, amount_ron, date, nis_approx)
    skipped  = []   # (supplier, reason)

    for _, row in df.iterrows():
        supplier = safe_str(row.iloc[INV_COL_SUPPLIER], 45)
        if not supplier:
            continue

        amount = safe_decimal(row.iloc[INV_COL_AMOUNT]) if df.shape[1] > INV_COL_AMOUNT else None
        if not amount or amount <= 0:
            skipped.append((supplier, f'amount={amount}'))
            continue

        date_str = safe_date(row.iloc[INV_COL_DATE])    if df.shape[1] > INV_COL_DATE    else None
        desc     = safe_str(row.iloc[INV_COL_DESC], 45) if df.shape[1] > INV_COL_DESC    else None
        inv_num  = safe_str(row.iloc[INV_COL_INVOICE], 20) if df.shape[1] > INV_COL_INVOICE else None
        note1    = safe_str(row.iloc[INV_COL_NOTE1], 99) if df.shape[1] > INV_COL_NOTE1   else None
        note2    = safe_str(row.iloc[INV_COL_NOTE2], 99) if df.shape[1] > INV_COL_NOTE2   else None

        # Build notes: "חשבונית: XXXX | product desc | flags"
        notes_parts = [p for p in [
            f'חשבונית: {inv_num}' if inv_num else None,
            desc,
            note1,
            note2,
        ] if p]
        notes_str = ' | '.join(notes_parts)[:455] if notes_parts else None

        # "לא שולם!" flag = unpaid
        is_paid = 0 if (note1 and 'לא שולם' in note1) else 1

        nis_approx = str(round(amount * RON_TO_NIS))

        action_id = new_uuid()
        db_exec(conn, """
            INSERT INTO expenses
              (action_id, expenditure, payment_currency,
               expenses_category_id, expenses_sub_category_id,
               planned_payment_date, expenditure_ils,
               is_paid, actual_payment_date, is_unexpected, payment_date)
            VALUES (%s, %s, 'RON', %s, %s, %s, %s, %s, %s, 0, %s)
        """,
        (action_id,
         str(round(amount, 2)),
         cat_id, sub_id,
         date_str or '',
         nis_approx,
         is_paid,
         date_str or '' if is_paid else '',
         date_str or ''),
        dry_run,
        f"INSERT invoice: {supplier:<25}  {amount:>10.2f} RON  "
        f"(≈₪{nis_approx})  paid={is_paid}  {date_str or '-'}")

        inserted.append((supplier, amount, date_str, nis_approx))

    total_ron = sum(a for _, a, _, _ in inserted)
    total_nis = sum(int(n) for _, _, _, n in inserted if n.lstrip('-').isdigit())
    print(f'\n{"="*60}')
    print(f'  INVOICES INSERTED:  {len(inserted)}')
    print(f'  TOTAL RON:          {total_ron:,.2f} RON')
    print(f'  TOTAL NIS (approx): ₪{total_nis:,}')
    print(f'  SKIPPED:            {len(skipped)}')
    print(f'{"="*60}')
    if skipped:
        print(f'\n  --- Skipped ---')
        for sup, reason in skipped:
            print(f'    - {sup}: {reason}')
    print(f'\n  NOTE: RON → NIS at {RON_TO_NIS} (approximate).')
    print(f'        Update the exchange_rates table via the UI for accurate totals.')


# ── Step 4: income ─────────────────────────────────────────────────────────────

def import_income(conn, dry_run):
    print('\n=== Income (family payments aggregate) ===')

    # Idempotency: skip if income_category 1 already has rows
    existing = db_query(conn,
        "SELECT COUNT(*) FROM income WHERE expenses_category_id = '1'")[0][0]
    if existing > 0:
        print(f'  Income category 1 (תשלומי משפחות) already has {existing} rows — skipping.')
        print("  Run: DELETE FROM income WHERE expenses_category_id = '1';  to reset.")
        return

    # Sum families.total_amount (VARCHAR — parse manually)
    family_rows = db_query(conn,
        "SELECT family_name, total_amount FROM families "
        "WHERE total_amount IS NOT NULL AND TRIM(total_amount) != ''")
    print(f'  {len(family_rows)} families with total_amount')

    total_nis = 0.0
    parse_errors = []
    for fname, raw in family_rows:
        cleaned = re.sub(r'[,\s₪]', '', str(raw).strip())
        try:
            total_nis += float(cleaned)
        except (ValueError, TypeError):
            parse_errors.append((fname, raw))

    if parse_errors:
        print(f'  WARNING: could not parse total_amount for {len(parse_errors)} families:')
        for fn, t in parse_errors:
            print(f'    - {fn}: {t!r}')

    # Sum completed payments already in DB
    paid_rows  = db_query(conn,
        "SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed'")
    total_paid = float(paid_rows[0][0]) if paid_rows else 0.0

    pct_paid   = (total_paid / total_nis * 100) if total_nis > 0 else 0

    print(f'  Expected (families.total_amount sum): ₪{total_nis:,.0f}')
    print(f'  Received (payments, completed):       ₪{total_paid:,.0f}  ({pct_paid:.1f}%)')
    print(f'  Balance remaining:                    ₪{(total_nis - total_paid):,.0f}')

    if total_nis == 0:
        print('  Nothing to import (sum = 0). Run the families step first.')
        return

    # is_paid = 1 if ≥95% collected (accounts for minor rounding / discounts)
    is_paid   = 1 if total_paid >= total_nis * 0.95 else 0
    total_str = str(int(round(total_nis)))

    action_id = new_uuid()
    db_exec(conn, """
        INSERT INTO income
          (action_id, expenditure, payment_currency,
           expenses_category_id, expenses_sub_category_id,
           planned_payment_date, actual_payment_date,
           expenditure_ils, is_paid, description)
        VALUES (%s, %s, 'שקל', '1', NULL, '', '', %s, %s, 'תשלומי משפחות - פסח 2024')
    """,
    (action_id, total_str, total_str, is_paid),
    dry_run,
    f"INSERT income: ₪{total_nis:,.0f}  paid={'yes' if is_paid else 'partial'}")

    print(f'\n{"="*60}')
    print(f'  Income row created: ₪{total_nis:,.0f} (תשלומי משפחות - פסח 2024)')
    print(f'{"="*60}')


# ── Main ───────────────────────────────────────────────────────────────────────

VALID_STEPS = {'exchange_rates', 'budget', 'invoices', 'income'}

def main():
    parser = argparse.ArgumentParser(description='Import Pesach 2024 budget data')
    parser.add_argument('--vacation-id', required=True,
                        help='Vacation UUID with underscores')
    parser.add_argument('--dry-run', action='store_true',
                        help='Print what would happen, write nothing')
    parser.add_argument(
        '--steps',
        default='exchange_rates,budget,invoices,income',
        help='Comma-separated steps to run '
             '(default: exchange_rates,budget,invoices,income)')
    args = parser.parse_args()

    steps = [s.strip() for s in args.steps.split(',')]
    invalid = set(steps) - VALID_STEPS
    if invalid:
        print(f'ERROR: unknown steps: {invalid}')
        print(f'Valid steps: {VALID_STEPS}')
        sys.exit(1)

    print(f'\nImport Pesach 2024 budget  →  trip_tracker_{args.vacation_id}')
    print(f'Mode:  {"DRY RUN (no writes)" if args.dry_run else "LIVE"}')
    print(f'Steps: {steps}')

    conn = connect(args.vacation_id)
    try:
        if 'exchange_rates' in steps:
            import_exchange_rates(conn, args.dry_run)
        if 'budget' in steps:
            import_budget(conn, args.dry_run)
        if 'invoices' in steps:
            import_invoices(conn, args.dry_run)
        if 'income' in steps:
            import_income(conn, args.dry_run)

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
