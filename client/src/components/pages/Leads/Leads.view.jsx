import React from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useStyles, STATUS_CONFIG } from "./Leads.style";

const formatDate = (v) => {
  if (!v) return "—";
  const s = String(v).slice(0, 10);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : s;
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
  "שם", "טלפון", "סטטוס",
  "פולואפ", "תאריך פתיחת ליד", "תאריך עדכון אחרון",
  "מחיר שקיבל", "הנחה", "השתלמות", "הרכב",
  "הערות",
];

const truncate = (s, max = 50) => {
  if (!s) return "—";
  const str = String(s);
  return str.length > max ? `${str.slice(0, max)}…` : str;
};

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
}) {
  const classes = useStyles();
  const statusOptions = buildStatusOptions(dueCount);

  return (
    <Grid>
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
                return (
                  <TableRow
                    key={lead.lead_id || index}
                    className={due ? classes.dueRow : undefined}
                    onClick={() => handleRowClick(lead)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className={classes.dataTableCell}>{lead.full_name}</TableCell>
                    <TableCell className={classes.dataTableCell}>{lead.phone || "—"}</TableCell>
                    <TableCell className={classes.dataTableCell}>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className={classes.dataTableCell} style={due ? { color: "#dc2626", fontWeight: 600 } : undefined}>
                      {formatDate(lead.followup_date)}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>{formatDate(lead.last_contact_date)}</TableCell>
                    <TableCell className={classes.dataTableCell} style={{ whiteSpace: "nowrap" }}>{formatTimestamp(lead.updated_at)}</TableCell>
                    <TableCell className={classes.dataTableCell}>{lead.price != null ? `${lead.price} ₪` : "—"}</TableCell>
                    <TableCell className={classes.dataTableCell}>{lead.discount != null ? `${lead.discount} ₪` : "—"}</TableCell>
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
