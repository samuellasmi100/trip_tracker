import React, { useRef } from "react";
import {
  Button,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Typography
} from "@mui/material";
import { useStyles } from "./BudgetManager.style";
import { useSelector } from "react-redux";


const BudgetManager = (props) => {
  const form = useSelector((state) => state.budgetSlice.form)
  const classes = useStyles();

  const {
    handleInputChange,
    submit,
    handleCloseClicked
  } = props;


  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 צפי הוצאות כללי
              </InputLabel>
              <TextField
                name="amount"
                value={form.amount}
                className={classes.textField}
                onChange={handleInputChange} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={5}>
          <Grid container spacing={2} justifyContent="center">
          <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                תאריך הוספת תקציב
              </InputLabel>
              <TextField
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Grid>

      </Grid>
      <Grid
        item
        xs={12}
        container
        style={{ marginTop: "150px" }}
        justifyContent="space-around">
        <Grid item>
          <Button
            onClick={submit}
            className={classes.submitButton}
          >עדכן בסיס תקציב
          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton} onClick={handleCloseClicked}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default BudgetManager;
