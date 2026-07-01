import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useStyles } from "./GuestImportDialog.style";

// A collapsible report section. Hidden entirely when it has no items, so a clean
// import shows only the green summary.
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

// "שורה N: " prefix only when the row is known (some problems are file-level).
const atRow = (n) => (n ? `שורה ${n}: ` : "");

function GuestImportDialogView({ open, onClose, importing, error, result }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState({});
  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));
  const row = (text, i) => <div key={i} className={classes.itemRow}>{text}</div>;

  // Defensive defaults so a partial/old report shape never crashes the dialog.
  const r = result || {};
  const created = r.groupsCreated || [];
  const multi = r.multiSurnameMatches || [];
  const capacity = r.capacityIssues || [];
  const problems = r.parseProblems || [];

  // Build the secondary summary line from the non-zero counters.
  const sub = [];
  if (r.skippedExisting) sub.push(`${r.skippedExisting} כבר קיימים`);
  if (r.filledGuests) sub.push(`${r.filledGuests} הושלמו`);
  if (r.passportsAttached) sub.push(`${r.passportsAttached} דרכונים`);
  if (r.relocatedRows) sub.push(`${r.relocatedRows} שורות מוקמו מחדש`);

  return (
    <Dialog open={open} onClose={importing ? undefined : onClose} PaperProps={{ className: classes.dialogPaper }}>
      <DialogTitle className={classes.title}>ייבוא אורחי המלון</DialogTitle>
      <DialogContent className={classes.content}>
        {importing ? (
          <div className={classes.loadingWrap}>
            <CircularProgress size={34} style={{ color: "#0d9488" }} />
            <span className={classes.loadingText}>מייבא אורחים…</span>
          </div>
        ) : error ? (
          <div className={classes.errorBox}>{error}</div>
        ) : result ? (
          <>
            <div className={classes.summary}>
              <div className={classes.summaryBig}>{r.importedGuests}</div>
              <div className={classes.summarySub}>
                אורחים יובאו מתוך {r.totalGuests} · {r.totalBoxes} קבוצות
                {sub.length ? ` · ${sub.join(" · ")}` : ""}
              </div>
            </div>

            <Section classes={classes} title="קבוצות חדשות שנוצרו" count={created.length}
              tone="info" expanded={expanded.created} onToggle={() => toggle("created")}>
              {created.map((x, i) => row(`${atRow(x.firstRow)}${x.group}`, i))}
            </Section>

            <Section classes={classes} title="התאמה לכמה קבוצות קיימות — לבדיקה" count={multi.length}
              tone="warn" expanded={expanded.multi} onToggle={() => toggle("multi")}>
              {multi.map((x, i) =>
                row(`${atRow(x.firstRow)}נבחר "${x.chosen}" מתוך [${(x.surnames || []).join(", ")}]`, i))}
            </Section>

            <Section classes={classes} title="חריגה ממכסת קבוצה" count={capacity.length}
              tone="warn" expanded={expanded.cap} onToggle={() => toggle("cap")}>
              {capacity.map((x, i) =>
                row(`${atRow(x.firstRow)}${x.group} — ${x.attempted} מבוקשים, ${x.remaining} פנויים`, i))}
            </Section>

            <Section classes={classes} title="בעיות" count={problems.length}
              tone="error" expanded={expanded.prob} onToggle={() => toggle("prob")}>
              {problems.map((x, i) => row(`${atRow(x.firstRow)}${x.message}`, i))}
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

export default GuestImportDialogView;
