import React from "react";
import {
  FormControl, InputLabel, Select, MenuItem,
  LinearProgress, Skeleton, IconButton, Tooltip, Chip, Box, Badge,
} from "@mui/material";
import RefreshIcon        from "@mui/icons-material/Refresh";
import PeopleAltIcon      from "@mui/icons-material/PeopleAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HotelIcon          from "@mui/icons-material/Hotel";
import FlightTakeoffIcon  from "@mui/icons-material/FlightTakeoff";
import LeaderboardIcon    from "@mui/icons-material/Leaderboard";
import AssignmentIcon     from "@mui/icons-material/Assignment";
import GroupsIcon         from "@mui/icons-material/Groups";
import WarningAmberIcon   from "@mui/icons-material/WarningAmber";
import { Doughnut }       from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { useStyles }      from "./Dashboard.style";

ChartJS.register(ArcElement, ChartTooltip, Legend);

const DOUGHNUT_OPTS = {
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  cutout: "70%",
  animation: { duration: 500 },
};

const fmt = (n) => Number(n).toLocaleString("he-IL");
const fmtCurrency = (n) => `₪${fmt(n)}`;
const pct = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0);

// ── Reusable mini stat row ────────────────────────────────────────────────────
function StatRow({ color, label, value, total, warn }) {
  const p = pct(value, total);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: warn && value > 0 ? "#ef4444" : "#475569", marginBottom: "3px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {warn && value > 0 && <WarningAmberIcon style={{ fontSize: "14px", color: "#ef4444" }} />}
          {label}
        </span>
        <span style={{ fontWeight: 700, color: warn && value > 0 ? "#ef4444" : "#0f172a" }}>
          {value}{total ? `/${total}` : ""}
        </span>
      </div>
      {total > 0 && (
        <LinearProgress
          variant="determinate"
          value={Math.min(p, 100)}
          sx={{
            height: 6, borderRadius: 4,
            backgroundColor: "#e2e8f0",
            "& .MuiLinearProgress-bar": { backgroundColor: color, borderRadius: 4 },
          }}
        />
      )}
    </div>
  );
}

// ── Donut card ────────────────────────────────────────────────────────────────
function DonutCard({ title, icon, iconClass, segments, classes, footer }) {
  const hasData = segments.some((s) => s.value > 0);
  const chartData = {
    labels: segments.map((s) => s.label),
    datasets: [{
      data: hasData ? segments.map((s) => s.value) : [1],
      backgroundColor: hasData ? segments.map((s) => s.color) : ["#e2e8f0"],
      borderWidth: 0,
    }],
  };
  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <p className={classes.cardTitle}>{title}</p>
        <div className={`${classes.cardIconWrap} ${iconClass}`}>{icon}</div>
      </div>
      <div className={classes.chartWrap}>
        <div className={classes.chartCanvas}>
          <Doughnut data={chartData} options={DOUGHNUT_OPTS} />
        </div>
        <div className={classes.legendList}>
          {segments.map((s) => (
            <div key={s.label} className={classes.legendRow}>
              <div className={classes.legendLeft}>
                <span className={classes.legendDot} style={{ backgroundColor: s.color }} />
                <span>{s.label}</span>
              </div>
              <span className={classes.legendCount} style={s.warn && s.value > 0 ? { color: "#ef4444" } : {}}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {footer}
    </div>
  );
}

function SkeletonCards({ classes }) {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={classes.skeletonCard}>
          <Skeleton variant="text" width="55%" height={18} />
          <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 2, mt: 2 }} />
        </div>
      ))}
    </>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
