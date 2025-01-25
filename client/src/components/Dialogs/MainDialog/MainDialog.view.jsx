import React, { useState } from "react";
import {
  Dialog,
  Grid,
} from "@mui/material";

import { useStyles } from "./MainDialog.style";
import { useSelector } from "react-redux";

const MainDialogView = (props) => {
  const dialogType = useSelector((state) => state.dialogSlice.type);
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
      onClose={closeModal}>
      <Grid>
        <Grid
          item
          container
          xs={12}
          style={{ marginTop: "30px", marginLeft: "30px"}}
          alignContent="center"
          justifyContent="space-between">
          <Grid item xs={12} container justifyContent={dialogType !== "uploadFile" ? "center" : ""} style={{ marginTop: "20px", marginBottom: "30px",marginRight:dialogType !== "uploadFile" ? "" : "10px" }} >
         { handleButtonHeader()}
          </Grid>
        </Grid>
      </Grid>
      {handleDataView()}
    </Dialog>
  );
};

export default MainDialogView;
