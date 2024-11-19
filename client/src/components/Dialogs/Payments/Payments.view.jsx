import React ,{useState} from "react";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  OutlinedInput
} from "@mui/material";
import { useStyles } from "./Payments.style";
import { useSelector } from "react-redux";
import * as paymentsSlice from "../../../store/slice/paymentsSlice"
import "./Payments.css"

const PaymentsView = (props) => {
  const formOfPayment = ["מזומן","העברה בנקאית","כרטיס אשראי"]
  const form = useSelector((state) => state.paymentsSlice.form)
  const classes = useStyles();
  const {
    handleInputChange
  } = props;

    return (
      <>
      <Grid container style={{ minHeight: "350px", padding: "20px" }} >
        <Grid item xs={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                סכום עסקה
              </InputLabel>
              <TextField
              name="amount"
              value={form.amount}
                className={classes.textField}
              onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                סכום תקבול
              </InputLabel>
              <TextField
                name="amountReceived"
                value={form.amountReceived}
                className={classes.textField}
                onChange={handleInputChange}

              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
               תאריך תשלום
              </InputLabel>
              <TextField
                 type="date"
                 name="PaymentDate"
                 value={form.PaymentDate}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
           
          </Grid>
        </Grid>
        <Grid item xs={5}>
        <Grid container spacing={2} justifyContent="center">
        <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
              צורת תשלום
              </InputLabel>
              {/* <TextField
                 name="formOfPayment"
                value={form.formOfPayment}
                className={classes.textField}
                onChange={handleInputChange}
              /> */}
               <Select
               name="formOfPayment"
               value={form.formOfPayment}
               onChange={handleInputChange}
                
                input={
                  <OutlinedInput
                  value={form.formOfPayment}
                    className={classes.selectOutline}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                      paddinTop: "110px !important",
                    },
                  },
              }}>
          {formOfPayment?.map((type) => (
            <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
              {type}
            </MenuItem>
          ))}
        </Select>
            </Grid>
        <Grid item>
              <InputLabel className={classes.inputLabelStyle}>נותר לתשלום</InputLabel>
              <TextField
              name="remainsToBePaid"
                value={form.remainsToBePaid}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>מטבע תשלום</InputLabel>
              <TextField
                name="paymentCurrency"
                value={form.paymentCurrency}
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
        style={{ marginTop: "30px" }}
        justifyContent="space-around">
        <Grid item>
          <Button
            className={classes.submitButton}
          >צור אורח
          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentsView;
