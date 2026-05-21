import React from "react";
import { useSelector } from "react-redux";

const RequireVacation = ({ children }) => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);

  if (!vacationId) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 48px)",
          padding: "16px",
          textAlign: "center",
          color: "#1e293b",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
          אנא בחר חופשה
        </div>
        <div style={{ fontSize: "14px", color: "#64748b" }}>
          ניתן לבחור חופשה מהתפריט בראש הדף
        </div>
      </div>
    );
  }

  return children;
};

export default RequireVacation;
