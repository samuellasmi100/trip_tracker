import React, { useState } from "react";
import {
  Typography, TextField, Button, IconButton, Tooltip,
  Select, MenuItem, FormControl, Switch, Divider, CircularProgress,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import GestureIcon from "@mui/icons-material/Gesture";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FlightIcon from "@mui/icons-material/Flight";
import ScienceIcon from "@mui/icons-material/Science";
import { useStyles } from "./Settings.style";

// ── Tab definitions ────────────────────────────────────────────────────────────
const TABS = [
  {
    key: "leads",
    label: "לידים",
    Icon: LinkIcon,
    title: "קישור לטופס הרשמה ציבורי",
    desc: "שתפו קישור זה עם מתעניינים. מי שמגיש את הטופס יופיע ברשימת הלידים.",
  },
  {
    key: "agreement",
    label: "הסכם",
    Icon: GestureIcon,
    title: "הסכם הזמנה",
    desc: "טקסט ההסכם שיוצג למשפחות לפני חתימה בדף הציבורי.",
  },
  {
    key: "docs",
    label: "מסמכים",
    Icon: ArticleIcon,
    title: "סוגי מסמכים נדרשים",
    desc: "הגדירו אילו מסמכים על כל נוסע להעלות דרך הקישור הציבורי.",
  },
  {
    key: "airlines",
    label: "חברות תעופה",
    Icon: FlightIcon,
    title: "חברות תעופה",
    desc: "הגדירו את חברות התעופה שאתם עובדים איתם.",
  },
  {
    key: "payments",
    label: "תשלומים",
    Icon: CreditCardIcon,
    title: "הגדרות ספק תשלומים",
    desc: "פרטי חשבון Cardcom לקבלת תשלומים בכרטיס אשראי ישירות מהמערכת.",
  },
];

const DOC_TYPE_OPTIONS = [
  { value: "Receipt",          label: "קבלה" },
  { value: "InvoiceTax",       label: "חשבונית מס" },
  { value: "InvoiceTaxReceipt",label: "חשבונית מס + קבלה" },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: "exempt_dealer",    label: "עוסק פטור" },
  { value: "authorized_dealer",label: "עוסק מורשה" },
  { value: "company",          label: "חברה" },
];

// ── Tab panels ─────────────────────────────────────────────────────────────────

function LeadsTab({ publicUrl, vacationName, copied, handleCopy, handleOpenForm, classes }) {
  return !publicUrl ? (
    <Typography className={classes.emptyState}>בחרו חופשה בתפריט העליון כדי להציג את הקישור</Typography>
  ) : (
    <div>
      {/* URL chip */}
      <div className={classes.urlChip}>
        <LinkIcon style={{ fontSize: 15, color: "#0d9488", flexShrink: 0 }} />
        <Typography className={classes.urlChipText}>{publicUrl}</Typography>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <Button
          className={copied ? classes.btnSuccess : classes.btnOutline}
          onClick={handleCopy}
          startIcon={copied ? <CheckIcon style={{ fontSize: 15 }} /> : null}
        >
          {copied ? "הועתק!" : "העתק קישור"}
        </Button>
        <Button
          className={classes.btnGhost}
          onClick={handleOpenForm}
          startIcon={<OpenInNewIcon style={{ fontSize: 15 }} />}
        >
          פתח טופס
        </Button>
      </div>

      {vacationName && (
        <Typography className={classes.hint}>חופשה נוכחית: {vacationName}</Typography>
      )}
    </div>
  );
}