function DashboardView({ vacations, selectedIds, onVacationChange, data, loading, lastUpdated, onRefresh, crossFamilies }) {
  const classes = useStyles();
  const vacationNameMap = Object.fromEntries(vacations.map((v) => [v.vacation_id, v.name]));

  const roomPct     = data ? pct(data.rooms.occupied,          data.rooms.total)             : 0;
  const collectedPct= data ? pct(data.payments.totalPaid,      data.payments.totalExpected)  : 0;
  const bookingPct  = data ? pct(data.bookings.submitted,      data.bookings.total)          : 0;
  const outstanding = data ? Math.max(0, data.payments.totalExpected - data.payments.totalPaid) : 0;

  return (
    <div className={classes.page}>

      {/* ── Top bar ── */}
      <div className={classes.topBar}>
        <h1 className={classes.pageTitle}>דשבורד</h1>
        <div className={classes.topBarRight}>
          {lastUpdated && <span className={classes.lastUpdated}>עודכן: {lastUpdated}</span>}
          <Tooltip title="רענן נתונים">
            <span>
              <IconButton size="small" onClick={onRefresh} disabled={loading || selectedIds.length === 0} style={{ color: "#0d9488" }}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <FormControl sx={{ minWidth: 280, backgroundColor: "#fff", borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}>
            <InputLabel sx={{ fontSize: "15px" }}>בחר חופשה</InputLabel>
            <Select
              multiple
              value={selectedIds}
              label="בחר חופשה"
              onChange={(e) => onVacationChange(e.target.value)}
              sx={{ fontSize: "15px", minHeight: "48px" }}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => (
                    <Chip key={id} label={vacationNameMap[id] || id} size="small"
                      sx={{ backgroundColor: "rgba(13,148,136,0.12)", color: "#0d9488", fontWeight: 600 }} />
                  ))}
                </Box>
              )}
            >
              {vacations.map((v) => (
                <MenuItem key={v.vacation_id} value={v.vacation_id} sx={{ fontSize: "15px" }}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {selectedIds.length === 0 && (
        <p className={classes.emptyState}>בחר חופשה כדי לראות את הנתונים</p>
      )}

      {selectedIds.length > 0 && (
        <div className={classes.cardsGrid}>
          {loading ? <SkeletonCards classes={classes} /> : !data ? (
            <p className={classes.emptyState}>לא נמצאו נתונים</p>
          ) : (
            <>
              {/* ── 1. Families & Guests ── */}
              <div className={classes.card}>
                <div className={classes.cardHeader}>
                  <p className={classes.cardTitle}>משפחות ואורחים</p>
                  <div className={`${classes.cardIconWrap} ${classes.cardIconTeal}`}>
                    <PeopleAltIcon style={{ fontSize: "20px" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "24px" }}>
                  <div>
                    <div className={classes.bigNumber}>{fmt(data.families.total)}</div>
                    <div className={classes.bigNumberSub}>משפחות</div>
                  </div>
                  <div style={{ width: "1px", backgroundColor: "#e2e8f0" }} />
                  <div>
                    <div className={classes.bigNumber}>{fmt(data.families.totalGuests)}</div>
                    <div className={classes.bigNumberSub}>אורחים</div>
                  </div>
                </div>
              </div>

              {/* ── 2. Financial ── */}
              <div className={classes.card}>
                <div className={classes.cardHeader}>
                  <p className={classes.cardTitle}>תמונת כספים</p>
                  <div className={`${classes.cardIconWrap} ${classes.cardIconGreen}`}>
                    <AccountBalanceIcon style={{ fontSize: "20px" }} />
                  </div>
                </div>
                <div>
                  <div className={classes.bigNumber}>{collectedPct}%</div>
                  <div className={classes.bigNumberSub}>נגבה</div>
                </div>
                <div>
                  <div className={classes.progressLabel}>
                    <span>שולם: {fmtCurrency(data.payments.totalPaid)}</span>
                    <span>צפוי: {fmtCurrency(data.payments.totalExpected)}</span>
                  </div>
                  <LinearProgress variant="determinate" value={Math.min(collectedPct, 100)} className={classes.progressBar} />
                  {outstanding > 0 && (
                    <div className={classes.progressMeta} style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
                      <WarningAmberIcon style={{ fontSize: "14px" }} />
                      יתרה לגבייה: {fmtCurrency(outstanding)}
                    </div>
                  )}
                </div>
              </div>

              {/* ── 3. Room Occupancy ── */}
              <div className={classes.card}>
                <div className={classes.cardHeader}>
                  <p className={classes.cardTitle}>ניצולת חדרים</p>
                  <div className={`${classes.cardIconWrap} ${classes.cardIconBlue}`}>
                    <HotelIcon style={{ fontSize: "20px" }} />
                  </div>
                </div>
                <div>
                  <div className={classes.bigNumber}>{roomPct}%</div>
                  <div className={classes.bigNumberSub}>תפוסה</div>
                </div>
                <div>
                  <div className={classes.progressLabel}>
                    <span>{data.rooms.occupied} משפחות עם חדר</span>
                    <span>מתוך {data.rooms.total} חדרים</span>
                  </div>
                  <LinearProgress variant="determinate" value={Math.min(roomPct, 100)} className={classes.progressBar} />
                  {data.rooms.withoutRoom > 0 && (
                    <div className={classes.progressMeta} style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                      <WarningAmberIcon style={{ fontSize: "14px" }} />
                      {data.rooms.withoutRoom} משפחות ללא חדר
                    </div>
                  )}
                </div>
              </div>

              {/* ── 4. Flight Readiness ── */}
              <div className={classes.card}>
                <div className={classes.cardHeader}>
                  <p className={classes.cardTitle}>מוכנות לטיסה</p>
                  <div className={`${classes.cardIconWrap} ${classes.cardIconPurple}`}>
                    <FlightTakeoffIcon style={{ fontSize: "20px" }} />
                  </div>
                </div>
                {data.flightReadiness.totalGuests === 0 ? (
                  <p className={classes.emptyState}>אין נתוני טיסה</p>
                ) : (
                  <div>
                    <div style={{ marginBottom: "12px" }}>
                      <span className={classes.bigNumber}>{pct(data.flightReadiness.fullyReady, data.flightReadiness.totalGuests)}%</span>
                      <span className={classes.bigNumberSub} style={{ marginRight: "8px" }}>מוכנים לחלוטין</span>
                    </div>
                    <StatRow color="#0d9488" label="דרכון"            value={data.flightReadiness.withPassport}  total={data.flightReadiness.totalGuests} />
                    <StatRow color="#3b82f6" label="תאריך לידה"       value={data.flightReadiness.withBirthdate} total={data.flightReadiness.totalGuests} />
                    <StatRow color="#8b5cf6" label="טיסת יציאה"       value={data.flightReadiness.withOutbound}  total={data.flightReadiness.totalGuests} />
                    <StatRow color="#a78bfa" label="טיסת חזרה"        value={data.flightReadiness.withReturn}    total={data.flightReadiness.totalGuests}
                      warn={data.flightReadiness.withOutbound > data.flightReadiness.withReturn} />
                    <StatRow color="#16a34a" label="✅ מוכן לחלוטין"  value={data.flightReadiness.fullyReady}    total={data.flightReadiness.totalGuests} />
                  </div>
                )}
              </div>

              {/* ── 5. Leads pipeline ── */}
              <DonutCard
                title="לידים"
                icon={<LeaderboardIcon style={{ fontSize: "20px" }} />}
                iconClass={classes.cardIconAmber}
                classes={classes}
                segments={[
                  { label: "נרשמו",          value: data.leads.registered,  color: "#16a34a" },
                  { label: "בתהליך",          value: data.leads.active,      color: "#0d9488" },
                  { label: "חדשים / לא ענה",  value: data.leads.newCold,     color: "#f59e0b" },
                  { label: "לא רלוונטי",      value: data.leads.notRelevant, color: "#e2e8f0" },
                ]}
                footer={
                  <div style={{ fontSize: "12px", color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                    סה״כ {data.leads.total} לידים · המרה {pct(data.leads.registered, data.leads.total)}%
                  </div>
                }
              />

              {/* ── 6. Booking forms ── */}
              <div className={classes.card}>
                <div className={classes.cardHeader}>
                  <p className={classes.cardTitle}>הגשת טפסי הזמנה</p>
                  <div className={`${classes.cardIconWrap} ${classes.cardIconTeal}`}>
                    <AssignmentIcon style={{ fontSize: "20px" }} />
                  </div>
                </div>
                <div>
                  <div className={classes.bigNumber}>{data.bookings.submitted}</div>
                  <div className={classes.bigNumberSub}>מתוך {data.bookings.total} משפחות הגישו טופס</div>
                </div>
                <div>
                  <div className={classes.progressLabel}>
                    <span>{bookingPct}% הגישו</span>
                    <span>{data.bookings.notSubmitted} טרם הגישו</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(bookingPct, 100)}
                    sx={{
                      height: 10, borderRadius: 6,
                      backgroundColor: "#e2e8f0",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#0d9488", borderRadius: 6 },
                    }}
                  />
                </div>
              </div>

              {/* ── 7. Cross-vacation families (only when 2+ vacations) ── */}
              {crossFamilies.length > 0 && (
                <div className={classes.card} style={{ gridColumn: "1 / -1" }}>
                  <div className={classes.cardHeader}>
                    <p className={classes.cardTitle}>
                      משפחות חוזרות — מופיעות ביותר מחופשה אחת
                    </p>
                    <div className={`${classes.cardIconWrap} ${classes.cardIconTeal}`}>
                      <GroupsIcon style={{ fontSize: "20px" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "160px", overflowY: "auto" }}>
                    {crossFamilies.map((f) => (
                      <Chip
                        key={f.familyName}
                        label={`${f.familyName} (${f.vacationCount} חופשות)`}
                        sx={{
                          backgroundColor: "rgba(13,148,136,0.1)",
                          color: "#0d9488",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
                    {crossFamilies.length} משפחות חוזרות מתוך החופשות שנבחרו
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardView;
