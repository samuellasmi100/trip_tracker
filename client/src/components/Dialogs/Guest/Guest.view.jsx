import React from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,

} from "@mui/material";
import { useStyles } from "./Guest.style";
import { useDispatch, useSelector } from "react-redux";
import "./Guest.css";
import Parent from "./Parent/Parent";
import Child from "./Child/Child";

const GuestView = (props) => {
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form);

  const {
    submit,
    areaCodes,
    handleButtonString,
    handleInputChange,
    handleCloseClicked,
  } = props;

  const handleDataInputsView = () => {
    if (
      dialogType === "addParent" ||
      dialogType === "editParent" ||
      dialogType === "addFamily"
    ) {
      return (
        <Parent areaCodes={areaCodes} handleInputChange={handleInputChange} />
      );
    } else if (dialogType === "addChild" || dialogType === "editChild") {
      return (
        <Child areaCodes={areaCodes} handleInputChange={handleInputChange} />
      );
    }
  };

  return (
    <>
      <Grid container style={{ minHeight: "350px" }}>
        {dialogType === "addChild" ? (
          <Grid item xs={12} style={{marginTop:"-30px",textAlign:"center"}}>
            <Typography>הוסף בן משפחה</Typography>
          </Grid>
        ) : (
          <></>
        )}
        {handleDataInputsView()}
      </Grid>
      <Grid style={{marginRight:"11px",marginBottom:"12px",marginTop:"50px"}}>
        <FormControlLabel
          control={
            <Checkbox
              sx={{
                color: "#cbd5e1",
                "&.Mui-checked": {
                  color: "#0d9488",
                },
              }}
              name="is_in_group"
              className={classes.checkbox}
              onClick={handleInputChange}
              checked={form.is_in_group}
            />
          }
          label={
            <Typography style={{ color: "#64748b", fontSize: "15px" }}>
              חלק מקבוצה?
            </Typography>
          }
        />
      </Grid>
      <Grid item xs={12} container justifyContent="space-around">
        <Grid item>
          <Button onClick={submit} className={classes.submitButton}>
            {handleButtonString()}
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

export default GuestView;
