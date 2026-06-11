import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useStyles } from "./FamilyImportDialog.style";

// A collapsible report section. Hidden entirely when it has no items (count 0),
// so a clean import shows only the green summary. `tone` picks the chip colors.
function Section({ classes, title, count, tone, children, expanded, onToggle }) {
  if (!count) return null;
  const tones = {
    warn: { bg: "#fffbeb", color: "#b45309" },
    error: { bg: "#fef2f2", color: "#b91c1c" },
    info: { bg: "#eff6ff", color: "#1d4ed8" },
  };
  const t = tones[tone] || tones.info;
  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader} onClick={onToggle}>
        <span className={classes.sectionTitle}>
          {expanded ? <ExpandLessIcon style={{ fontSize: 18 }} /> : <ExpandMoreIcon style={{ fontSize: 18 }} />}
          {title}
        </span>
        <span className={classes.countChip} style={{ background: t.bg, color: t.color }}>{count}</span>
      </div>
      {expanded && <div className={classes.sectionBody}>{children}</div>}
    </div>
  );
}

function FamilyImportDialogView(props) {
  const classes = useStyles();
  const { open, onClose, importing, error, result } = props;
  const [expanded, setExpanded] = React.useState({});
  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const row = (text, i) => (
    <div key={i} className={classes.itemRow}>{text}</div>
  );

  return (
    <Dialog open={open} onClose={importing ? undefined : onClose} PaperProps={{ className: classes.dialogPaper }}>
      <DialogTitle className={classes.title}>ייבוא נתונים מאקסל</DialogTitle>
      <DialogContent className={classes.content}>
        {importing ? (
          <div className={classes.loadingWrap}>
            <CircularProgress size={34} style={{ color: "#0d9488" }} />
            <span className={classes.loadingText}>מייבא משפחות…</span>
          </div>
        ) : error ? (
          <div className={classes.errorBox}>{error}</div>
        ) : result ? (
          <>
            <div className={classes.summary}>
              <div className={classes.summaryBig}>{result.imported}</div>
              <div className={classes.summarySub}>
                משפחות יובאו מתוך {result.totalRows} שורות
                {result.roomsAssigned > 0 ? ` · ${result.roomsAssigned} חדרים שובצו` : ""}
              </div>
            </div>

            <Section classes={classes} title="דולגו — כפילויות" count={result.skippedDuplicates.length}
              tone="warn" expanded={expanded.dup} onToggle={() => toggle("dup")}>
              {result.skippedDuplicates.map((x, i) => row(`שורה ${x.row}: ${x.family_name}`, i))}
            </Section>

            <Section classes={classes} title="ללא תאריכים — לטיפול ידני" count={result.withoutDates.length}
              tone="warn" expanded={expanded.nodate} onToggle={() => toggle("nodate")}>
              {result.withoutDates.map((x, i) =>
                row(`שורה ${x.row}: ${x.family_name}${x.week_raw ? ` (ערך: "${x.week_raw}")` : ""}${x.reason ? ` — ${x.reason}` : ""}`, i))}
            </Section>

            <Section classes={classes} title="משפחות חריגים — תאריכים מותאמים" count={result.exceptionFamilies.length}
              tone="info" expanded={expanded.exc} onToggle={() => toggle("exc")}>
              {result.exceptionFamilies.map((x, i) =>
                row(`שורה ${x.row}: ${x.family_name} (${x.start_date} – ${x.end_date})`, i))}
            </Section>

            <Section classes={classes} title="חדרים לא שובצו — אין תאריכים" count={result.roomsSkippedNoDates.length}
              tone="warn" expanded={expanded.rnd} onToggle={() => toggle("rnd")}>
              {result.roomsSkippedNoDates.map((x, i) =>
                row(`שורה ${x.row}: ${x.family_name} — חדרים ${x.rooms.join(", ")}`, i))}
            </Section>

            <Section classes={classes} title="חדרים לא קיימים" count={result.roomsFailedNotExist.length}
              tone="error" expanded={expanded.rne} onToggle={() => toggle("rne")}>
              {result.roomsFailedNotExist.map((x, i) =>
                row(`שורה ${x.row}: ${x.family_name} — חדר ${x.room}`, i))}
            </Section>

            <Section classes={classes} title="חדרים תפוסים — חפיפת תאריכים" count={result.roomsFailedOverlap.length}
              tone="error" expanded={expanded.rov} onToggle={() => toggle("rov")}>
              {result.roomsFailedOverlap.map((x, i) =>
                row(`שורה ${x.row}: ${x.family_name} — חדר ${x.room}`, i))}
            </Section>

            <Section classes={classes} title="בעיות בשורות" count={result.parseProblems.length}
              tone="error" expanded={expanded.prob} onToggle={() => toggle("prob")}>
              {result.parseProblems.map((x, i) => row(`שורה ${x.row}: ${x.message}`, i))}
            </Section>
          </>
        ) : null}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button className={classes.closeBtn} onClick={onClose} disabled={importing}>
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FamilyImportDialogView;
