import React from "react";
import MainDialogView from "./MainDialog.view";
import GuestEditor from "../GuestEditor/GuestEditor";

import { useSelector } from "react-redux";
import ChildDetails from "../ChildDetails/ChildDetails"

const MainDialog = (props) => {
  const dialogType = useSelector((state) => state.dialogSlice.type);

  const {
    dialogOpen,
    closeModal
  } = props;

  // All guest add/edit flows use the unified GuestEditor (Direction B). Family
  // creation/editing is handled by the dialogs in FamilyList, not here.
  const isGuestEditorFlow =
    dialogType === "addParent" || dialogType === "addChild" ||
    dialogType === "editParent" || dialogType === "editChild";

  const handleDataView = () => {
    if (dialogType === "childDetails" || dialogType === "parentDetails") {
      return <ChildDetails />
    } else if (isGuestEditorFlow) {
      return <GuestEditor onClose={closeModal} />
    }
    return null;
  }

  return (
       <MainDialogView
       dialogOpen={dialogOpen}
       closeModal={closeModal}
       handleDataView={handleDataView}
      />
  );
};

export default MainDialog;
