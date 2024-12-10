import { Grid, Select, InputLabel, MenuItem, OutlinedInput, Button, Typography, TextField, FormControlLabel,Checkbox } from "@mui/material";
import React from "react";
import { useStyles } from "./Vacation.style"
import { useSelector } from "react-redux";
import { staticSlice } from "../../../../../../store/slice/staticSlice";


function VacationView({handleInputChange,submit}) {
 const classes = useStyles()
 const form = useSelector((state) => state.staticSlice.form)

  return (
    <Grid container>
    <Grid xs={12}style={{ marginLeft: "30px"}}>
      <Grid item xs={12} container justifyContent="center" style={{ marginBottom: "30px",marginTop:"-10px"  }}>
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
      style={{ marginTop: "80px" }}
      justifyContent="space-around">
     
      <Grid item>
        <Button
          onClick={submit}
          className={classes.submitButton}
        >  הוסף חופשה
    
        </Button>
      </Grid>
      <Grid item>
        <Button className={classes.cancelButton}>
          סגור
        </Button>
      </Grid>
    </Grid>
    </Grid> 
  )
}

export default VacationView;
