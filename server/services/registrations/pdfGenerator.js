'use strict';

/**
 * generateRegistrationPdf — programmatic A4 RTL PDF using pdf-lib.
 *
 * Inputs:
 *   snapshot         — the form_data object built in registrationsService
 *                      (schema_version, signed_at_iso, client_inputs, display_snapshot)
 *   signatureDataUrl — "data:image/png;base64,<...>" produced by the client signature pad
 *   registrationId   — registration_requests.id (printed in the header for audit)
 *   signerIp         — for the signature audit footer
 *
 * Returns:  Buffer (the PDF bytes), ready to upload to R2.
 *
 * Hebrew + bidi:
 *   Empirical finding (one-shot side-by-side diagnostic PDF, since deleted):
 *   pdf-lib + Rubik + modern PDF viewers DO reorder pure-Hebrew runs on
 *   their own — passing logical-order codepoints reads correctly. But
 *   Hebrew strings that EMBED digits or Latin (dates, IBAN, prices, the
 *   masked phone, "מ-90 עד 60") render with the digit/Latin runs reversed
 *   ("500" → "005", "קיץ 2026" → "קיץ 6202"). The combination that worked
 *   for both kinds was: pure Hebrew RAW; mixed Hebrew+digit/Latin gets
 *   `naiveReverse(visual(text))`. That's what `smartHebrew()` does below.
 *
 * Multi-line bodies:
 *   drawWrappedRight honors '\n' as paragraph breaks. Each line is then
 *   greedy-wrapped to the page width independently. Source text can use real
 *   newlines (template literals) to lay out things like the bank-details block.
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const bidiFactory = require('bidi-js');
const logger = require('../../utils/logger');
const { TERMS_SECTIONS } = require('./staticTerms');

const bidi = bidiFactory();

const PAGE_WIDTH       = 595;
const PAGE_HEIGHT      = 842;
const MARGIN           = 40;
const USABLE_WIDTH     = PAGE_WIDTH - MARGIN * 2;

const FONT_REG_PATH    = path.join(__dirname, '..', '..', 'assets', 'fonts', 'Rubik-Regular.ttf');
const FONT_BOLD_PATH   = path.join(__dirname, '..', '..', 'assets', 'fonts', 'Rubik-Bold.ttf');
const LOGO_PATH        = path.join(__dirname, '..', '..', 'assets', 'avimor-logo.png');

// ─── bidi reordering ─────────────────────────────────────────────────────────

// Empirical findings (one-shot side-by-side diagnostic PDF, since deleted):
//   - Pure Hebrew (and Hebrew + neutral punctuation): the viewer DOES the
//     RTL pass for us — passing logical-order codepoints to drawText reads
//     correctly. RAW wins.
//   - Hebrew MIXED with digits or Latin chars: viewer-side bidi mis-orders
//     the digit/Latin runs (e.g. "500" appears as "005", "קיץ 2026" as
//     "קיץ 6202", "מ-90 עד 60" as "מ-09 עד 06"). The combo that proved
//     correct in the diagnostic PDF was BIDI then NAIVE — i.e.
//     naiveReverse(visual(text)).
//   - Pure digits / pure Latin / pure neutrals: RAW (no transform needed).
//
// `smartHebrew` is the single classifier applied at every drawText boundary.
// We don't hand-mark individual strings; the classifier inspects the chars
// and picks RAW or BIDI+NAIVE automatically.

// Hebrew block (U+0590–U+05FF) + Hebrew presentation forms (U+FB1D–U+FB4F).
const HEBREW_RE         = /[֐-׿יִ-ﭏ]/;
const DIGIT_OR_LATIN_RE = /[0-9A-Za-z]/;

const visual = (text) => {
  if (!text) return '';
  const s = String(text);
  const levels = bidi.getEmbeddingLevels(s, 'rtl');
  const segs   = bidi.getReorderSegments(s, levels);
  const chars  = [...s];
  for (const [start, end] of segs) {
    const slice = chars.slice(start, end + 1).reverse();
    for (let i = 0; i < slice.length; i++) chars[start + i] = slice[i];
  }
  return chars.join('');
};

const naiveReverse = (s) => [...String(s)].reverse().join('');

const smartHebrew = (text) => {
  if (text == null || text === '') return '';
  const s = String(text);
  const hasHeb            = HEBREW_RE.test(s);
  const hasDigitOrLatin   = DIGIT_OR_LATIN_RE.test(s);
  if (hasHeb && hasDigitOrLatin) return naiveReverse(visual(s));
  return s;
};

// ─── small formatting helpers ────────────────────────────────────────────────

const fmtMaskedPhone = (last4) => (last4 ? `****${last4}` : '—');

// Display date: accept ISO YYYY-MM-DD or DD/MM/YYYY; render DD/MM/YYYY.
const fmtDate = (v) => {
  if (!v) return '—';
  const s = String(v).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  const eu  = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (eu)  return s;
  return s;
};

const fmtDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fmtMoney = (v) => {
  if (v == null || v === '') return '—';
  const n = parseFloat(String(v).replace(/,/g, ''));
  if (Number.isNaN(n)) return String(v);
  return `₪${n.toLocaleString('en-US')}`;
};

const fmtOrDash = (v) => (v == null || v === '' ? '—' : String(v));

// ─── main exported function ──────────────────────────────────────────────────

const generateRegistrationPdf = async (snapshot, signatureDataUrl, registrationId, signerIp) => {
  if (!fs.existsSync(FONT_REG_PATH) || !fs.existsSync(FONT_BOLD_PATH)) {
    throw new Error(`Hebrew fonts missing under server/assets/fonts/ (expected Rubik-Regular.ttf + Rubik-Bold.ttf)`);
  }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const heb     = await pdfDoc.embedFont(fs.readFileSync(FONT_REG_PATH));
  const hebBold = await pdfDoc.embedFont(fs.readFileSync(FONT_BOLD_PATH));

  // Optional logo — non-fatal if missing.
  let logoImage = null, logoDims = null;
  if (fs.existsSync(LOGO_PATH)) {
    try {
      logoImage = await pdfDoc.embedPng(fs.readFileSync(LOGO_PATH));
      logoDims = { w: 70, h: (logoImage.height / logoImage.width) * 70 };
    } catch (e) {
      logger.warn(`pdfGenerator: failed to embed logo: ${e.message}`);
    }
  }

  // Colors
  const black     = rgb(0, 0, 0);
  const gray      = rgb(0.45, 0.50, 0.55);
  const lightGray = rgb(0.85, 0.86, 0.88);
  const primary   = rgb(0.13, 0.45, 0.60);

  // Font sizes
  const titleSize        = 18;
  const subTitleSize     = 11;
  const sectionTitleSize = 12;
  const labelSize        = 10;
  const valueSize        = 10;
  const bodySize         = 9;
  const smallSize        = 8;

  // Cursor state
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y    = PAGE_HEIGHT - 50;

  const newPage = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y    = PAGE_HEIGHT - 50;
  };
  const ensureSpace = (needed) => {
    if (y - needed < MARGIN + 30) newPage();
  };

  // ─── primitive drawers ────────────────────────────────────────────────────
  // Every drawText boundary runs the input through smartHebrew(), which:
  //   - leaves pure-Hebrew (and Hebrew+neutral-punctuation) strings RAW —
  //     the viewer's bidi handles them correctly,
  //   - applies naiveReverse(visual()) to strings that mix Hebrew with
  //     digits/Latin so embedded numbers/words don't read reversed,
  //   - leaves no-Hebrew strings RAW.
  // (See the long comment near the top of the file for the empirical
  //  findings that drove this.)

  const drawRight = (text, yPos, font, size, color = black) => {
    const s = smartHebrew(text);
    const w = font.widthOfTextAtSize(s, size);
    page.drawText(s, { x: PAGE_WIDTH - MARGIN - w, y: yPos, size, font, color });
  };

  const drawCenter = (text, yPos, font, size, color = black) => {
    const s = smartHebrew(text);
    const w = font.widthOfTextAtSize(s, size);
    page.drawText(s, { x: (PAGE_WIDTH - w) / 2, y: yPos, size, font, color });
  };

  const drawSeparator = () => {
    page.drawLine({
      start: { x: MARGIN, y },
      end:   { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.5,
      color: lightGray,
    });
    y -= 10;
  };

  const drawSectionTitle = (text) => {
    ensureSpace(40);
    y -= 4;
    drawRight(text, y, hebBold, sectionTitleSize, primary);
    y -= 8;
    drawSeparator();
  };

  const drawLabelValue = (label, value, { keepDash = false } = {}) => {
    if ((value == null || value === '') && !keepDash) return;
    ensureSpace(16);
    const labelText = smartHebrew(`${label}:`);
    const valueText = smartHebrew((value == null || value === '') ? '—' : String(value));
    const labelW = heb.widthOfTextAtSize(labelText, labelSize);
    const valueW = heb.widthOfTextAtSize(valueText, valueSize);
    page.drawText(labelText, { x: PAGE_WIDTH - MARGIN - labelW,             y, size: labelSize, font: heb, color: gray });
    page.drawText(valueText, { x: PAGE_WIDTH - MARGIN - labelW - 8 - valueW, y, size: valueSize, font: heb, color: black });
    y -= 14;
  };

  // Wrap a paragraph greedily, right-align each line. Honors '\n' in the
  // source as hard line breaks so the bank-details / list-style sections
  // in staticTerms.js lay out the way they're written. Each split paragraph
  // is independently word-wrapped to the page width.
  const drawWrappedRight = (text, font, size, color = black, maxWidth = USABLE_WIDTH) => {
    if (!text) return;
    const lineHeight = size + 4;

    const flushLine = (line) => {
      if (!line) {
        // Blank line in source — still consume vertical space.
        ensureSpace(lineHeight);
        y -= lineHeight;
        return;
      }
      ensureSpace(lineHeight);
      // Per-line classification: a wrap-line that's all Hebrew stays RAW,
      // a wrap-line that mixed digits/Latin into the Hebrew gets the
      // BIDI+NAIVE treatment. Wrap decisions (above) already used the same
      // character set so width measurements stay accurate.
      const out = smartHebrew(line);
      const w = font.widthOfTextAtSize(out, size);
      page.drawText(out, { x: PAGE_WIDTH - MARGIN - w, y, size, font, color });
      y -= lineHeight;
    };

    // Hard-split on \n first; word-wrap each paragraph.
    const paragraphs = String(text).split(/\n/);
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) {            // empty line in source → vertical gap
        flushLine('');
        continue;
      }
      const words = trimmed.split(/\s+/);
      let line = '';
      for (const w of words) {
        const candidate = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
          line = candidate;
        } else {
          flushLine(line);
          line = w;
        }
      }
      if (line) flushLine(line);
    }
  };

  // ─── 1. HEADER (logo on the right, title centered) ────────────────────────

  if (logoImage) {
    page.drawImage(logoImage, {
      x: PAGE_WIDTH - MARGIN - logoDims.w,
      y: y - logoDims.h + 6,
      width:  logoDims.w,
      height: logoDims.h,
    });
  }

  drawCenter('טופס רישום לחופשה', y - 6, hebBold, titleSize, primary);
  y -= 30;

  const vacName = snapshot.display_snapshot?.vacation_name || '';
  if (vacName) {
    drawCenter(vacName, y, heb, subTitleSize, gray);
    y -= 16;
  }

  const headerRight = `מסמך #${registrationId || '—'}  ·  נחתם: ${fmtDateTime(snapshot.signed_at_iso)}`;
  drawRight(headerRight, y, heb, smallSize, gray);
  y -= 16;
  drawSeparator();

  // ─── 2. FAMILY SUMMARY ────────────────────────────────────────────────────

  drawSectionTitle('פרטי המשפחה');
  const ds = snapshot.display_snapshot || {};
  drawLabelValue('שם משפחה / קבוצה', ds.family_name);
  drawLabelValue('ראש משפחה',         ds.head_first_name);
  drawLabelValue('טלפון',             fmtMaskedPhone(ds.head_phone_last4));
  drawLabelValue('תאריך התחלה',       fmtDate(ds.stay_start_date), { keepDash: true });
  drawLabelValue('תאריך סיום',        fmtDate(ds.stay_end_date),   { keepDash: true });
  drawLabelValue('כמות חדרים',        ds.rooms_requested);
  drawLabelValue('סך הנופשים',        ds.total_guests);

  const infants = ds.infants_under_2 || { count: 0, parse_warnings: [] };
  drawLabelValue('תינוקות עד גיל 2', infants.count, { keepDash: true });
  if (infants.parse_warnings && infants.parse_warnings.length > 0) {
    ensureSpace(14);
    const warn = `* ייתכן חוסר בתינוקות — תאריכי לידה חסרים/שגויים עבור ${infants.parse_warnings.length} נופשים.`;
    drawRight(warn, y, heb, smallSize, gray);
    y -= 14;
  }

  // ─── 3. PAYMENT BLOCK ─────────────────────────────────────────────────────

  drawSectionTitle('פרטי תשלום');
  drawLabelValue('סכום עסקה',    fmtMoney(ds.total_amount),    { keepDash: true });
  drawLabelValue('צורת תשלום',   fmtOrDash(ds.payment_method), { keepDash: true });
  drawLabelValue('מספר תשלומים', fmtOrDash(ds.num_payments),   { keepDash: true });

  // ─── 4. CLIENT-PROVIDED DETAILS ───────────────────────────────────────────

  drawSectionTitle('פרטים נוספים');
  const ci = snapshot.client_inputs || {};
  drawLabelValue('כתובת',  ci.address);
  drawLabelValue('עיר',    ci.city);
  drawLabelValue('מיקוד',  ci.postal_code);
  if (ci.general_notes) {
    ensureSpace(16);
    drawRight('הערות:', y, heb, labelSize, gray);
    y -= 14;
    drawWrappedRight(ci.general_notes, heb, bodySize, black);
  }

  // ─── 5. STATIC TERMS ──────────────────────────────────────────────────────

  drawSectionTitle('תנאים והסכמות');
  // {{vacationName}} is the only placeholder in the static terms today
  // (used in section 2's bank-transfer reference line). Fallback to "הנופש"
  // when missing so the sentence still reads cleanly.
  const termsVacName = vacName || 'הנופש';
  for (const section of TERMS_SECTIONS) {
    ensureSpace(32);
    drawRight(section.title, y, hebBold, labelSize, black);
    y -= 14;
    const body = section.body.split('{{vacationName}}').join(termsVacName);
    drawWrappedRight(body, heb, bodySize, gray);
    y -= 6;
  }

  // ─── 6. SIGNATURE ─────────────────────────────────────────────────────────

  ensureSpace(160);
  drawSectionTitle('חתימה');

  try {
    const base64 = (signatureDataUrl || '').split(',')[1];
    if (base64) {
      const sigBytes = Buffer.from(base64, 'base64');
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigW = 140;
      const sigH = (sigImage.height / sigImage.width) * sigW;
      page.drawImage(sigImage, {
        x: PAGE_WIDTH - MARGIN - sigW,
        y: y - sigH,
        width:  sigW,
        height: sigH,
      });
      y -= (sigH + 8);
    }
  } catch (err) {
    logger.error(`pdfGenerator: failed to embed signature: ${err.message}`);
    y -= 30;
  }

  drawLabelValue('חתום על ידי',  ds.head_first_name);
  drawLabelValue('תאריך חתימה', fmtDateTime(snapshot.signed_at_iso));
  drawLabelValue('כתובת IP',     signerIp || '—', { keepDash: true });

  ensureSpace(16);
  const verifyNote = `אומת באמצעות 4 ספרות אחרונות של מספר הטלפון (${fmtMaskedPhone(ds.head_phone_last4)}).`;
  drawRight(verifyNote, y, heb, smallSize, gray);
  y -= 14;

  const footer = smartHebrew('מסמך זה נחתם דיגיטלית.');
  const footerW = heb.widthOfTextAtSize(footer, smallSize);
  page.drawText(footer, { x: (PAGE_WIDTH - footerW) / 2, y: MARGIN, size: smallSize, font: heb, color: gray });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
};

module.exports = { generateRegistrationPdf };
