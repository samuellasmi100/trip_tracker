import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Typography,
Checkbox,
FormControlLabel
} from "@mui/material";
import { useStyles } from "./Vacation.style";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as staticSlice from "../../../../../../store/slice/staticSlice"
import "./Vacation.css"
function VacationView({ submit, handleInputChange }) {

  const dispatch = useDispatch()
  const classes = useStyles();
  const form = useSelector((state) => state.staticSlice.form)
  const userForm = useSelector((state) => state.userSlice.form)
  
  const [startDate, setDate] = React.useState(new Date)
  const [rangeStart, setRangeStart] = React.useState(new Date)
  const defaultEndDate = new Date()
  defaultEndDate.setDate(defaultEndDate.getDate() + 7)
  const [rangeEnd, setRangeEnd] = React.useState(defaultEndDate)
  const today = new Date()

  return (
    <Grid container>
      <Grid
        item
        container
        xs={12}
        style={{ marginTop: "30px", marginLeft: "30px" }}
        alignContent="center"
        justifyContent="space-between">
        <Grid item xs={12} container justifyContent="center" style={{ marginTop: "20px", marginBottom: "30px" }}>
          הוסף חופשה
        </Grid>

      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              שם חופשה
            </InputLabel>
            <TextField
              name="vacation_name"
              className={classes.textField}
              value={form?.vacation_name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר מסלולים
            </InputLabel>
            <TextField
              name="vacation_routes"
              value={form?.vacation_routes}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>

        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Grid container spacing={1} justifyContent="center">
          {Array.from({ length: form?.vacation_routes }).map((_, index) => (
            <>
            <Grid style={{display:"flex",gap:"8px"}}>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 מתאריך
              </InputLabel>
            {/* <DatePicker
             name={`start_date_${index}`} 
             value={form[`start_date_${index}`] || ''}
              className="custom-datepicker"
              dateFormat="dd/MM/yyyy"
             selected={startDate}
             onChange={(date) => handleInputChange(date, `start_date_${index}`)}
             minDate={today}
             todayButton={"Today"}
            
            
             /> */}
              <TextField
               name={`start_date_${index}`} 
                type="date"
                multiple
                value={form[`start_date_${index}`] || ''}
                className={classes.shortTxtField}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
               עד תאריך
              </InputLabel>
              {/* <DatePicker
              name={`end_date_${index}`} 
              value={form[`end_date_${index}`] || ''}
              className="custom-datepicker"
              dateFormat="dd/MMyyyy"
             selected={startDate}
             onChange={(date) => handleInputChange(date, `end_date_${index}`)}
             minDate={today}
             todayButton={"Today"}
            
             */}
             {/* /> */}
              <TextField
               name={`end_date_${index}`} 
                type="date"
                multiple
                value={form[`end_date_${index}`] || ''}
                className={classes.shortTxtField}
                onChange={handleInputChange}
              />
            </Grid>
            </Grid>
            </>
          ))}
        </Grid>
        {form?.vacation_routes ? <Grid item style={{marginRight:"-42px",marginTop:"15px"}}>
        <FormControlLabel
          control={
            <Checkbox
              sx={{
                color: "#686B76",
                "&.Mui-checked": {
                  color: "#54A9FF",
                },
              }}
              name="exceptions"
              className={classes.checkbox}
              onClick={handleInputChange}
              checked={form.exceptions}
            />
          }
          label={
            <Typography style={{ color: "##757882", fontSize: "15px" }}>
               חריגים ?
            </Typography>
          }
        />
      </Grid> : ""}
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
          >  עדכן חדר

          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton} onClick={() => dispatch(staticSlice.closeModal())}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default VacationView;
