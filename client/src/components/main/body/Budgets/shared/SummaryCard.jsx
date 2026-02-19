import React from "react";
import { Typography } from "@mui/material";

const SummaryCard = ({ title, value, color = "#1e293b", icon, suffix = "₪" }) => {
  const formattedValue = typeof value === "number"
    ? value.toLocaleString("he-IL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : value;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px 20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        flex: 1,
        minWidth: "160px",
      }}
    >
      <Typography
        sx={{
          color: "#64748b",
          fontSize: "13px",
          fontWeight: 500,
          marginBottom: "6px",
        }}
      >
        {icon && <span style={{ marginLeft: "6px" }}>{icon}</span>}
        {title}
      </Typography>
      <Typography
        sx={{
          color: color,
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        {formattedValue} {suffix}
      </Typography>
    </div>
  );
};

export default SummaryCard;
