import React, { useState, useEffect } from "react";
import {
  Dialog,
  IconButton,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import ApiLeads from "../../../../../../apis/leadsRequest";
import { useDispatch, useSelector } from "react-redux";
import * as leadsSlice from "../../../../../../store/slice/leadsSlice";

const useStyles = makeStyles(() => ({
  dialog: { borderRadius: "12px !important", padding: 0 },
  header: {
    padding: "20px 24px 12px",
    borderBottom: "1px solid #f1f5f9",
  },
  title: {
    fontSize: "15px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: "12px !important",
    color: "#64748b",
    marginTop: "2px !important",
  },
  notesList: {
    padding: "16px 24px",
    maxHeight: "260px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  noteItem: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px 14px",
  },
  noteText: {
    fontSize: "13px !important",
    color: "#1e293b",
    lineHeight: "1.5 !important",
  },
  noteDate: {
    fontSize: "11px !important",
    color: "#94a3b8",
    marginTop: "4px !important",
  },
  emptyState: {
    fontSize: "13px !important",
    color: "#94a3b8",
    textAlign: "center",
    padding: "24px 0",
  },
  addSection: {
    padding: "12px 24px 20px",
    borderTop: "1px solid #f1f5f9",
  },
  addLabel: {
    fontSize: "12px !important",
    color: "#64748b",
    fontWeight: "500 !important",
    marginBottom: "6px !important",
  },
  textField: {
    "& .MuiInputBase-input": { color: "#1e293b", fontSize: 13 },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  addButton: {
    marginTop: "8px !important",
    color: "#ffffff !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "6px 24px !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "8px !important",
  },
}));

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const LeadNotesDialog = ({ open, onClose, lead, vacationId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && lead) {
      fetchNotes();
    }
  }, [open, lead]);

  const fetchNotes = async () => {
    try {
      const response = await ApiLeads.getById(token, vacationId, lead.lead_id);
      setNotes(response.data?.notes || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    try {
      const response = await ApiLeads.addNote(token, vacationId, lead.lead_id, newNote.trim());
      setNotes(response.data);
      setNewNote("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { borderRadius: "12px", minWidth: "400px", maxWidth: "500px" } }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        style={{ position: "absolute", top: "12px", left: "12px", color: "#94a3b8", zIndex: 1 }}
      >
        <CloseIcon style={{ fontSize: "18px" }} />
      </IconButton>

      <div className={classes.header}>
        <Typography className={classes.title}>היסטוריית הערות</Typography>
        {lead && (
          <Typography className={classes.subtitle}>{lead.full_name}</Typography>
        )}
      </div>

      <div className={classes.notesList}>
        {notes.length === 0 ? (
          <Typography className={classes.emptyState}>אין הערות עדיין</Typography>
        ) : (
          notes.map((note) => (
            <div key={note.note_id} className={classes.noteItem}>
              <Typography className={classes.noteText}>{note.note_text}</Typography>
              <Typography className={classes.noteDate}>{formatDate(note.created_at)}</Typography>
            </div>
          ))
        )}
      </div>

      <div className={classes.addSection}>
        <Typography className={classes.addLabel}>הוסף הערה</Typography>
        <TextField
          className={classes.textField}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          multiline
          rows={2}
          size="small"
          fullWidth
          placeholder="כתוב הערה..."
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddNote(); } }}
        />
        <Button
          onClick={handleAddNote}
          disabled={loading || !newNote.trim()}
          className={classes.addButton}
        >
          הוסף
        </Button>
      </div>
    </Dialog>
  );
};

export default LeadNotesDialog;
