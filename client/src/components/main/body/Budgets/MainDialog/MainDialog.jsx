import React from "react";
import MainDialogView from "./MainDialog.view";
import { useDispatch, useSelector } from "react-redux";



const MainDialog = (props) => {
  const dialogType = useSelector((state) => state.staticSlice.type);

  const handleDataView = () => {
  
  };

  const { dialogOpen,closeModal } = props;

  return (
    <MainDialogView
    dialogOpen={dialogOpen}
    closeModal={closeModal}
      handleDataView={handleDataView}
    />
  );
};

export default MainDialog;
