import {
  Grid,
  InputLabel,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { isoToDisplay, displayToIso, formatDateInput } from "../../../utils/helpers/formatDate";
import { useStyles } from "./Vacation.style";
import { useSelector } from "react-redux";

function VacationView({
  handleInputChange,
  submit,
  handleCloseClicked,
  parts,
  handleDeletePartClick,
  partToDelete,
  blockers,
  deleting,
  handleConfirmDeletePart,
  handleCancelDeletePart,
}) {
  const classes = useStyles();
  const form = useSelector((state) => state.staticSlice.form);
  const detailsModalType = useSelector((state) => state.staticSlice.detailsModalType);
  const isEdit = detailsModalType === "editVacation";

  // Typed date input (no calendar). The user types DD/MM/YYYY; we auto-insert
  // slashes (formatDateInput) and store ISO YYYY-MM-DD via the same form field
  // the old type="date" picker wrote — so the value sent to the server and held
  // in vacation_date/families is byte-identical (a partial/incomplete date stays
  // as-typed until complete). Routes through the parent's handleInputChange, so
  // the save logic is untouched.
  const handleDateChange = (e) => {
    handleInputChange({
      target: { name: e.target.name, value: displayToIso(formatDateInput(e.target.value)) },
    });
  };

  return (
    <Grid className={classes.wrapper}>
      <Typography className={classes.title}>
        {isEdit ? "עריכת חופשה" : "הוספת חופשה"}
      </Typography>

      <div className={classes.section}>
        <div className={classes.fieldGroup}>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>שם חופשה</InputLabel>
            <TextField
              name="vacation_name"
              className={classes.textField}
              value={form?.vacation_name || ""}
              onChange={handleInputChange}
              size="small"
              placeholder="הזן שם..."
            />
          </div>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>מספר מסלולים</InputLabel>
            <TextField
              name="vacation_routes"
              className={classes.textField}
              value={form?.vacation_routes || ""}
              onChange={handleInputChange}
              size="small"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {form?.vacation_routes > 0 && (
        <>
          <hr className={classes.divider} />
          <div className={classes.section}>
            <Typography className={classes.sectionLabel}>מסלולים</Typography>
            {Array.from({ length: Number(form?.vacation_routes) || 0 }).map((_, index) => {
              // One row per route. In edit mode each saved route maps to a real
              // part (carrying the id used for deletion); unsaved/new rows have no
              // part yet, so they get no delete button.
              const part = isEdit ? parts?.[index] : null;
              const label = part?.name || `שבוע ${index + 1}`;
              return (
                <div key={part?.id ?? index} className={classes.routeCard}>
                  <span className={classes.routeIndex} style={{ whiteSpace: "nowrap" }}>{label}</span>
                  <div className={classes.fieldItem} style={{ flex: 1 }}>
                    <InputLabel className={classes.inputLabelStyle}>מתאריך</InputLabel>
                    <TextField
                      name={`start_date_${index}`}
                      value={isoToDisplay(form[`start_date_${index}`]) || ""}
                      className={classes.dateField}
                      onChange={handleDateChange}
                      size="small"
                      placeholder="DD/MM/YYYY"
                      inputProps={{ inputMode: "numeric", maxLength: 10 }}
                    />
                  </div>
                  <div className={classes.fieldItem} style={{ flex: 1 }}>
                    <InputLabel className={classes.inputLabelStyle}>עד תאריך</InputLabel>
                    <TextField
                      name={`end_date_${index}`}
                      value={isoToDisplay(form[`end_date_${index}`]) || ""}
                      className={classes.dateField}
                      onChange={handleDateChange}
                      size="small"
                      placeholder="DD/MM/YYYY"
                      inputProps={{ inputMode: "numeric", maxLength: 10 }}
                    />
                  </div>
                  {part && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePartClick(part)}
                      title="מחק מסלול"
                      style={{ alignSelf: "flex-end", marginBottom: "2px" }}
                    >
                      <DeleteOutlineIcon style={{ color: "#dc2626", fontSize: "18px" }} />
                    </IconButton>
                  )}
                </div>
              );
            })}

            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#cbd5e1",
                    "&.Mui-checked": {
                      color: "#0d9488",
                    },
                  }}
                  name="exceptions"
                  onClick={handleInputChange}
                  checked={form.exceptions || false}
                  size="small"
                />
              }
              label={
                <Typography className={classes.checkboxLabel}>
                  חריגים
                </Typography>
              }
              style={{ marginTop: "4px" }}
            />
          </div>
        </>
      )}

      <hr className={classes.divider} />

      <div className={classes.actions}>
        <Button onClick={submit} className={classes.submitButton}>
          {isEdit ? "עדכן" : "הוסף"}
        </Button>
        <Button onClick={handleCloseClicked} className={classes.cancelButton}>
          ביטול
        </Button>
      </div>

      <Dialog
        open={Boolean(partToDelete)}
        onClose={handleCancelDeletePart}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", direction: "rtl" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningAmberIcon sx={{ fontSize: 20, color: blockers ? "#d97706" : "#dc2626" }} />
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
              {blockers ? "לא ניתן למחוק מסלול" : "מחיקת מסלול"}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleCancelDeletePart}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        {blockers ? (
          // The server refused the delete: the part is still in use. The blocking
          // guests are just members of these families, so we list families only.
          <DialogContent sx={{ pt: 2, textAlign: "right" }}>
            <Typography sx={{ fontSize: 13, color: "#475569", mb: 1.5 }}>
              המסלול "{partToDelete?.name}" משויך למשפחות הבאות. יש לשייך אותן למסלול אחר
              לפני המחיקה:
            </Typography>
            <Box
              sx={{
                maxHeight: 240,
                overflowY: "auto",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                backgroundColor: "#ffffff",
              }}
            >
              {blockers.families?.map((name, i) => (
                <Box
                  key={`fam-${i}`}
                  sx={{
                    p: 1,
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                    {name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContent>
        ) : (
          <DialogContent sx={{ pt: 2, textAlign: "right" }}>
            <Typography sx={{ fontSize: 13, color: "#475569" }}>
              האם למחוק את המסלול "{partToDelete?.name}"? פעולה זו אינה ניתנת לשחזור.
            </Typography>
          </DialogContent>
        )}

        <DialogActions sx={{ px: 3, pb: 2 }}>
          {blockers ? (
            <Button onClick={handleCancelDeletePart} sx={{ textTransform: "none", color: "#64748b" }}>
              סגור
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancelDeletePart}
                disabled={deleting}
                sx={{ textTransform: "none", color: "#64748b" }}
              >
                ביטול
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDeletePart}
                disabled={deleting}
                sx={{ textTransform: "none", backgroundColor: "#dc2626", "&:hover": { backgroundColor: "#b91c1c" } }}
              >
                מחק
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default VacationView;