function AgreementTab({ vacationId, agreementText, setAgreementText, savingAgreement, agreementSaved, handleAgreementSave, classes }) {
  return !vacationId ? (
    <Typography className={classes.emptyState}>בחרו חופשה בתפריט העליון</Typography>
  ) : (
    <div>
      <TextField
        value={agreementText}
        onChange={(e) => setAgreementText(e.target.value)}
        multiline
        rows={10}
        fullWidth
        placeholder="הזינו את תנאי ההסכם כאן..."
        className={classes.input}
        inputProps={{ dir: "rtl", style: { fontSize: 13, lineHeight: 1.6 } }}
        style={{ marginBottom: "16px" }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          className={agreementSaved ? classes.btnSuccess : classes.btnPrimary}
          onClick={handleAgreementSave}
          disabled={savingAgreement}
          startIcon={
            savingAgreement ? <CircularProgress size={13} color="inherit" /> :
            agreementSaved  ? <CheckIcon style={{ fontSize: 15 }} /> : null
          }
        >
          {agreementSaved ? "נשמר!" : "שמור הסכם"}
        </Button>
      </div>
    </div>
  );
}

function DocsTab({ vacationId, docTypes, newDocLabel, setNewDocLabel, addingDocType, handleAddDocType, handleDeleteDocType, classes }) {
  return !vacationId ? (
    <Typography className={classes.emptyState}>בחרו חופשה בתפריט העליון</Typography>
  ) : (
    <div>
      {/* Existing doc types */}
      <div style={{ marginBottom: "20px" }}>
        {docTypes.length === 0 ? (
          <Typography className={classes.emptyState} style={{ padding: "16px 0", textAlign: "right" }}>
            אין סוגי מסמכים מוגדרים עדיין
          </Typography>
        ) : (
          docTypes.map((dt) => (
            <div key={dt.id} className={classes.docTypeItem}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ArticleIcon style={{ fontSize: 16, color: "#94a3b8" }} />
                <Typography className={classes.docTypeLabel}>{dt.label}</Typography>
              </div>
              <Tooltip title="מחק">
                <IconButton size="small" onClick={() => handleDeleteDocType(dt.id)}>
                  <DeleteOutlineIcon style={{ fontSize: 16, color: "#ef4444" }} />
                </IconButton>
              </Tooltip>
            </div>
          ))
        )}
      </div>

      {/* Add new */}
      <Divider style={{ marginBottom: "16px" }} />
      <Typography style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
        הוספת סוג מסמך חדש
      </Typography>
      <div style={{ display: "flex", gap: "10px" }}>
        <TextField
          value={newDocLabel}
          onChange={(e) => setNewDocLabel(e.target.value)}
          size="small"
          placeholder="שם הסוג (עברית)"
          className={classes.input}
          style={{ flex: 1 }}
          onKeyDown={(e) => { if (e.key === "Enter") handleAddDocType(); }}
          inputProps={{ dir: "rtl" }}
        />
        <Button
          className={classes.btnOutline}
          onClick={handleAddDocType}
          disabled={!newDocLabel.trim() || addingDocType}
          startIcon={addingDocType ? <CircularProgress size={13} color="inherit" /> : <AddIcon style={{ fontSize: 15 }} />}
        >
          הוסף
        </Button>
      </div>
    </div>
  );
}

function FlightCompaniesTab({ flightCompanies, newCompanyName, setNewCompanyName, addingCompany, handleAddCompany, handleDeleteCompany, classes }) {
  return (
    <div>
      {/* Existing companies */}
      <div style={{ marginBottom: "20px" }}>
        {flightCompanies.length === 0 ? (
          <Typography className={classes.emptyState} style={{ padding: "16px 0", textAlign: "right" }}>
            אין חברות תעופה מוגדרות עדיין
          </Typography>
        ) : (
          flightCompanies.map((co) => (
            <div key={co.id} className={classes.docTypeItem}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FlightIcon style={{ fontSize: 16, color: "#94a3b8" }} />
                <Typography className={classes.docTypeLabel}>{co.name}</Typography>
              </div>
              <Tooltip title="מחק">
                <IconButton size="small" onClick={() => handleDeleteCompany(co.id)}>
                  <DeleteOutlineIcon style={{ fontSize: 16, color: "#ef4444" }} />
                </IconButton>
              </Tooltip>
            </div>
          ))
        )}
      </div>

      {/* Add new */}
      <Divider style={{ marginBottom: "16px" }} />
      <Typography style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
        הוספת חברת תעופה חדשה
      </Typography>
      <div style={{ display: "flex", gap: "10px" }}>
        <TextField
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          size="small"
          placeholder="שם החברה"
          className={classes.input}
          style={{ flex: 1 }}
          onKeyDown={(e) => { if (e.key === "Enter") handleAddCompany(); }}
          inputProps={{ dir: "rtl" }}
        />
        <Button
          className={classes.btnOutline}
          onClick={handleAddCompany}
          disabled={!newCompanyName.trim() || addingCompany}
          startIcon={addingCompany ? <CircularProgress size={13} color="inherit" /> : <AddIcon style={{ fontSize: 15 }} />}
        >
          הוסף
        </Button>
      </div>
    </div>
  );
}

function PaymentsProviderTab({ providerConfig, onProviderFieldChange, savingProvider, providerSaved, handleSaveProvider, classes }) {
  if (!providerConfig) return null;

  return (
    <div>
      {/* Test mode badge */}
      {providerConfig.isTestMode && (
        <div className={classes.testBadge}>
          <ScienceIcon style={{ fontSize: 13 }} />
          מצב בדיקה פעיל — תשלומים לא יחויבו בפועל
        </div>
      )}

      {/* Credentials */}
      <Typography style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "12px" }}>
        פרטי חיבור
      </Typography>
      <div className={classes.fieldRow} style={{ marginBottom: "16px" }}>
        <div>
          <span className={classes.fieldLabel}>מספר טרמינל *</span>
          <TextField
            value={providerConfig.terminalNumber}
            onChange={(e) => onProviderFieldChange("terminalNumber", e.target.value)}
            size="small" fullWidth placeholder="לדוג׳ 1000"
            className={classes.input} inputProps={{ dir: "ltr" }}
          />
        </div>
        <div>
          <span className={classes.fieldLabel}>שם משתמש API *</span>
          <TextField
            value={providerConfig.apiName}
            onChange={(e) => onProviderFieldChange("apiName", e.target.value)}
            size="small" fullWidth placeholder="לדוג׳ CardTest1994"
            className={classes.input} inputProps={{ dir: "ltr" }}
          />
        </div>
      </div>

      {/* Business info */}
      <Typography style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "12px" }}>
        פרטי עסק (לחשבוניות)
      </Typography>
      <div className={classes.fieldRow} style={{ marginBottom: "12px" }}>
        <div>
          <span className={classes.fieldLabel}>שם העסק</span>
          <TextField
            value={providerConfig.businessName}
            onChange={(e) => onProviderFieldChange("businessName", e.target.value)}
            size="small" fullWidth placeholder="שם העסק / חברה"
            className={classes.input}
          />
        </div>
        <div>
          <span className={classes.fieldLabel}>ח״פ / ע״מ</span>
          <TextField
            value={providerConfig.vatNumber}
            onChange={(e) => onProviderFieldChange("vatNumber", e.target.value)}
            size="small" fullWidth placeholder="מספר ח״פ"
            className={classes.input} inputProps={{ dir: "ltr" }}
          />
        </div>
      </div>
      <div className={classes.fieldRow} style={{ marginBottom: "20px" }}>
        <div>
          <span className={classes.fieldLabel}>סוג מסמך</span>
          <FormControl size="small" fullWidth>
            <Select
              value={providerConfig.invoiceDocType}
              onChange={(e) => onProviderFieldChange("invoiceDocType", e.target.value)}
              sx={{ fontSize: 13, borderRadius: "8px", backgroundColor: "#fff", "& fieldset": { borderColor: "#e2e8f0" } }}
              MenuProps={{ style: { zIndex: 1700 } }}
            >
              {DOC_TYPE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value} style={{ fontSize: 13 }}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <span className={classes.fieldLabel}>סוג עסק</span>
          <FormControl size="small" fullWidth>
            <Select
              value={providerConfig.businessType}
              onChange={(e) => onProviderFieldChange("businessType", e.target.value)}
              sx={{ fontSize: 13, borderRadius: "8px", backgroundColor: "#fff", "& fieldset": { borderColor: "#e2e8f0" } }}
              MenuProps={{ style: { zIndex: 1700 } }}
            >
              {BUSINESS_TYPE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value} style={{ fontSize: 13 }}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Test mode toggle */}
      <div className={classes.toggleRow} style={{ marginBottom: "24px" }}>
        <div>
          <Typography className={classes.toggleLabel}>מצב בדיקה (Test Mode)</Typography>
          <Typography className={classes.toggleHint}>
            כרטיס לבדיקה: 4580000000000000 | תפוגה: 01/28 | CVV: 123
          </Typography>
        </div>
        <Switch
          checked={providerConfig.isTestMode}
          onChange={(e) => onProviderFieldChange("isTestMode", e.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": { color: "#0d9488" },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0d9488" },
          }}
        />
      </div>

      {/* Save */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          className={providerSaved ? classes.btnSuccess : classes.btnPrimary}
          onClick={handleSaveProvider}
          disabled={savingProvider || !providerConfig.terminalNumber || !providerConfig.apiName}
          startIcon={
            savingProvider ? <CircularProgress size={13} color="inherit" /> :
            providerSaved  ? <CheckIcon style={{ fontSize: 15 }} /> : null
          }
        >
          {providerSaved ? "נשמר!" : "שמור הגדרות"}
        </Button>
      </div>
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────────

function SettingsView(props) {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState("leads");

  const activeTabDef = TABS.find((t) => t.key === activeTab);

  return (
    <div className={classes.root}>
      {/* ── Sidebar nav ── */}
      <div className={classes.sidebar}>
        <div className={classes.sidebarHeader}>
          <Typography className={classes.sidebarTitle}>הגדרות</Typography>
          <Typography className={classes.sidebarSubtitle}>ניהול המערכת</Typography>
        </div>

        <nav className={classes.navList}>
          {TABS.map(({ key, label, Icon }) => (
            <div
              key={key}
              className={`${classes.navItem} ${activeTab === key ? classes.navItemActive : ""}`}
              onClick={() => setActiveTab(key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveTab(key); }}
            >
              <Icon className={classes.navIcon} />
              <Typography className={classes.navLabel}>{label}</Typography>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Content panel ── */}
      <div className={classes.content}>
        {/* Tab header */}
        {activeTabDef && (
          <div className={classes.tabHeader}>
            <div className={classes.tabIconWrap}>
              <activeTabDef.Icon className={classes.tabHeaderIcon} />
            </div>
            <div className={classes.tabHeaderText}>
              <Typography className={classes.tabTitle}>{activeTabDef.title}</Typography>
              <Typography className={classes.tabDesc}>{activeTabDef.desc}</Typography>
            </div>
          </div>
        )}

        {/* Tab content */}
        {activeTab === "leads" && <LeadsTab {...props} classes={classes} />}
        {activeTab === "agreement" && <AgreementTab {...props} classes={classes} />}
        {activeTab === "docs" && <DocsTab {...props} classes={classes} />}
        {activeTab === "airlines" && <FlightCompaniesTab {...props} classes={classes} />}
        {activeTab === "payments" && <PaymentsProviderTab {...props} classes={classes} />}
      </div>
    </div>
  );
}

export default SettingsView;
