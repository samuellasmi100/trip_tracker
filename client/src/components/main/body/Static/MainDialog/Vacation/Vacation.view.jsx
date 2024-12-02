import {
  Grid,
  TextField,
  InputLabel,
  Button
} from "@mui/material";
import { useStyles } from "./Vacation.style";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as staticSlice from "../../../../../../store/slice/staticSlice"

function VacationView({ submit, handleInputChange }) {

  const dispatch = useDispatch()
  const classes = useStyles();
  const form = useSelector((state) => state.staticSlice.form)



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
            {/* <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                {`מסלול מספר ${index+1}` }
              </InputLabel>
     
              <TextField
                name={`type_${index}`}
                type="date"
                multiple
                value={form[`type_${index}`] || ''}
                className={classes.textField}
                onChange={(e) => handleInputChange(e, index)}
              />
            </Grid> */}
            </>
          ))}
          {/* <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 סוג חדר
              </InputLabel>
              <TextField
                  name="type"
                  value={ form?.type}
                  className={classes.textField}
                  onChange={handleInputChange}
              />
            </Grid>
          <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                   אורחים בחדר
              </InputLabel>
              <TextField
                name="base_occupancy"
                className={classes.textField}
               value={ form?.base_occupancy}
               onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                  אורחים נוספים 
              </InputLabel>
              <TextField
                 name="max_occupancy"
                 className={classes.textField}
                value={ form?.max_occupancy}
                onChange={handleInputChange}
              />
            </Grid> */}

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
