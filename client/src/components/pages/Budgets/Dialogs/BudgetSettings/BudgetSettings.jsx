import React from "react";
import { Typography, Divider } from "@mui/material";
import ExchangeRateManager from "../ExchangeRateManager/ExchangeRateManager";
import { useStyles } from "./BudgetSettings.style";

const BudgetSettings = ({ closeModal }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>הגדרות</Typography>
      <Divider className={classes.divider} />
      <ExchangeRateManager closeModal={closeModal} />
    </div>
  );
};

export default BudgetSettings;
