import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, TextField, Button } from "@mui/material";
import ApiBudgets from "../../../../../../apis/budgetsRequest";
import { useStyles } from "./ExchangeRateManager.style";

const ExchangeRateManager = ({ closeModal }) => {
  const classes = useStyles();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);

  const [dollarRate, setDollarRate] = useState("");
  const [euroRate, setEuroRate] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      if (!vacationId) return;
      try {
        const response = await ApiBudgets.getExchangeRates(token, vacationId);
        const rates = response.data || [];
        rates.forEach((r) => {
          if (r.ccy === "דולר") setDollarRate(r.amount || "");
          if (r.ccy === "יורו") setEuroRate(r.amount || "");
        });
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };
    fetchRates();
  }, [vacationId]);

  const handleSave = async () => {
    try {
      if (dollarRate) {
        await ApiBudgets.updateExchangeRate(token, vacationId, {
          ccy: "דולר",
          amount: dollarRate,
        });
      }
      if (euroRate) {
        await ApiBudgets.updateExchangeRate(token, vacationId, {
          ccy: "יורו",
          amount: euroRate,
        });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving exchange rates:", error);
    }
  };

  return (
    <div>
      <Typography className={classes.sectionTitle}>שערי חליפין</Typography>

      <div className={classes.rateRow}>
        <Typography className={classes.currencyLabel}>דולר</Typography>
        <TextField
          value={dollarRate}
          onChange={(e) => setDollarRate(e.target.value)}
          className={classes.textField}
          placeholder="לדוגמה: 3.65"
          type="number"
          inputProps={{ step: "0.01", min: "0" }}
        />
      </div>

      <div className={classes.rateRow}>
        <Typography className={classes.currencyLabel}>יורו</Typography>
        <TextField
          value={euroRate}
          onChange={(e) => setEuroRate(e.target.value)}
          className={classes.textField}
          placeholder="לדוגמה: 3.95"
          type="number"
          inputProps={{ step: "0.01", min: "0" }}
        />
      </div>

      <div className={classes.actions}>
        <Button onClick={handleSave} className={classes.submitButton}>
          שמור
        </Button>
        <Button onClick={closeModal} className={classes.cancelButton}>
          ביטול
        </Button>
      </div>
    </div>
  );
};

export default ExchangeRateManager;
