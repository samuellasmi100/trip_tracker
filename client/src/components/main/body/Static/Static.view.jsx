import { Grid, Typography } from "@mui/material";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function StaticView() {
  return (
    <Grid
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 48px)",
        color: "#94a3b8",
        gap: "8px",
      }}
    >
      <InfoOutlinedIcon style={{ fontSize: "48px", color: "#e2e8f0" }} />
      <Typography style={{ fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "#94a3b8" }}>
        בחר נושא מהתפריט
      </Typography>
    </Grid>
  );
}

export default StaticView;
