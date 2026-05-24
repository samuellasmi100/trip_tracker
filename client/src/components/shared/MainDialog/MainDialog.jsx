import React from "react";
import MainDialogView from "./MainDialog.view";
import GuestWizard from "../Guest/GuestWizard";
import GuestEditor from "../GuestEditor/GuestEditor";
import { Button } from "@mui/material";
import { useStyles } from "./MainDialog.style";

import * as dialogSlice from "../../../store/slices/dialogSlice"
import { useDispatch, useSelector } from "react-redux";
import ChildDetails from "../ChildDetails/ChildDetails"
import UploadFile from "../UploadFile/UploadFile";
import ShowFiles from "../ShowFiles/ShowFiles";

const MainDialog = (props) => {
  const activeButton = useSelector((state) => state.dialogSlice.activeButton)
  const classes = useStyles();
  const dialogType = useSelector((state) => state.dialogSlice.type);

  const dispatch = useDispatch()
  const {
    dialogOpen,
    closeModal
  } = props;

  // addFamily keeps the legacy stepper wizard; every guest add/edit flow uses
  // the unified GuestEditor (Direction B: side-nav + panes).
  const isAddFamilyFlow = dialogType === "addFamily";
  const isGuestEditorFlow =
    dialogType === "addParent" || dialogType === "addChild" ||
    dialogType === "editParent" || dialogType === "editChild";

  const handleButtonClick = async (buttonName) => {
    dispatch(dialogSlice.updateActiveButton(buttonName))
  }

  const handleDataView = () => {
    if (dialogType === "childDetails" || dialogType === "parentDetails") {
      return <ChildDetails />
    } else if (dialogType === "uploadFile") {
      return activeButton === "העלה קובץ" ? <UploadFile /> : <ShowFiles />
    } else if (isAddFamilyFlow) {
      return <GuestWizard />
    } else if (isGuestEditorFlow) {
      return <GuestEditor onClose={closeModal} />
    }
    return null;
  }

  const handleButtonHeader = () => {
    // Only the upload-file dialog still uses header tabs; all other flows manage
    // their own navigation.
    if (dialogType === "uploadFile") {
      return ["העלה קובץ", "הצג קבצים שהועלו"].map((label) => (
        <Button
          key={label}
          className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
          onClick={() => handleButtonClick(label)}>
          {label}
        </Button>
      ))
    }
    return null;
  }

  return (
       <MainDialogView
       dialogOpen={dialogOpen}
       closeModal={closeModal}
       handleDataView={handleDataView}
       handleButtonHeader={handleButtonHeader}
      />
  );
};

export default MainDialog;
