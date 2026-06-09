import React from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useStyles, STATUS_CONFIG } from "./Leads.style";
import { toLocalYMD } from "../../../utils/helpers/formatDate";

// Local YYYY-MM-DD (no UTC day-shift) shown as DD/MM/YYYY.
const formatDate = (v) => {
  const s = toLocalYMD(v);
  if (!s) return "—";
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

const formatTimestamp = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// Money for display: thousands separators, drop trailing .00 when whole (e.g.
// "12000.00" -> "12,000"). Keeps the ₪ symbol; "—" when empty.
const formatMoney = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  return `${n.toLocaleString("he-IL", { maximumFractionDigits: 2 })} ₪`;
};

// Name columns. New leads carry first_name/last_name; legacy leads created
// before the name split have only full_name (both parts null). In that case
// fall back to showing full_name under שם פרטי so old rows are never blank.
// A lead with only one part shows "—" for the missing side.
const nameParts = (lead) => {
  const first = lead.first_name?.trim();
  const last = lead.last_name?.trim();
  if (!first && !last) return { first: lead.full_name || "—", last: "—" };
  return { first: first || "—", last: last || "—" };
};

const buildStatusOptions = (dueCount) => [
  { value: "all", label: "כל הסטטוסים" },
  { value: "followup_due", label: `לפולואפ היום${dueCount ? ` (${dueCount})` : ""}` },
  { value: "new_interest", label: "חדש" },
  { value: "follow_up", label: "בתהליך" },
  { value: "registered", label: "נסגר" },
  { value: "not_relevant", label: "לא רלוונטי" },
];

// Lead-quality (השתלמות) filter options. "all" = no filter; the rest match the
// dropdown values stored on the lead's `training` column.
const TRAINING_FILTER_OPTIONS = [
  { value: "all", label: "כל ההשתלמויות" },
  { value: "גבוה", label: "גבוה" },
  { value: "סטנדרט", label: "סטנדרט" },
  { value: "נמוך", label: "נמוך" },
  { value: "סוף רישום", label: "סוף רישום" },
];

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { bg: "#f1f5f9", color: "#64748b", label: status };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: 600,
      background: config.bg,
      color: config.color,
    }}>
      {config.label}
    </span>
  );
}

const headers = [
  "שם פרטי", "שם משפחה", "טלפון", "אימייל", "סטטוס",
  "פולואפ", "תאריך עדכון אחרון",
  "מחיר שקיבל", "הנחה", "השתלמות", "הרכב",
  "הערות",
];

const truncate = (s, max = 50) => {
  if (!s) return "—";
  const str = String(s);
  return str.length > max ? `${str.slice(0, max)}…` : str;
};

// Color config for the summary strip's "total" card — same teal the app uses
// for primary actions; the per-status cards reuse STATUS_CONFIG so they
// visually align with the table badges.
const TOTAL_CARD = { bg: "#f0fdfa", color: "#0d9488", label: 'סה"כ' };

const SUMMARY_ITEMS = [
  { key: "total",        ...TOTAL_CARD },
  { key: "new_interest", ...STATUS_CONFIG.new_interest },
  { key: "follow_up",    ...STATUS_CONFIG.follow_up },
  { key: "registered",   ...STATUS_CONFIG.registered },
  { key: "not_relevant", ...STATUS_CONFIG.not_relevant },
];

