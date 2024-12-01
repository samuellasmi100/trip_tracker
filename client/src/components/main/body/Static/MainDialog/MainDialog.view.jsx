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
    dialogOpen,
    closeModal,
    handleDataView
  } = props;

  const classes = useStyles();


  return (
    <Dialog
      open={dialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={closeModal}>
      <Grid>
       {handleDataView()}
      </Grid>
    </Dialog>
  );
};

export default MainDialogView;
