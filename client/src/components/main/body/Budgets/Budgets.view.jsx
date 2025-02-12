
import React, { useState, useEffect } from "react";
import { Grid, Switch, FormControlLabel, Typography } from "@mui/material";
import { useStyles } from "./Budgets.style";
import { useSelector } from "react-redux";
import Expense from "./ExpensesAndIncome/ExpensesAndIncome";
import FinancialForecast from "./FinancialForecast/FinancialForecast"
import MainDialog from "./Dialogs/MainDialog/MainDialog"


  function BudgetsView({handleToggle,dialogOpen,dialogType,handleDialogTypeOpen,closeModal}) {
    const isExpense = useSelector((state) => state.budgetSlice.isExpense)
    const sumExpectedExpensesAndIncome = useSelector((state => state.budgetSlice.sumExpectedExpensesAndIncome))
      const sumExpensesAndIncome = useSelector((state) => state.budgetSlice.sumExpensesAndIncome)

    return (
    <Grid style={{display:"flex",justifyContent:"center"}}>
     <Grid style={{ display: "flex", flexDirection: "column" }}>
      <Grid style={{ height: "10vh",marginTop:"20px" }}>
        <Grid>
        <FormControlLabel
          control={
            <Switch
              checked={isExpense}
              onChange={handleToggle}
              name="toggleSwitch"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: isExpense ? 'red' : 'green',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: isExpense ? 'red' : 'green',
                },
                '& .MuiSwitch-thumb': {
                  backgroundColor: isExpense ? 'red' : 'green',
                },
                '& .MuiSwitch-track': {
                  backgroundColor: isExpense ? '#f44336' : '#4caf50',
                },
              }}
            />
          }
          label={isExpense ? <Typography style={{ color: "white" }}>הוצאות</Typography> : <Typography style={{ color: "white" }}>הכנסות</Typography>}
        />
        </Grid>
        <Grid style={{display:"flex",justifyContent:"space-around",marginTop:"20px"}}>
        <Grid style={{height:"40px",width:"200px",border:"1px solid #494C55",borderRadius:"4px"}}>
          <Typography style={{color:"white",textAlign:"center",padding:"6px"}}>סכום כולל : {sumExpectedExpensesAndIncome}  </Typography>
        </Grid>
        <Grid style={{height:"40px",width:"200px",border:"1px solid #494C55",borderRadius:"4px"}}>
          <Typography style={{color:"white",textAlign:"center",padding:"6px"}}>סכום כולל : {sumExpensesAndIncome} </Typography>
        </Grid>
        </Grid>
       
      </Grid>
      <Grid>
        <Grid style={{ display: "flex", justifyContent: "center" ,marginRight:"40px"}}>
        <FinancialForecast handleDialogTypeOpen={handleDialogTypeOpen} />
        <Expense handleDialogTypeOpen={handleDialogTypeOpen} />
        {/* <Overview handleDialogTypeOpen={handleDialogTypeOpen} /> */}
        </Grid>
 
      </Grid>


      {<MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        closeModal={closeModal}

      />}
    </Grid>
    </Grid>
    )
  }
  
  export default BudgetsView;
  