import React from "react";
import MainDialogView from "./MainDialog.view";
import { useStyles } from "./MainDialog.style";
import { useDispatch, useSelector } from "react-redux";
import Room from "./Room/Room"

const MainDialog = (props) => {
  const dialogType = useSelector((state) => state.staticSlice.type)

  const handleDataView = () => {
    console.log(dialogType)
    if (dialogType === "editRoom") {
      return <Room />
    }
  }

  const dispatch = useDispatch()
  const {
    dialogOpen,
    closeModal
  } = props;


  return (
    <MainDialogView
      dialogOpen={dialogOpen}
      closeModal={closeModal}
      handleDataView={handleDataView}

    />
  );
};

export default MainDialog;
