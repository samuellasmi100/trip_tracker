import React, { useState } from "react";
import {
  Dialog,
  Grid,
  TextField,InputLabel
} from "@mui/material";

import { useStyles } from "./MainDialog.style";
import { useSelector } from "react-redux";

const MainDialogView = (props) => {
  const dialogType = useSelector((state) => state.userSlice.dialogType)
  const {
    mainDialogOpen,
    closeMainModal,
    handleDataView
  } = props;

  const classes = useStyles();


  return (
    <Dialog
      open={mainDialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={closeMainModal}>
      <Grid>
       {handleDataView()}
      </Grid>
    </Dialog>
  );
};

export default MainDialogView;
