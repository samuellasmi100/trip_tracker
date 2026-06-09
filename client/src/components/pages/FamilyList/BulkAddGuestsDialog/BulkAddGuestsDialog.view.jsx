import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { useStyles } from "./BulkAddGuestsDialog.style";

// Presentational only. Each row's fields are independent free text — no auto-fill
// / no forced shared surname (a group can hold two different families). The
// container handles trip-info inheritance, age computation, and submission.
//
// Name fields are grouped by language for the two-tier header (עברית / אנגלית over
// short פרטי / משפחה sub-labels); the flat list drives each row's name inputs.
const NAME_GROUPS = [
  {
    group: "שם בעברית",
    fields: [
      { key: "hebrew_first_name", label: "שם פרטי" },
      { key: "hebrew_last_name", label: "שם משפחה" },
    ],
  },
  {
    group: "שם באנגלית",
    fields: [
      { key: "english_first_name", label: "שם פרטי" },
      { key: "english_last_name", label: "שם משפחה" },
    ],
  },
];
const NAME_FIELDS = NAME_GROUPS.flatMap((g) => g.fields);

// Same 3 values as the flights editor's "סיווג משתמש" dropdown.
const CLASSIFICATION_OPTIONS = ["MR", "MRS", "BABY"];

const menuProps = {
  style: { zIndex: 1700 },
  PaperProps: {
    sx: { bgcolor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" },
  },
};

function BulkAddGuestsDialogView({
  open,
  rows,
  saving,
  familyName,
  remaining,
  canAddRow,
  onRowChange,
  onAddRow,
  onRemoveRow,
  onSubmit,
  onClose,
}) {
  const classes = useStyles();
  const hasLimit = Number.isFinite(remaining);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.paper }} style={{ zIndex: 1600 }}>
      <DialogTitle className={classes.title}>הוספת מספר אנשים</DialogTitle>
      <Typography className={classes.subtitle}>
        {familyName ? `למשפחה / קבוצה: ${familyName} · ` : ""}ממלאים שמות בלבד — תאריכים, שבוע וטיסות יועתקו מראש המשפחה
        {hasLimit && <span className={classes.capacityNote}>{` · ניתן להוסיף עוד ${remaining} אנשים`}</span>}
      </Typography>

      <DialogContent className={classes.content}>
        {/* One scroll container holds the header + rows as grid siblings so the
            columns stay aligned (scrolls X only if the screen is too narrow). */}
        <div className={classes.tableScroll}>
        {/* Tier 1: language group labels span their two name fields; the extra
            columns (classification / birth date / age) get only the tier-2 label. */}
        <div className={classes.groupHead}>
          <span />
          {NAME_GROUPS.map((g) => (
            <span key={g.group} className={classes.groupLabel}>{g.group}</span>
          ))}
          <span />
          <span />
          <span />
          <span />
        </div>

        {/* Tier 2: per-column labels aligned to the inputs. */}
        <div className={classes.subHead}>
          <span className={classes.subHeadIndex}>#</span>
          {NAME_FIELDS.map((f, i) => (
            <span key={i} className={classes.subHeadLabel}>{f.label}</span>
          ))}
          <span className={classes.subHeadLabel}>סיווג</span>
          <span className={classes.subHeadLabel}>תאריך לידה</span>
          <span className={classes.subHeadLabel}>גיל</span>
          <span />
        </div>

        {rows.map((row, index) => (
            <div className={classes.row} key={index}>
              <span className={classes.rowIndex}>{index + 1}</span>
              {NAME_FIELDS.map((f) => (
                <TextField
                  key={f.key}
                  value={row[f.key] || ""}
                  onChange={(e) => onRowChange(index, f.key, e.target.value)}
                  size="small"
                  fullWidth
                  className={classes.field}
                  placeholder={f.label}
                />
              ))}

              {/* סיווג משתמש — flights field, written per person server-side */}
              <Select
                fullWidth
                value={row.user_classification || ""}
                onChange={(e) => onRowChange(index, "user_classification", e.target.value)}
                input={<OutlinedInput className={classes.classSelect} />}
                displayEmpty
                renderValue={(value) => value || "סיווג"}
                size="small"
                MenuProps={menuProps}
              >
                {CLASSIFICATION_OPTIONS.map((c) => (
                  <MenuItem key={c} value={c} sx={{ fontSize: "13px" }}>{c}</MenuItem>
                ))}
              </Select>

              {/* תאריך לידה — DD/MM/YYYY */}
              <TextField
                value={row.birth_date || ""}
                onChange={(e) => onRowChange(index, "birth_date", e.target.value)}
                size="small"
                fullWidth
                className={classes.field}
                placeholder="DD/MM/YYYY"
              />

              {/* גיל — computed from birth_date, read-only */}
              <TextField
                value={row.age === null || row.age === undefined ? "" : row.age}
                size="small"
                fullWidth
                disabled
                className={classes.field}
                placeholder="גיל"
              />

              <Tooltip title="הסר שורה">
                <span>
                  <IconButton
                    size="small"
                    className={classes.removeBtn}
                    onClick={() => onRemoveRow(index)}
                    disabled={rows.length <= 1}
                  >
                    <DeleteOutlineIcon style={{ fontSize: "19px" }} />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          ))}
        </div>

        <div className={classes.addRowWrap}>
          <Button className={classes.addRowBtn} onClick={onAddRow} startIcon={<AddIcon />} disabled={!canAddRow}>
            הוסף שורה
          </Button>
          {hasLimit && !canAddRow && (
            <span className={classes.capacityFull}>הגעת לגודל המשפחה</span>
          )}
        </div>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button className={classes.submitBtn} onClick={onSubmit} disabled={saving}>
          הוסף
        </Button>
        <Button className={classes.cancelBtn} onClick={onClose} disabled={saving}>
          ביטול
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BulkAddGuestsDialogView;
