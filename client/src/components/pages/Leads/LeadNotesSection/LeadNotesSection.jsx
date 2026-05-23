import React, { useState, useEffect } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import ApiLeads from "../../../../apis/leadsRequest";
import * as leadsSlice from "../../../../store/slices/leadsSlice";

const useStyles = makeStyles(() => ({
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "220px",
    overflowY: "auto",
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
    whiteSpace: "pre-wrap",
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
    padding: "20px 0",
  },
  composer: {
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },
  composerLabel: {
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
  return d.toLocaleDateString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// Notes list + composer used by both LeadNotesDialog and LeadDetailPanel.
// Fetches the audit-trail notes via ApiLeads.getById; adds via ApiLeads.addNote.
const LeadNotesSection = ({ lead, vacationId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lead) return;
    let cancelled = false;
    ApiLeads.getById(token, vacationId, lead.lead_id)
      .then((res) => { if (!cancelled) setNotes(res.data?.notes || []); })
      .catch((err) => console.log(err));
    return () => { cancelled = true; };
  }, [lead?.lead_id, vacationId, token]);

  const handleAdd = async () => {
    if (!newNote.trim() || !lead) return;
    setLoading(true);
    try {
      const response = await ApiLeads.addNote(token, vacationId, lead.lead_id, newNote.trim());
      setNotes(response.data);
      setNewNote("");
      // Refresh the leads list so the main table reflects the new last_note +
      // the bumped updated_at (the panel re-derives from the slice).
      try {
        const refreshed = await ApiLeads.getAll(token, vacationId);
        dispatch(leadsSlice.updateLeadsList(refreshed.data));
      } catch (refreshErr) {
        console.log(refreshErr);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={classes.list}>
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

      <div className={classes.composer}>
        <Typography className={classes.composerLabel}>הוסף הערה</Typography>
        <TextField
          className={classes.textField}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          multiline
          rows={2}
          size="small"
          fullWidth
          placeholder="כתוב הערה..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button
          onClick={handleAdd}
          disabled={loading || !newNote.trim()}
          className={classes.addButton}
        >
          הוסף
        </Button>
      </div>
    </div>
  );
};

export default LeadNotesSection;
