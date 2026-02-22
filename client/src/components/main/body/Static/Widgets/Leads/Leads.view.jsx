import React from "react";
import {
  Grid,
  IconButton,
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
import EditIcon from "@mui/icons-material/Edit";
import NotesIcon from "@mui/icons-material/Notes";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useStyles, STATUS_CONFIG } from "./Leads.style";

const ALL_STATUSES = [
  { value: "all", label: "כל הסטטוסים" },
  { value: "new_interest", label: "ליד חדש" },
  { value: "no_answer", label: "לא ענה" },
  { value: "follow_up", label: "בטיפול" },
  { value: "meeting_scheduled", label: "פגישה נקבעה" },
  { value: "interested", label: "מעוניין" },
  { value: "registered", label: "נרשם" },
  { value: "not_relevant", label: "לא רלוונטי" },
];

const SOURCE_MAP = {
  phone: "טלפון",
  referral: "המלצה",
  website: "אתר",
  social: "רשתות חברתיות",
  other: "אחר",
};

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

const headers = ["שם", "טלפון", "גודל משפחה", "סטטוס", "מקור", "הופנה ע\"י", "הערה אחרונה", "פעולות"];

function LeadsView({
  filteredLeads,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  handleAddClick,
  handleEditClick,
  handleNotesClick,
  handleDeleteClick,
}) {
  const classes = useStyles();

  return (
    <Grid>
      <Grid style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px 8px",
        gap: "8px",
      }}>
        <Button className={classes.addButton} onClick={handleAddClick}>
          + הוסף ליד
        </Button>

        <Grid style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FormControl size="small">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ fontSize: 12, borderRadius: "8px", minWidth: "130px", height: "32px" }}
            >
              {ALL_STATUSES.map((s) => (
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
                <TableCell colSpan={8} style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, padding: "32px" }}>
                  אין לידים להצגה
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads?.map((lead, index) => (
                <TableRow key={lead.lead_id || index}>
                  <TableCell className={classes.dataTableCell}>{lead.full_name}</TableCell>
                  <TableCell className={classes.dataTableCell}>{lead.phone || "—"}</TableCell>
                  <TableCell className={classes.dataTableCell}>{lead.family_size || "—"}</TableCell>
                  <TableCell className={classes.dataTableCell}>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {SOURCE_MAP[lead.source] || lead.source || "—"}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>{lead.referred_by || "—"}</TableCell>
                  <TableCell
                    className={classes.dataTableCell}
                    style={{ maxWidth: "180px", whiteSpace: "normal", textAlign: "right" }}
                  >
                    {lead.last_note || "—"}
                  </TableCell>
                  <TableCell className={classes.dataTableCell} style={{ whiteSpace: "nowrap" }}>
                    <IconButton size="small" onClick={() => handleEditClick(lead)} title="עריכה">
                      <EditIcon style={{ fontSize: "16px", color: "#0d9488" }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleNotesClick(lead)} title="הערות">
                      <NotesIcon style={{ fontSize: "16px", color: "#64748b" }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(lead)} title="מחיקה">
                      <DeleteIcon style={{ fontSize: "16px", color: "#ef4444" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default LeadsView;
