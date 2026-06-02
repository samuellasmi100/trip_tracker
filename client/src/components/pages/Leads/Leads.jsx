import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import LeadsView from "./Leads.view";
import LeadDetailPanel from "./LeadDetailPanel";
import EditOrUpdateDialog from "../../shared/EditDialog/EditOrUpdateDialog";
import { useDispatch, useSelector } from "react-redux";
import * as leadsSlice from "../../../store/slices/leadsSlice";
import * as staticSlice from "../../../store/slices/staticSlice";
import * as snackBarSlice from "../../../store/slices/snackbarSlice";
import ApiLeads from "../../../apis/leadsRequest";
import { connectSocket } from "../../../utils/socketService";
import { toLocalYMD, todayLocalYMD } from "../../../utils/helpers/formatDate";

// ─── Excel import helpers ───────────────────────────────────────────────────

// File header (Hebrew) → DB column. Matched after header normalization
// (strip BiDi marks / zero-width spaces / collapse whitespace) so common
// Excel-typed headers like "‏הערות" or "הערות " still match.
const HEADER_MAP = {
  "שם פרטי":          "first_name",
  "שם משפחה":         "last_name",
  "טלפון הפונה":       "phone",
  // Email column header — the abbreviation marker is the Hebrew gershayim
  // (U+05F4) in most Excel files but typists sometimes use a straight ASCII
  // double quote (U+0022). normalizeHeaderText folds U+05F4 → " so either
  // variant lands on this same key.
  'דוא"ל הפונה':       "email",
  "סטטוס ראשי":        "status_he",
  "פולאפ ל":           "followup_date",
  "מחיר שקיבל":        "price",
  "כמות הנחה":         "discount",
  "השתלמות":           "training",
  "הרכב":              "composition",
  "הערות":             "notes",
};

// Strip invisible BiDi / format / zero-width characters Excel sneaks into
// RTL headers and cell values, then collapse internal whitespace and trim.
// Covers: ZWSP/ZWNJ/ZWJ (U+200B–U+200D), LRM/RLM (U+200E–U+200F),
// LRE/RLE/PDF/LRO/RLO (U+202A–U+202E), LRI/RLI/FSI/PDI (U+2066–U+2069),
// and BOM (U+FEFF).
const INVISIBLE_RE = /[​-‏‪-‮⁦-⁩﻿]/g;
// Fold Hebrew gershayim (U+05F4) → " and geresh (U+05F3) → ' so abbreviations
// like דוא״ל / דוא"ל both normalize to the same key in HEADER_MAP.
const normalizeHeaderText = (s) =>
  String(s ?? "")
    .replace(INVISIBLE_RE, "")
    .replace(/״/g, '"')
    .replace(/׳/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const HEADER_LOOKUP = Object.fromEntries(
  Object.entries(HEADER_MAP).map(([he, key]) => [normalizeHeaderText(he), key])
);

const STATUS_MAP = {
  "חדש":         "new_interest",
  "בתהליך":      "follow_up",
  "לא רלוונטי":   "not_relevant",
  "נסגר":         "registered",
};

// Mirror server normalizePhone — digits-only; restore the leading 0 on
// 9-digit Israeli mobiles that Excel coerced to a number.
const normalizePhone = (raw) => {
  if (raw == null) return null;
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 9 && digits.startsWith("5")) return `0${digits}`;
  return digits;
};

