import React from "react";
import {
  Dialog,
} from "@mui/material";

import { useStyles } from "./MainDialog.style";
import { useSelector } from "react-redux";

const MainDialogView = (props) => {
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const {
    dialogOpen,
    closeModal,
    handleDataView,
  } = props;

  const classes = useStyles();

  // Guest add/edit flows manage their own close (with an unsaved-changes prompt),
  // so backdrop/Esc must not close them directly.
  const isGuestEditorFlow =
    dialogType === "addParent" || dialogType === "addChild" ||
    dialogType === "editParent" || dialogType === "editChild";

  return (
    <Dialog
      open={dialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={isGuestEditorFlow ? undefined : closeModal}
      style={{ zIndex: 1600 }}>
      {handleDataView()}
    </Dialog>
  );
};

export default MainDialogView;
