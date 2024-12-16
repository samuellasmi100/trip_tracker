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
import { useStyles } from "./Payments.style";
import "./Payments.css"
import { useSelector } from "react-redux";


const PaymentsView = (props) => {
  const formOfPayment = ["מזומן", "העברה בנקאית", "כרטיס אשראי", "המחאות"]
  const paymentCurrency = ["שקל", "דולר", "יורו"]
  const form = useSelector((state) => state.paymentsSlice.form)
  const classes = useStyles();

  const {
    handleInputChange,
    submit,
    handleCloseClicked
  } = props;

  const inputRefs = useRef([]);
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
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
                inputRef={(el) => (inputRefs.current[11] = el)}
                onKeyDown={(e) => handleKeyDown(e, 11)}
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
                inputRef={(el) => (inputRefs.current[12] = el)}
                onKeyDown={(e) => handleKeyDown(e, 12)}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                תאריך תשלום
              </InputLabel>
              <TextField
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                className={classes.textField}
                onChange={handleInputChange}
                inputRef={(el) => (inputRefs.current[13] = el)}
                onKeyDown={(e) => handleKeyDown(e, 13)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={5}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>צורת תשלום</InputLabel>
              <Select
                name="formOfPayment"
                value={form.formOfPayment}
                onChange={handleInputChange}
                inputRef={(el) => (inputRefs.current[14] = el)}
                onKeyDown={(e) => handleKeyDown(e, 14)}
                input={<OutlinedInput className={classes.selectOutline} />}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                    },
                  },
                }}
              >
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
                inputRef={(el) => (inputRefs.current[15] = el)}
                onKeyDown={(e) => handleKeyDown(e, 15)}
              />
            </Grid>

            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>מטבע תשלום</InputLabel>
              <Select
                name="paymentCurrency"
                value={form.paymentCurrency}
                onChange={handleInputChange}
                inputRef={(el) => (inputRefs.current[16] = el)}
                onKeyDown={(e) => handleKeyDown(e, 16)}
                input={<OutlinedInput className={classes.selectOutline} />}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                    },
                  },
                }}
              >
                {paymentCurrency?.map((type) => (
                  <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid style={{ marginRight: "20px" }}>
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "#686B76",
                  "&.Mui-checked": {
                    color: "#54A9FF",
                  },
                }}
                name="invoice"
                className={classes.checkbox}
                onClick={handleInputChange}
                checked={form?.invoice}
              />
            }
            label={
              <Typography style={{ color: "##757882", fontSize: "15px" }}>
                חשבונית
              </Typography>
            }
          />
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
