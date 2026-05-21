import React from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import PaymentsIcon from "@mui/icons-material/Payments";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const InfoRow = ({ label, value }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <Box sx={{ display: "flex", gap: 1.5, mb: 0.75, alignItems: "flex-start" }}>
      <Typography sx={{ fontSize: 13, color: "#64748b", minWidth: 130, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>
        {value}
      </Typography>
    </Box>
  );
};

const SectionHeader = ({ icon, label, color = "#3b82f6" }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, mt: 2.5 }}>
    <Box sx={{ color, display: "flex" }}>{icon}</Box>
    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{label}</Typography>
    <Divider sx={{ flex: 1, borderColor: "#e2e8f0" }} />
  </Box>
);

const PAYMENT_METHOD_LABEL = {
  מזומן: "מזומן",
  cash: "מזומן",
  credit: "כרטיס אשראי",
  transfer: "העברה בנקאית",
  check: "המחאה",
};

const STATUS_CONFIG = {
  completed: { label: "בוצע",  color: "#16a34a", bg: "#dcfce7" },
  pending:   { label: "ממתין", color: "#d97706", bg: "#fef3c7" },
  cancelled: { label: "בוטל",  color: "#dc2626", bg: "#fee2e2" },
};

// Strip the time portion MySQL appends to DATE/DATETIME columns ("2032-01-21 00:00:00" → "2032-01-21")
const fmtDate = (val) => val ? String(val).split('T')[0].split(' ')[0] : val;

