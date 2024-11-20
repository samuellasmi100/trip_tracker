import React from "react";
import {
  Button,
  Grid,
  TextField,
  InputLabel,
} from "@mui/material";
import { useStyles } from "./Notes.style";
import { useSelector,useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice"

const NotesView = (props) => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const form = useSelector((state) => state.notesSlice.form)
  const {
    handleInputChange,
    submit
  } = props;

      return (
        <>
        <Grid container  style={{ minHeight: "350px", padding: "20px" }}>
          <Grid item xs={6}>
            <Grid container>
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
