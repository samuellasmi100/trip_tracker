import React from "react";
import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorIcon from "@mui/icons-material/Error";

const StatusChip = ({ isPaid, paymentDate }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pDate = new Date(paymentDate);
  pDate.setHours(0, 0, 0, 0);

  if (isPaid === 1) {
    return (
      <Chip
        icon={<CheckCircleIcon sx={{ fontSize: 16, color: "#22c55e !important" }} />}
        label="שולם"
        size="small"
        sx={{
          backgroundColor: "#f0fdf4",
          color: "#16a34a",
          fontWeight: 600,
          fontSize: "12px",
          border: "1px solid #bbf7d0",
        }}
      />
    );
  }

  if (pDate <= today) {
    return (
      <Chip
        icon={<ErrorIcon sx={{ fontSize: 16, color: "#ef4444 !important" }} />}
        label="באיחור"
        size="small"
        sx={{
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          fontWeight: 600,
          fontSize: "12px",
          border: "1px solid #fecaca",
        }}
      />
    );
  }

  return (
    <Chip
      icon={<AccessTimeIcon sx={{ fontSize: 16, color: "#f59e0b !important" }} />}
      label="מתוכנן"
      size="small"
      sx={{
        backgroundColor: "#fffbeb",
        color: "#d97706",
        fontWeight: 600,
        fontSize: "12px",
        border: "1px solid #fde68a",
      }}
    />
  );
};

export default StatusChip;
