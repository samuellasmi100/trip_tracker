import React, { useState } from "react";
import {
  Dialog,
  Grid,
} from "@mui/material";

import { useStyles } from "./MainDialog.style";
import { useSelector } from "react-redux";

const MainDialogView = (props) => {
  const dialogType = useSelector((state) => state.userSlice.dialogType)
  const {
    dialogOpen,
    closeModal,
    handleDataView,
    handleButtonHeader,
  } = props;

  const classes = useStyles();


  return (
    <Dialog
      open={dialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={closeModal}
      
    >
      <Grid 
        >
        <Grid
          item
          container
          xs={12}
          style={{ marginTop: "30px", marginLeft: "30px"}}
          
          alignContent="center"
          justifyContent="space-between"
          
        >
          <Grid item xs={12} container justifyContent="center" style={{ marginTop: "20px", gap: "10px", marginBottom: "30px" }} >
         { handleButtonHeader()}
          </Grid>
        </Grid>

      </Grid>
      {handleDataView()}


    </Dialog>
  );
};

export default MainDialogView;
