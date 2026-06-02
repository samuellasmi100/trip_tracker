import React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
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

const buildStatusOptions = (dueCount) => [
  { value: "all", label: "כל הסטטוסים" },
  { value: "followup_due", label: `לפולואפ היום${dueCount ? ` (${dueCount})` : ""}` },
  { value: "new_interest", label: "חדש" },
  { value: "follow_up", label: "בתהליך" },
  { value: "registered", label: "נסגר" },
  { value: "not_relevant", label: "לא רלוונטי" },
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
  "שם", "טלפון", "אימייל", "סטטוס",
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
  handleAddClick,
  handleRowClick,
  handleImportClick,
  handleFileChange,
  importing,
  fileInputRef,
  dueCount,
  isDue,
  statusCounts,
  onRequestDeleteAll,
  deleteAllOpen,
  deletingAll,
  onCancelDeleteAll,
  onConfirmDeleteAll,
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

          {/* Destructive action — icon-only, separated by extra margin, red
              border. Disabled when there's nothing to delete. */}
          <Tooltip title={totalCount === 0 ? "אין לידים למחיקה" : "מחיקת כל הלידים"}>
            <span style={{ marginInlineStart: "12px" }}>
              <IconButton
                size="small"
                onClick={onRequestDeleteAll}
                disabled={totalCount === 0}
                sx={{
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  borderRadius: "8px",
                  padding: "5px",
                  "&:hover": { backgroundColor: "#fef2f2", borderColor: "#dc2626" },
                  "&.Mui-disabled": { opacity: 0.4, color: "#94a3b8", borderColor: "#e2e8f0" },
                }}
              >
                <DeleteIcon style={{ fontSize: "18px" }} />
              </IconButton>
            </span>
          </Tooltip>
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
                const due = isDue?.(lead);
                // Highlight wins over due: a 'new'/'returning' row keeps its
                // colour until the coordinator opens it (clears to 'none'); only
                // then does the follow-up-due colour show.
                const rowClass =
                  lead.highlight === "new"
                    ? classes.newRow
                    : lead.highlight === "returning"
                      ? classes.returningRow
                      : due
                        ? classes.dueRow
                        : undefined;
                return (
                  <TableRow
                    key={lead.lead_id || index}
                    className={rowClass}
                    onClick={() => handleRowClick(lead)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className={classes.dataTableCell}>{lead.full_name}</TableCell>
                    <TableCell className={classes.dataTableCell}>{lead.phone || "—"}</TableCell>
                    <TableCell className={classes.dataTableCell} title={lead.email || ""}>{lead.email || "—"}</TableCell>
                    <TableCell className={classes.dataTableCell}>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className={classes.dataTableCell} style={due ? { color: "#dc2626", fontWeight: 600 } : undefined}>
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

      {/* Bulk-delete confirmation — mirrors the styled confirm in
          LeadDetailPanel: 14px Paper, RTL, DeleteOutline icon + bottom-bordered
          title, info Box with the count, and destructive red confirm. */}
      <Dialog
        open={!!deleteAllOpen}
        onClose={deletingAll ? undefined : onCancelDeleteAll}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", direction: "rtl" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 1,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <DeleteIcon sx={{ fontSize: 20, color: "#dc2626" }} />
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
            מחיקת כל הלידים
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#991b1b" }}>
              {`מחיקת כל ${totalCount} הלידים — לא ניתן לשחזר`}
            </Typography>
            <Typography variant="caption" sx={{ color: "#7f1d1d" }}>
              כל הלידים, ההערות והפולואפים של חופשה זו יימחקו לצמיתות.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#475569" }}>
            פעולה זו משפיעה רק על החופשה הנוכחית. להמשיך?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={onCancelDeleteAll}
            disabled={deletingAll}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={onConfirmDeleteAll}
            disabled={deletingAll}
            sx={{
              textTransform: "none",
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            {deletingAll ? "מוחק..." : "מחק הכל"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default LeadsView;