// Parse Excel cell to 'YYYY-MM-DD'. Handles D.M.YY / DD.MM.YYYY (the file's
// format) plus ISO + DD/MM/YYYY, and Excel date serials returned as numbers.
const parseExcelDate = (raw) => {
  if (raw == null || raw === "") return null;

  if (raw instanceof Date) {
    return raw.toISOString().slice(0, 10);
  }
  if (typeof raw === "number") {
    // Excel serial (cellDates:false path). Use SheetJS's own parser if available.
    const dt = XLSX.SSF?.parse_date_code?.(raw);
    if (dt && dt.y) {
      const m = String(dt.m).padStart(2, "0");
      const d = String(dt.d).padStart(2, "0");
      return `${dt.y}-${m}-${d}`;
    }
    return null;
  }

  const s = String(raw).trim();
  if (!s) return null;

  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/);
  if (m) {
    const d = m[1].padStart(2, "0");
    const mo = m[2].padStart(2, "0");
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${mo}-${d}`;
  }
  return null;
};

const parseNumber = (raw) => {
  if (raw == null || raw === "") return null;
  const cleaned = String(raw).replace(/[^\d.\-]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const cleanString = (raw) => {
  if (raw == null) return null;
  const s = String(raw).trim();
  return s === "" ? null : s;
};

// Defensively expand the worksheet's !ref to cover every cell key that
// actually exists. Excel occasionally writes a !ref that's narrower than the
// real used range — sheet_to_json then silently drops the rightmost columns
// (which is exactly the slot the notes column sits in here, column K).
const expandWorksheetRange = (ws) => {
  const baseRef = ws["!ref"];
  const range = baseRef
    ? XLSX.utils.decode_range(baseRef)
    : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
  for (const key of Object.keys(ws)) {
    if (key[0] === "!") continue;
    const cell = XLSX.utils.decode_cell(key);
    if (cell.r > range.e.r) range.e.r = cell.r;
    if (cell.c > range.e.c) range.e.c = cell.c;
    if (cell.r < range.s.r) range.s.r = cell.r;
    if (cell.c < range.s.c) range.s.c = cell.c;
  }
  const newRef = XLSX.utils.encode_range(range);
  ws["!ref"] = newRef;
  return { before: baseRef, after: newRef };
};

// Parse a .xlsx file → array of normalized lead row objects ready for upload.
const parseLeadsWorkbook = async (file) => {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const ws = wb.Sheets["Sheet1"] || wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("הקובץ לא מכיל גיליון Sheet1");

  expandWorksheetRange(ws);

  const raw = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
  if (!raw.length) throw new Error("לא נמצאו שורות בקובץ");

  const out = [];
  for (const r of raw) {
    // Remap by walking each row's actual headers and normalizing them.
    const m = {};
    for (const [rawKey, value] of Object.entries(r)) {
      const key = HEADER_LOOKUP[normalizeHeaderText(rawKey)];
      if (key) m[key] = value;
    }

    const firstName = cleanString(m.first_name) || "";
    const lastName  = cleanString(m.last_name)  || "";
    const phone     = normalizePhone(m.phone);

    // "Row is real only if it has a first name OR a phone."
    if (!firstName && !phone) continue;

    const fullName = `${firstName} ${lastName}`.trim() || phone || "ללא שם";
    // Also normalize the status cell — Excel sometimes leaves an RLM/LRM
    // around values typed into RTL columns, which would block STATUS_MAP.
    const statusHe = normalizeHeaderText(m.status_he) || null;

    out.push({
      full_name:         fullName,
      phone:             phone,
      email:             cleanString(m.email),
      status:            STATUS_MAP[statusHe] || "new_interest",
      notes:             cleanString(m.notes),
      followup_date:     parseExcelDate(m.followup_date),
      price:             parseNumber(m.price),
      discount:          parseNumber(m.discount),
      training:          cleanString(m.training),
      composition:       cleanString(m.composition),
    });
  }
  return out;
};

// Edit form: the DB returns DECIMAL as e.g. "100000.00". Reduce price/discount
// to a clean number string ("100000", "100000.5") when loading a lead to edit,
// so the money inputs don't show a trailing .00; formatMoneyInput (in the form)
// then adds the thousands separators. Live typing is unaffected.
const cleanMoney = (v) => {
  if (v === null || v === undefined || v === "") return v;
  const n = Number(v);
  return Number.isNaN(n) ? v : String(n);
};

// ─── Component ──────────────────────────────────────────────────────────────

const Leads = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const leads = useSelector((state) => state.leadsSlice.leads);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const fileInputRef = useRef(null);

  const getAllLeads = async () => {
    try {
      const response = await ApiLeads.getAll(token, vacationId);
      dispatch(leadsSlice.updateLeadsList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllLeads();
  }, [vacationId]);

  // Live grid update: when a public lead arrives for the CURRENTLY selected
  // vacation, re-fetch so the new row shows without a manual refresh. We
  // re-fetch (not build a row from the socket payload) because new_lead is a
  // notification — it lacks lead columns the grid renders (phone, email,
  // status, notes, financials); re-fetch is also inherently duplicate-free
  // (updateLeadsList replaces the list) and keeps the summary counts in sync.
  // Filtered by vacation_id so another vacation's lead never appears here.
  //
  // Use connectSocket(token) (not getSocket()) to match FamilyList/Documents:
  // child effects run BEFORE App.jsx's connectSocket on initial mount, so
  // getSocket() would return null here and the listener would never attach.
  // connectSocket is idempotent — App.jsx and this component share the one
  // socket singleton. Own handler reference + off(handler) leaves App.jsx's
  // bell/snackbar listener on the same event intact.
  useEffect(() => {
    if (!vacationId || !token) return;
    const socket = connectSocket(token);
    if (!socket) return;
    const onNewLead = (notification) => {
      if (String(notification?.vacation_id) === String(vacationId)) {
        getAllLeads();
      }
    };
    socket.on("new_lead", onNewLead);
    return () => socket.off("new_lead", onNewLead);
  }, [vacationId, token]);

  const today = todayLocalYMD();
  const isDue = (lead) =>
    lead.followup_date &&
    Number(lead.is_active) === 1 &&
    toLocalYMD(lead.followup_date) <= today;

  const filteredLeads = leads?.filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      lead.full_name?.includes(searchTerm) ||
      lead.phone?.includes(searchTerm);
    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "followup_due"
          ? isDue(lead)
          : lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const dueCount = leads?.filter(isDue).length || 0;

  // Live status breakdown derived from the Redux list — updates for free on
  // every create/update/delete/import. Order matches the visual strip.
  const statusCounts = {
    total:        leads?.length || 0,
    new_interest: leads?.filter((l) => l.status === "new_interest").length || 0,
    follow_up:    leads?.filter((l) => l.status === "follow_up").length || 0,
    registered:   leads?.filter((l) => l.status === "registered").length || 0,
    not_relevant: leads?.filter((l) => l.status === "not_relevant").length || 0,
  };

  const handleImportClick = () => {
    if (!vacationId) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "לא נבחרה חופשה", timeout: 4000 }));
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so the same file can be re-selected later
    if (!file) return;
    if (!/\.xlsx?$/i.test(file.name)) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "יש לבחור קובץ Excel (.xlsx)", timeout: 4000 }));
      return;
    }

    setImporting(true);
    try {
      const rows = await parseLeadsWorkbook(file);
      if (!rows.length) {
        dispatch(snackBarSlice.setSnackBar({ type: "error", message: "לא נמצאו שורות תקינות לייבוא", timeout: 4000 }));
        return;
      }
      const response = await ApiLeads.importRows(token, vacationId, rows);
      const { created = 0, updated = 0, skipped = 0, leads: refreshed } = response.data || {};
      if (refreshed) dispatch(leadsSlice.updateLeadsList(refreshed));

      if (created === 0 && updated === 0) {
        dispatch(snackBarSlice.setSnackBar({ type: "success", message: "כל הנתונים כבר מעודכנים במערכת", timeout: 4000 }));
      } else {
        dispatch(snackBarSlice.setSnackBar({
          type: "success",
          message: `יובאו ${created} לידים חדשים, עודכנו ${updated}, דולגו ${skipped}`,
          timeout: 5000,
        }));
      }
    } catch (err) {
      console.log(err);
      const msg = err?.message?.startsWith("הקובץ") || err?.message?.startsWith("לא נמצאו")
        ? err.message
        : "ייבוא הלידים נכשל, בדוק את הקובץ ונסה שוב";
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: msg, timeout: 5000 }));
    } finally {
      setImporting(false);
    }
  };

  const handleAddClick = () => {
    dispatch(staticSlice.updateForm({ status: "new_interest", source: "phone" }));
    dispatch(staticSlice.updateDetailsModalType("addLead"));
    dispatch(staticSlice.openDetailsModal());
  };

  const handleEditClick = (lead) => {
    dispatch(staticSlice.updateForm({
      ...lead,
      price: cleanMoney(lead.price),
      discount: cleanMoney(lead.discount),
    }));
    dispatch(staticSlice.updateDetailsModalType("editLead"));
    dispatch(staticSlice.openDetailsModal());
  };

  const handleRowClick = (lead) => {
    setSelectedLeadId(lead.lead_id);
    // Opening a highlighted lead marks it "seen": clear the colour locally for
    // instant feedback and persist it server-side (survives refresh). The clear
    // does not bump updated_at.
    if (lead.highlight && lead.highlight !== "none") {
      dispatch(leadsSlice.clearHighlight(lead.lead_id));
      ApiLeads.markSeen(token, vacationId, lead.lead_id).catch((e) => console.log(e));
    }
  };

  // Delete with NO confirmation here — the LeadDetailPanel runs its own styled
  // confirmation dialog before invoking this. No window.confirm in the leads flow.
  const deleteLead = async (lead) => {
    try {
      const response = await ApiLeads.deleteLead(token, vacationId, lead.lead_id);
      dispatch(leadsSlice.updateLeadsList(response.data));
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מחיקת הליד נכשלה, נסה שוב", timeout: 4000 }));
    }
  };

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  // Bulk wipe — invoked from the styled confirm dialog. Server returns the
  // (now empty) updated list, same pattern as the single-lead delete.
  const handleDeleteAllConfirm = async () => {
    setDeletingAll(true);
    try {
      const response = await ApiLeads.deleteAll(token, vacationId);
      dispatch(leadsSlice.updateLeadsList(response.data));
      dispatch(snackBarSlice.setSnackBar({
        type: "success",
        message: "כל הלידים נמחקו",
        timeout: 4000,
      }));
      setDeleteAllOpen(false);
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({
        type: "error",
        message: "מחיקת כל הלידים נכשלה, נסה שוב",
        timeout: 4000,
      }));
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <>
      <LeadsView
        filteredLeads={filteredLeads}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleAddClick={handleAddClick}
        handleRowClick={handleRowClick}
        handleImportClick={handleImportClick}
        handleFileChange={handleFileChange}
        importing={importing}
        fileInputRef={fileInputRef}
        dueCount={dueCount}
        isDue={isDue}
        statusCounts={statusCounts}
        onRequestDeleteAll={() => setDeleteAllOpen(true)}
        deleteAllOpen={deleteAllOpen}
        deletingAll={deletingAll}
        onCancelDeleteAll={() => setDeleteAllOpen(false)}
        onConfirmDeleteAll={handleDeleteAllConfirm}
      />

      <EditOrUpdateDialog
        detailsDialogOpen={detailsDialogOpen}
        closeDetailsModal={closeDetailsModal}
      />

      <LeadDetailPanel
        selectedLeadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onOpenFullEdit={(lead) => {
          setSelectedLeadId(null);
          handleEditClick(lead);
        }}
        onDelete={async (lead) => {
          await deleteLead(lead);
          setSelectedLeadId(null);
        }}
      />
    </>
  );
};

export default Leads;
