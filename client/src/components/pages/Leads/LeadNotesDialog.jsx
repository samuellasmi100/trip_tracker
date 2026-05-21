import React from "react";
import { Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import LeadNotesSection from "./LeadNotesSection";

const useStyles = makeStyles(() => ({
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
  body: { padding: "16px 24px 20px" },
}));

const LeadNotesDialog = ({ open, onClose, lead, vacationId }) => {
  const classes = useStyles();

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
        {lead && <Typography className={classes.subtitle}>{lead.full_name}</Typography>}
      </div>

      <div className={classes.body}>
        {open && lead && <LeadNotesSection lead={lead} vacationId={vacationId} />}
      </div>
    </Dialog>
  );
};

export default LeadNotesDialog;
