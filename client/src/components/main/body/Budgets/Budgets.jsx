import React, { useState, useEffect } from "react";
import BudgetsView from "./Budgets.view";
import { Grid, Switch, FormControlLabel, Typography } from "@mui/material";
import Expence from "./ExpensesAndIncome/ExpensesAndIncome";
import FinancialForecast from "./FinancialForecast/FinancialForecast"
import * as budgetSlice from "../../../../store/slice/budgetSlice"
import { useDispatch,useSelector } from "react-redux";

const Budgets = () => {
  const dispatch = useDispatch()
  const isExpense = useSelector((state) => state.budgetSlice.incomeOrExpense)

  const handleToggle = (event) => {
   dispatch(budgetSlice.upadteIncomeOrExpense(event.target.checked))
  };



  return (

    <Grid style={{ display: "flex", flexDirection: "column" }}>
      <Grid style={{ height: "10vh" }}>
        <FormControlLabel
          control={
            <Switch
              checked={isExpense}
              onChange={handleToggle}
              name="toggleSwitch"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: isExpense  ? 'red' : 'green',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: isExpense ? 'red' : 'green',
                },
                '& .MuiSwitch-thumb': {
                  backgroundColor: isExpense  ? 'red' : 'green',
                },
                '& .MuiSwitch-track': {
                  backgroundColor: isExpense   ? '#f44336' : '#4caf50',
                },
              }}
            />
          }
          label={isExpense ? <Typography style={{ color: "white" }}>הוצאות</Typography> : <Typography style={{ color: "white" }}>הכנסות</Typography>}
        />
      </Grid>
      <Grid style={{ display: "flex", justifyContent: "center" }}>
        <FinancialForecast />

        <Expence />
      </Grid>


      {/* <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        closeModal={closeModal}
      /> */}
    </Grid>
  )
};

export default Budgets;
