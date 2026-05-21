import React from "react";
import {
  Dialog,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useStyles } from "./EditOrUpdateDialog.style";

const EditOrUpdateDialogView = (props) => {
  const {
    detailsDialogOpen,
    closeDetailsModal,
    handleDataView,
  } = props;

  const classes = useStyles();

  return (
    <Dialog
      open={detailsDialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={closeDetailsModal}
    >
      <IconButton
        onClick={closeDetailsModal}
        size="small"
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          color: "#94a3b8",
          zIndex: 1,
        }}
      >
        <CloseIcon style={{ fontSize: "20px" }} />
      </IconButton>
      {handleDataView()}
    </Dialog>
  );
};

export default EditOrUpdateDialogView;
