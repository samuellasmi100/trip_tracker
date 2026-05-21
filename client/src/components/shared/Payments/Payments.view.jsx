import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  InputLabel,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Divider,
  Grid,
  Collapse,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useStyles } from "./Payments.style";

const PAYMENT_METHODS = ["מזומן", "העברה בנקאית", "כרטיס אשראי", "המחאות"];
const STATUS_OPTIONS = [
  { value: "completed", label: "שולם" },
  { value: "pending",   label: "ממתין" },
  { value: "cancelled", label: "בוטל" },
];

function PaymentContent({
  family,
  payments,
  loading,
  form,
  submitting,
  totalAmount,
  paidAmount,
  remaining,
  onFormChange,
  onAdd,
  onDelete,
  onInitSession,
  onCreateLink,
  initLoading,
  linkLoading,
  linkCopied,
  classes,
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      {/* ── Action bar ──────────────────────────────────────────────────────── */}
      <div className={classes.actionBar}>
        <Button
          className={classes.actionBtnManual}
          onClick={() => setShowAddForm((v) => !v)}
          startIcon={showAddForm ? <KeyboardArrowUpIcon /> : <AddIcon />}
          size="small"
        >
          הוסף תשלום ידני
        </Button>

        <Button
          className={`${classes.actionBtn} ${linkCopied ? classes.actionBtnSuccess : classes.actionBtnLink}`}
          onClick={onCreateLink}
          disabled={linkLoading}
          startIcon={
            linkLoading ? <CircularProgress size={13} color="inherit" /> :
            linkCopied  ? <CheckIcon style={{ fontSize: 15 }} /> :
            <LinkIcon style={{ fontSize: 15 }} />
          }
          size="small"
        >
          {linkCopied ? "הועתק!" : "שלח קישור"}
        </Button>

        <Button
          className={`${classes.actionBtn} ${classes.actionBtnCard}`}
          onClick={onInitSession}
          disabled={initLoading}
          startIcon={
            initLoading
              ? <CircularProgress size={13} color="inherit" />
              : <CreditCardIcon style={{ fontSize: 15 }} />
          }
          size="small"
        >
          שלם בכרטיס אשראי
        </Button>
      </div>

      {/* ── Inline add form (collapsible) ──────────────────────────────────── */}
      <Collapse in={showAddForm}>
        <div className={classes.addFormSection}>
          <Typography className={classes.addFormTitle}>הוסף תשלום ידני</Typography>
          <Grid container spacing={1} alignItems="flex-end" style={{ marginTop: 4 }}>
            <Grid item>
              <InputLabel className={classes.fieldLabel}>סכום (₪)</InputLabel>
              <TextField
                type="number"
                value={form.amount}
                onChange={(e) => onFormChange("amount", e.target.value)}
                className={classes.formField}
                size="small"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.fieldLabel}>צורת תשלום</InputLabel>
              <Select
                value={form.paymentMethod}
                onChange={(e) => onFormChange("paymentMethod", e.target.value)}
                input={<OutlinedInput className={classes.selectField} />}
                MenuProps={{ style: { zIndex: 1700 } }}
              >
                {PAYMENT_METHODS.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <InputLabel className={classes.fieldLabel}>תאריך</InputLabel>
              <TextField
                type="date"
                value={form.paymentDate}
                onChange={(e) => onFormChange("paymentDate", e.target.value)}
                className={classes.formField}
                size="small"
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.fieldLabel}>סטטוס</InputLabel>
              <Select
                value={form.status}
                onChange={(e) => onFormChange("status", e.target.value)}
                input={<OutlinedInput className={classes.selectField} />}
                MenuProps={{ style: { zIndex: 1700 } }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item style={{ flex: 1, minWidth: 110 }}>
              <InputLabel className={classes.fieldLabel}>הערות</InputLabel>
              <TextField
                value={form.notes}
                onChange={(e) => onFormChange("notes", e.target.value)}
                className={classes.formFieldWide}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.receipt}
                    onChange={(e) => onFormChange("receipt", e.target.checked)}
                    sx={{ color: "#cbd5e1", "&.Mui-checked": { color: "#0d9488" } }}
                    size="small"
                  />
                }
                label={<Typography style={{ fontSize: 12, color: "#64748b" }}>קבלה</Typography>}
              />
            </Grid>
            <Grid item>
              <Button
                className={classes.addBtn}
                onClick={() => { onAdd(); setShowAddForm(false); }}
                disabled={submitting || !form.amount || !form.paymentDate}
                startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : <AddIcon />}
              >
                הוסף
              </Button>
            </Grid>
          </Grid>
        </div>
        <Divider style={{ margin: "0 0 12px" }} />
      </Collapse>

      {/* ── Payment history ─────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
          <CircularProgress size={28} style={{ color: "#0d9488" }} />
        </div>
      ) : payments.length === 0 ? (
        <Typography className={classes.emptyText}>אין תשלומים רשומים עדיין</Typography>
      ) : (
        <TableContainer>
          <Table size="small" className={classes.historyTable}>
            <TableHead>
              <TableRow>
                {["תאריך", "צורת תשלום", "סכום", "סטטוס", "הערות", "קבלה", "כרטיס", ""].map((h, i) => (
                  <TableCell key={i} className={classes.historyHeader}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((p) => {
                const chip =
                  p.status === "completed" ? classes.chipCompleted :
                  p.status === "pending"   ? classes.chipPending :
                  classes.chipCancelled;
                const statusLabel = STATUS_OPTIONS.find((s) => s.value === p.status)?.label || p.status;
                return (
                  <TableRow key={p.id} className={classes.historyRow}>
                    <TableCell className={classes.historyCell}>{p.paymentDate}</TableCell>
                    <TableCell className={classes.historyCell}>{p.paymentMethod}</TableCell>
                    <TableCell className={classes.historyCell}>
                      <strong>₪{Number(p.amount).toLocaleString()}</strong>
                    </TableCell>
                    <TableCell className={classes.historyCell}>
                      <span className={`${classes.statusChip} ${chip}`}>{statusLabel}</span>
                    </TableCell>
                    <TableCell className={classes.historyCell}>{p.notes || "—"}</TableCell>
                    <TableCell className={classes.historyCell}>{p.receipt ? "✓" : "—"}</TableCell>
                    <TableCell className={classes.historyCell}>
                      {p.cardLastFour ? (
                        <Tooltip title={p.cardOwnerName || ""}>
                          <span className={classes.cardLastFour}>···{p.cardLastFour}</span>
                        </Tooltip>
                      ) : "—"}
                    </TableCell>
                    <TableCell className={classes.historyCell}>
                      <IconButton size="small" onClick={() => onDelete(p.id)}>
                        <DeleteOutlineIcon style={{ fontSize: 16, color: "#ef4444" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

function PaymentsView({
  embedded,
  open,
  onClose,
  family,
  payments,
  loading,
  form,
  submitting,
  totalAmount,
  paidAmount,
  remaining,
  onFormChange,
  onAdd,
  onDelete,
  onInitSession,
  onCreateLink,
  initLoading,
  linkLoading,
  linkCopied,
}) {
  const classes = useStyles();

  const badgeClass =
    totalAmount === 0 ? null :
    paidAmount === 0  ? classes.paymentUnpaid :
    paidAmount < totalAmount ? classes.paymentPartial :
    classes.paymentPaid;

  const summaryBar = (
    <>
      {totalAmount > 0 && (
        <div className={classes.progressBarWrap}>
          <div
            className={classes.progressBarFill}
            style={{ width: `${Math.min(100, (paidAmount / totalAmount) * 100)}%` }}
          />
        </div>
      )}
      {remaining > 0 && (
        <Typography className={classes.remainingText}>
          נותר לתשלום: ₪{remaining.toLocaleString()}
        </Typography>
      )}
    </>
  );

  const contentProps = {
    family, payments, loading, form, submitting,
    totalAmount, paidAmount, remaining,
    onFormChange, onAdd, onDelete,
    onInitSession, onCreateLink,
    initLoading, linkLoading, linkCopied,
    classes,
  };

  // ── EMBEDDED mode: no Dialog wrapper ──────────────────────────────────────
  if (embedded) {
    return (
      <div style={{ padding: "0 4px" }}>
        <div className={classes.embeddedHeader}>
          <Typography className={classes.embeddedFamilyName}>
            {family?.family_name}
          </Typography>
          {totalAmount > 0 && badgeClass && (
            <span className={`${classes.summaryBadge} ${badgeClass}`} style={{ fontSize: 12, padding: "2px 10px", borderRadius: 10, fontWeight: 700 }}>
              ₪{paidAmount.toLocaleString()} / ₪{totalAmount.toLocaleString()}
            </span>
          )}
        </div>
        {summaryBar}
        <PaymentContent {...contentProps} />
      </div>
    );
  }

  // ── STANDALONE mode: full MUI Dialog ──────────────────────────────────────
  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      PaperProps={{ className: classes.dialogPaper }}
      style={{ zIndex: 1600 }}
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <div className={classes.titleRow}>
          <Typography className={classes.familyName}>{family?.family_name || ""}</Typography>
          {totalAmount > 0 && badgeClass && (
            <span className={`${classes.summaryBadge} ${badgeClass}`}>
              ₪{paidAmount.toLocaleString()} / ₪{totalAmount.toLocaleString()}
            </span>
          )}
          <IconButton className={classes.closeBtn} onClick={onClose} size="small">
            <CloseIcon style={{ fontSize: 16 }} />
          </IconButton>
        </div>
        {summaryBar}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <PaymentContent {...contentProps} />
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button className={classes.closeActionBtn} onClick={onClose}>סגור</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentsView;
