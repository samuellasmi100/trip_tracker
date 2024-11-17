import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  setRef,
} from "@mui/material";
import { useStyles } from "./MainDialog.style";

const MainDialogView = (props) => {
  const {
    dialogType,
    dialogOpen,
    setDialogOpen,
    closeModal,
    userDetails,
    handleButtonClick,
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
      <Grid container>
        <Grid
          item
          container
          xs={12}
          style={{ marginTop: "30px", marginLeft: "30px" }}
          alignContent="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} container justifyContent="center" style={{ marginTop: "20px", gap: "10px", marginBottom: "30px" }}>
         { handleButtonHeader()}
          </Grid>
        </Grid>

      </Grid>
      {handleDataView()}


    </Dialog>
  );
};

export default MainDialogView;
