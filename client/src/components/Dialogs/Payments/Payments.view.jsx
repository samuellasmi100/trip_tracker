import React from "react";
import {
  Button,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from "@mui/material";
import { useStyles } from "./Payments.style";
import "./Payments.css"
import { useDispatch,useSelector } from "react-redux";


const PaymentsView = (props) => {
  const formOfPayment = ["מזומן","העברה בנקאית","כרטיס אשראי","המחאות"]
  const paymentCurrency = ["שקל","דולר","יורו"]
  const form = useSelector((state) => state.paymentsSlice.form)
  const classes = useStyles();

  const {
    handleInputChange,
    submit,
    handleCloseClicked
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
                 name="paymentDate"
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
               <Select
               name="formOfPayment"
               onChange={handleInputChange}     
                input={
                  <OutlinedInput
                    className={classes.selectOutline}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
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
              <Select
               name="paymentCurrency"
               onChange={handleInputChange}
                
                input={
                  <OutlinedInput
                    className={classes.selectOutline}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                    },
                  },
              }}>
          {paymentCurrency?.map((type) => (
            <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
              {type}
            </MenuItem>
          ))}
        </Select>
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
          onClick={submit}
            className={classes.submitButton}
          >עדכן תשלום
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

export default PaymentsView;
