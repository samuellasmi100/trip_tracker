import React from "react";
import {
  Button,
  Grid,
  TextField,
  InputLabel,
  Select,OutlinedInput,MenuItem
} from "@mui/material";
import { useStyles } from "./Notes.style";
import { useSelector,useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice"

const NotesView = (props) => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const form = useSelector((state) => state.notesSlice.form)
  const CategoryNotes = [
    {categoryName:"חדרים",id:1},
    {categoryName:"קולינרי",id:2},
    {categoryName:"טיסות",id:3},
    {categoryName:"חדר אוכל",id:4},
    {categoryName:"כללי",id:4},
  ]
  const {
    handleInputChange,
    submit
  } = props;

      return (
        <>
        <Grid container  style={{ minHeight: "350px", padding: "20px" }}>
          <Grid item xs={6}>
            <Grid container>
            <Grid item style={{marginBottom:"10px"}}>
              <InputLabel className={classes.inputLabelStyle}>
               בחר קטגוריה
              </InputLabel>
               <Select
               name="categoryName"
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
          {CategoryNotes?.map((type) => (
            <MenuItem key={type.id} value={type.categoryName} className={classes.selectedMenuItem}>
              {type.categoryName}
            </MenuItem>
          ))}
        </Select>
            </Grid>
              <Grid item>
                <TextField
                multiline 
                onChange={handleInputChange}
                   name="note"
                  value={form?.note}
                  className={classes.textField} 
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
            onClick={submit}
              className={classes.submitButton}
            >  הוסף הערה

            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.cancelButton} onClick={() => dispatch(dialogSlice.closeModal())}>
              סגור
            </Button>
          </Grid>
        </Grid>
      </>
  );
};

export default NotesView;