const ChildDetailsView = ({ userData }) => {
  const userDetails   = userData?.userDetails?.[0];
  const flightDetails = userData?.flightsDetails?.[0];
  const roomsDetails  = userData?.roomsDetails;
  const notesDetails  = userData?.notesDetails;
  const paymentsDetails = userData?.paymentsDetails || [];

  const fullNameHe = [userDetails?.hebrew_first_name, userDetails?.hebrew_last_name]
    .filter(Boolean).join(" ");
  const fullNameEn = [userDetails?.english_first_name, userDetails?.english_last_name]
    .filter(Boolean).join(" ");

  const isFlying = String(userDetails?.flights) === "1"
    || !!flightDetails?.passport_number
    || !!flightDetails?.outbound_flight_date;
  const flightDirectionLabel = {
    one_way_outbound: "הלוך בלבד",
    one_way_return:   "חזור בלבד",
  }[userDetails?.flights_direction] || "הלוך וחזור";

  const totalAmount = Number(userDetails?.total_amount) || 0;
  const totalPaid = paymentsDetails
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const remaining = totalAmount - totalPaid;

  const showOutbound = userDetails?.flights_direction !== "one_way_return";
  const showReturn   = userDetails?.flights_direction !== "one_way_outbound";

  const age = userDetails?.age || flightDetails?.age;

  return (
    <Box sx={{ p: 1, direction: "rtl" }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
            {fullNameHe || "—"}
          </Typography>
          {fullNameEn && (
            <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>{fullNameEn}</Typography>
          )}
        </Box>
        {userDetails?.family_name && (
          <Chip
            label={userDetails.family_name}
            size="small"
            sx={{ backgroundColor: "#eff6ff", color: "#2563eb", fontWeight: 600, fontSize: 12 }}
          />
        )}
        {userDetails?.user_type === "parent" && (
          <Chip
            label="ראש משפחה"
            size="small"
            sx={{ backgroundColor: "#f0fdf4", color: "#16a34a", fontWeight: 600, fontSize: 11 }}
          />
        )}
      </Box>

      <Divider />

      {/* ── Personal Info ───────────────────────────────────────────────── */}
      <SectionHeader icon={<PersonOutlineIcon fontSize="small" />} label="פרטים אישיים" color="#6366f1" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <InfoRow label="ת.ז." value={userDetails?.identity_id} />
          <InfoRow label="גיל" value={age} />
          <InfoRow label="תאריך לידה" value={fmtDate(userDetails?.birth_date)} />
          <InfoRow label="כתובת" value={userDetails?.address} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow label="טלפון" value={userDetails?.phone_a} />
          <InfoRow label="טלפון נוסף" value={userDetails?.phone_b} />
          <InfoRow label="אימייל" value={userDetails?.email} />
        </Grid>
      </Grid>

      {/* ── Flight Info ─────────────────────────────────────────────────── */}
      <SectionHeader icon={<FlightIcon fontSize="small" />} label="פרטי טיסה" color="#0ea5e9" />
      <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
        <Chip
          icon={
            isFlying
              ? <CheckCircleOutlineIcon sx={{ fontSize: "15px !important" }} />
              : <CancelOutlinedIcon sx={{ fontSize: "15px !important" }} />
          }
          label={isFlying ? "טס עמנו" : "לא טס עמנו"}
          size="small"
          sx={{
            backgroundColor: isFlying ? "#dcfce7" : "#fee2e2",
            color: isFlying ? "#16a34a" : "#dc2626",
            fontWeight: 600,
            fontSize: 12,
          }}
        />
        {isFlying && (
          <Chip
            label={flightDirectionLabel}
            size="small"
            sx={{ backgroundColor: "#eff6ff", color: "#2563eb", fontWeight: 600, fontSize: 12 }}
          />
        )}
      </Box>
      {isFlying && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InfoRow label="מספר דרכון" value={flightDetails?.passport_number} />
            <InfoRow label="תוקף דרכון" value={fmtDate(flightDetails?.validity_passport)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            {showOutbound && (
              <>
                <InfoRow label="חברת תעופה הלוך" value={flightDetails?.outbound_airline} />
                <InfoRow label="תאריך הלוך" value={fmtDate(flightDetails?.outbound_flight_date)} />
                <InfoRow label="מספר טיסה הלוך" value={flightDetails?.outbound_flight_number} />
              </>
            )}
            {showReturn && (
              <>
                <InfoRow label="חברת תעופה חזור" value={flightDetails?.return_airline} />
                <InfoRow label="תאריך חזור" value={fmtDate(flightDetails?.return_flight_date)} />
                <InfoRow label="מספר טיסה חזור" value={flightDetails?.return_flight_number} />
              </>
            )}
          </Grid>
        </Grid>
      )}

      {/* ── Room ───────────────────────────────────────────────────────── */}
      {roomsDetails?.length > 0 && (
        <>
          <SectionHeader icon={<HotelIcon fontSize="small" />} label="חדר" color="#8b5cf6" />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InfoRow label="מספר חדר" value={roomsDetails[0]?.rooms_id} />
              <InfoRow label="סוג חדר" value={roomsDetails[0]?.type} />
              <InfoRow label="גודל" value={roomsDetails[0]?.size} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="קומה" value={roomsDetails[0]?.floor} />
              <InfoRow label="כיוון" value={roomsDetails[0]?.direction} />
              {roomsDetails[0]?.base_occupancy && (
                <InfoRow
                  label="תפוסה"
                  value={`${roomsDetails[0].base_occupancy}–${roomsDetails[0].max_occupancy}`}
                />
              )}
            </Grid>
          </Grid>
        </>
      )}

      {/* ── Payments ────────────────────────────────────────────────────── */}
      {userDetails?.user_type === "parent" && (
        <>
          <SectionHeader icon={<PaymentsIcon fontSize="small" />} label="תשלומים" color="#f59e0b" />
          <Box sx={{ display: "flex", gap: 2, mb: 1.5, flexWrap: "wrap" }}>
            <Paper elevation={0} sx={{ px: 2, py: 1, borderRadius: 2, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "center", minWidth: 90 }}>
              <Typography sx={{ fontSize: 11, color: "#64748b" }}>סכום כולל</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                ₪{totalAmount.toLocaleString()}
              </Typography>
            </Paper>
            <Paper elevation={0} sx={{ px: 2, py: 1, borderRadius: 2, backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", textAlign: "center", minWidth: 90 }}>
              <Typography sx={{ fontSize: 11, color: "#16a34a" }}>שולם</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>
                ₪{totalPaid.toLocaleString()}
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                px: 2, py: 1, borderRadius: 2,
                backgroundColor: remaining > 0 ? "#fff7ed" : "#f0fdf4",
                border: `1px solid ${remaining > 0 ? "#fed7aa" : "#bbf7d0"}`,
                textAlign: "center", minWidth: 90,
              }}
            >
              <Typography sx={{ fontSize: 11, color: remaining > 0 ? "#d97706" : "#16a34a" }}>
                יתרה
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: remaining > 0 ? "#d97706" : "#16a34a" }}>
                ₪{remaining.toLocaleString()}
              </Typography>
            </Paper>
          </Box>
          {paymentsDetails.length > 0 && (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#64748b", backgroundColor: "#f8fafc" }}>תאריך</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#64748b", backgroundColor: "#f8fafc" }}>סכום</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#64748b", backgroundColor: "#f8fafc" }}>אמצעי תשלום</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#64748b", backgroundColor: "#f8fafc" }}>סטטוס</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentsDetails.map((p) => {
                    const st = STATUS_CONFIG[p.status] || STATUS_CONFIG.completed;
                    return (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ fontSize: 12 }}>{p.paymentDate}</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>
                          ₪{Number(p.amount).toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          {PAYMENT_METHOD_LABEL[p.paymentMethod] || p.paymentMethod}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={st.label}
                            size="small"
                            sx={{ fontSize: 11, height: 20, backgroundColor: st.bg, color: st.color, fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* ── Notes ───────────────────────────────────────────────────────── */}
      {notesDetails?.length > 0 && (
        <>
          <SectionHeader icon={<NoteAltIcon fontSize="small" />} label="הערות" color="#64748b" />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {notesDetails.map((n, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{ px: 1.5, py: 1, borderRadius: 1.5, backgroundColor: "#fafafa", border: "1px solid #e2e8f0" }}
              >
                <Typography sx={{ fontSize: 13, color: "#475569" }}>{n.note}</Typography>
              </Paper>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChildDetailsView;
