import React from "react";
import {
  Box,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useStyles, PILL_COLORS } from "./LeadDetailPanel.style";
import { STATUS_CONFIG } from "./Leads.style";
import LeadNotesSection from "./LeadNotesSection/LeadNotesSection";

const STATUS_PILLS = [
  { value: "new_interest", label: "חדש" },
  { value: "follow_up",    label: "בתהליך" },
  { value: "registered",   label: "נסגר" },
  { value: "not_relevant", label: "לא רלוונטי" },
];

const SOURCE_LABEL = {
  phone: "טלפון",
  referral: "המלצה",
  website: "אתר",
  social: "רשתות חברתיות",
  other: "אחר",
};

const toDateInput = (v) => {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
};

const formatPriceDisplay = (v) => (v != null ? `${v} ₪` : "—");

const formatTimestamp = (v) => {
  if (!v) return null;
  const d = new Date(v);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

function StatusBadgeInline({ status }) {
  const cfg = STATUS_CONFIG[status] || { bg: "#f1f5f9", color: "#64748b", label: status };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
    }}>{cfg.label}</span>
  );
}

const LeadDetailPanelView = ({
  open,
  lead,
  vacationId,
  onClose,
  onStatusChange,
  onDateChange,
  onOpenFullEdit,
  followupOverdue,
  confirmDeleteOpen,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.drawerPaper }}
    >
      {lead && (
        <div className={classes.container}>
          {/* Header */}
          <div className={classes.header}>
            <div className={classes.headerInfo}>
              <Typography className={classes.name} title={lead.full_name}>
                {lead.full_name}
              </Typography>
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className={classes.phoneRow}>
                  <PhoneIcon style={{ fontSize: "14px" }} />
                  {lead.phone}
                </a>
              )}
              <StatusBadgeInline status={lead.status} />
              {formatTimestamp(lead.updated_at) && (
                <Typography className={classes.lastUpdated}>
                  עודכן לאחרונה: {formatTimestamp(lead.updated_at)}
                </Typography>
              )}
            </div>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Body */}
          <div className={classes.body}>
            {/* Quick status changer */}
            <section className={classes.section}>
              <Typography className={classes.sectionLabel}>סטטוס</Typography>
              <div className={classes.statusPills}>
                {STATUS_PILLS.map((p) => {
                  const active = lead.status === p.value;
                  const c = PILL_COLORS[p.value] || {};
                  return (
                    <Button
                      key={p.value}
                      className={`${classes.pill} ${active ? classes.pillActive : ""}`}
                      style={active ? { background: c.bg, color: c.color } : undefined}
                      onClick={() => onStatusChange(p.value)}
                      disabled={active}
                    >
                      {p.label}
                    </Button>
                  );
                })}
              </div>
            </section>

            {/* Dates */}
            <section className={classes.section}>
              <div className={classes.dateRow}>
                <div>
                  <Typography className={classes.dateLabel}>
                    תאריך פולואפ{followupOverdue ? " ⚠" : ""}
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    value={toDateInput(lead.followup_date)}
                    onChange={(e) => onDateChange("followup_date", e.target.value)}
                    className={`${classes.dateField} ${followupOverdue ? classes.dateFieldOverdue : ""}`}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <Typography className={classes.dateLabel}>תאריך פתיחת ליד</Typography>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    value={toDateInput(lead.last_contact_date)}
                    onChange={(e) => onDateChange("last_contact_date", e.target.value)}
                    className={classes.dateField}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </section>

            {/* Notes */}
            <section className={classes.section}>
              <Typography className={classes.sectionLabel}>הערות והיסטוריה</Typography>
              <LeadNotesSection lead={lead} vacationId={vacationId} />
            </section>

            {/* Read-only details */}
            <section className={classes.section}>
              <Typography className={classes.sectionLabel}>פרטים</Typography>
              <div className={classes.detailsGrid}>
                <div className={classes.detailItem}>
                  <Typography className={classes.detailKey}>מחיר</Typography>
                  <Typography className={classes.detailValue}>{formatPriceDisplay(lead.price)}</Typography>
                </div>
                <div className={classes.detailItem}>
                  <Typography className={classes.detailKey}>הנחה</Typography>
                  <Typography className={classes.detailValue}>{formatPriceDisplay(lead.discount)}</Typography>
                </div>
                <div className={classes.detailItem}>
                  <Typography className={classes.detailKey}>השתלמות</Typography>
                  <Typography className={classes.detailValue}>{lead.training || "—"}</Typography>
                </div>
                <div className={classes.detailItem}>
                  <Typography className={classes.detailKey}>הרכב</Typography>
                  <Typography className={classes.detailValue}>{lead.composition || "—"}</Typography>
                </div>
                <div className={classes.detailItem}>
                  <Typography className={classes.detailKey}>מקור</Typography>
                  <Typography className={classes.detailValue}>{SOURCE_LABEL[lead.source] || lead.source || "—"}</Typography>
                </div>
                <div className={classes.detailItem}>
                  <Typography className={classes.detailKey}>גודל משפחה</Typography>
                  <Typography className={classes.detailValue}>{lead.family_size || "—"}</Typography>
                </div>
                {lead.email && (
                  <div className={`${classes.detailItem} ${classes.detailFull}`}>
                    <Typography className={classes.detailKey}>אימייל</Typography>
                    <Typography className={classes.detailValue}>{lead.email}</Typography>
                  </div>
                )}
                {lead.referred_by && (
                  <div className={`${classes.detailItem} ${classes.detailFull}`}>
                    <Typography className={classes.detailKey}>הופנה על ידי</Typography>
                    <Typography className={classes.detailValue}>{lead.referred_by}</Typography>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className={classes.footer}>
            <Button
              className={classes.deleteAction}
              startIcon={<DeleteIcon style={{ fontSize: "16px" }} />}
              onClick={onRequestDelete}
            >
              מחק ליד
            </Button>
            <Button
              className={classes.fullEditLink}
              startIcon={<EditIcon style={{ fontSize: "16px" }} />}
              onClick={onOpenFullEdit}
            >
              עריכה מלאה
            </Button>
          </div>
        </div>
      )}

      {/* Styled delete-confirmation dialog — mirrors RoomDetailPanel pattern:
          DeleteOutline icon + bottom-bordered title, info box, styled buttons
          with destructive red confirm. Replaces the previous window.confirm. */}
      <Dialog
        open={!!confirmDeleteOpen}
        onClose={onCancelDelete}
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
            מחיקת ליד
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {lead && (
            <Box
              sx={{
                p: 1.5,
                mb: 2,
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {lead.full_name}
              </Typography>
              {lead.phone && (
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  {lead.phone}
                </Typography>
              )}
            </Box>
          )}
          <Typography variant="body2" sx={{ color: "#475569" }}>
            למחוק את הליד וכל ההערות שלו? פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={onCancelDelete}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={onConfirmDelete}
            sx={{
              textTransform: "none",
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default LeadDetailPanelView;