function SummaryStrip({ counts }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        padding: "10px 16px 0",
      }}
    >
      {SUMMARY_ITEMS.map((item) => (
        <Box
          key={item.key}
          sx={{
            backgroundColor: item.bg,
            color: item.color,
            borderRadius: "10px",
            padding: "6px 14px",
            minWidth: "88px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid",
            borderColor: `${item.color}22`,
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 600, opacity: 0.85 }}>
            {item.label}
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>
            {counts[item.key] ?? 0}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function LeadsView({
  filteredLeads,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedTraining,
  setSelectedTraining,
  handleAddClick,
  handleRowClick,
  handleImportClick,
  handleFileChange,
  importing,
  fileInputRef,
  dueCount,
  isOverdue,
  isDueToday,
  statusCounts,
  handleExportToExcel,
}) {
  const classes = useStyles();
  const statusOptions = buildStatusOptions(dueCount);
  const totalCount = statusCounts?.total || 0;

  return (
    <Grid>
      <SummaryStrip counts={statusCounts || {}} />

      <Grid style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px 8px",
        gap: "8px",
      }}>
        <Grid style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button className={classes.addButton} onClick={handleAddClick}>
            + הוסף ליד
          </Button>
          <Button
            className={classes.importButton}
            onClick={handleImportClick}
            disabled={importing}
            startIcon={<UploadFileIcon style={{ fontSize: "16px" }} />}
          >
            {importing ? "מייבא…" : "ייבוא לידים מאקסל"}
          </Button>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Grid>

        <Grid style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FormControl size="small">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ fontSize: 12, borderRadius: "8px", minWidth: "150px", height: "32px" }}
            >
              {statusOptions.map((s) => (
                <MenuItem key={s.value} value={s.value} style={{ fontSize: 12 }}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={selectedTraining}
              onChange={(e) => setSelectedTraining(e.target.value)}
              style={{ fontSize: 12, borderRadius: "8px", minWidth: "150px", height: "32px" }}
            >
              {TRAINING_FILTER_OPTIONS.map((t) => (
                <MenuItem key={t.value} value={t.value} style={{ fontSize: 12 }}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="חיפוש..."
            className={classes.textField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon style={{ color: "#0d9488", fontSize: "18px" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Export ALL leads to a Hebrew RTL .xlsx. Separated by extra margin,
              disabled when there's nothing to export. */}
          <Button
            className={classes.importButton}
            onClick={handleExportToExcel}
            disabled={totalCount === 0}
            startIcon={<FileDownloadIcon style={{ fontSize: "16px" }} />}
            style={{ marginInlineStart: "12px" }}
          >
            ייצוא לאקסל
          </Button>
        </Grid>
      </Grid>

      <TableContainer style={{ overflow: "visible" }}>
        <Table style={{ width: "inherit" }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map((h, i) => (
                <TableCell key={i} className={classes.headerTableRow} style={{ textAlign: "center" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={classes.dataTableBody}>
            {filteredLeads?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, padding: "32px" }}>
                  אין לידים להצגה
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads?.map((lead, index) => {
                const overdue  = isOverdue?.(lead);
                const dueToday = isDueToday?.(lead);
                // Highlight wins over the follow-up colours: a 'new'/'returning'
                // row keeps its colour until the coordinator opens it (clears to
                // 'none'); only then do the overdue / due-today colours show.
                const rowClass =
                  lead.highlight === "new"
                    ? classes.newRow
                    : lead.highlight === "returning"
                      ? classes.returningRow
                      : overdue
                        ? classes.overdueRow
                        : dueToday
                          ? classes.dueTodayRow
                          : undefined;
                return (
                  <TableRow
                    key={lead.lead_id || index}
                    className={rowClass}
                    onClick={() => handleRowClick(lead)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className={classes.dataTableCell} style={{ whiteSpace: "nowrap" }}>{nameParts(lead).first}</TableCell>
                    <TableCell className={classes.dataTableCell} style={{ whiteSpace: "nowrap" }}>{nameParts(lead).last}</TableCell>
                    <TableCell className={classes.dataTableCell}>{lead.phone || "—"}</TableCell>
                    <TableCell className={classes.dataTableCell} title={lead.email || ""}>{lead.email || "—"}</TableCell>
                    <TableCell className={classes.dataTableCell}>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell
                      className={classes.dataTableCell}
                      style={
                        overdue
                          ? { color: "#dc2626", fontWeight: 600 }
                          : dueToday
                            ? { color: "#b45309", fontWeight: 600 }
                            : undefined
                      }
                    >
                      {formatDate(lead.followup_date)}
                    </TableCell>
                    <TableCell className={classes.dataTableCell} style={{ whiteSpace: "nowrap" }}>{formatTimestamp(lead.updated_at)}</TableCell>
                    <TableCell className={classes.dataTableCell}>{formatMoney(lead.price)}</TableCell>
                    <TableCell className={classes.dataTableCell}>{formatMoney(lead.discount)}</TableCell>
                    <TableCell className={classes.dataTableCell}>{lead.training || "—"}</TableCell>
                    <TableCell className={classes.dataTableCell}>{lead.composition || "—"}</TableCell>
                    <TableCell
                      className={classes.dataTableCell}
                      style={{ maxWidth: "220px", whiteSpace: "normal", textAlign: "right" }}
                      title={lead.last_note || lead.notes || ""}
                    >
                      {truncate(lead.last_note || lead.notes)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default LeadsView;
