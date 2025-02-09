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
import DescriptionIcon from "@mui/icons-material/Description";

const PaymentsView = (props) => {
  const formOfPayment = ["מזומן", "העברה בנקאית", "כרטיס אשראי", "המחאות"]
  const paymentCurrency = ["שקל", "דולר", "יורו"]
  const form = useSelector((state) => state.paymentsSlice.form)
  const userForm = useSelector((state) => state.userSlice.form)
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
      <Grid container style={{ minHeight: "350px", padding: "20px"}} >
        <Grid item xs={12} style={{maxHeight:"300px",overflow:"auto",overflowX:"hidden"}}>
          {[...Array(Number(userForm.number_of_payments))].map((_, index) => (
            <Grid container spacing={1} key={index}>
              <Grid item style={{marginTop: "18px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: "#686B76",
                              "&.Mui-checked": {
                                color: "#54A9FF",
                              },
                            }}
                            name={`isPaid_${index + 1}`}
                            checked={form[`isPaid_${index + 1}`] || false} 
                            className={classes.checkbox}
                            onChange={handleInputChange}
                          />
                        }
                      />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                  {"תשלום" + " " + (index + 1)}
                </InputLabel>
                <TextField
                  name={`amount_${index + 1}`}
                  value={form[`amountReceived_${index + 1}`]}
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
                  name={`paymentDate_${index + 1}`}  
                  value={form[`paymentDate_${index + 1}`]}  
                  className={classes.textField}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>צורת תשלום</InputLabel>
                <Select
                   name={`formOfPayment_${index + 1}`}
                   value={form[`formOfPayment_${index + 1}`] || ''}
                   onChange={handleInputChange}
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
                <InputLabel className={classes.inputLabelStyle}>מטבע תשלום</InputLabel>
                <Select
                   name={`paymentCurrency_${index + 1}`}
                   value={form[`paymentCurrency_${index + 1}`] || ""}
                  onChange={handleInputChange}
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
          ))}
        </Grid>
      </Grid>
      <Grid>

      <Grid style={{marginBottom:"30px"}}>
      <Grid>
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
                  checked={!!Number(form?.invoice)}
                />
              }
              label={
                <Typography style={{ color: "##757882", fontSize: "15px" }}>
                  חשבונית
                </Typography>
              }
            />
       </Grid>
        <Grid container style={{marginTop:"5px" }}>
            <Grid item style={{marginRight:"25px"}}>
              <DescriptionIcon style={{ color: "rgb(255, 158, 84)" }} />
            </Grid>
            <Grid item>
              <Typography variant="body1" style={{ color: "white", fontSize: "15px" }}>
                היסטוריית תשלומים
              </Typography>
            </Grid>
          </Grid>
     </Grid>
      <Grid
        item
        xs={12}
        container
        style={{ }}
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
      </Grid>
      
    </>
  );
};

export default PaymentsView;
