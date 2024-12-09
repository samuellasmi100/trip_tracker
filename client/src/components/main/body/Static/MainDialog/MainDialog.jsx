import React from "react";
import MainDialogView from "./MainDialog.view";
import { useDispatch, useSelector } from "react-redux";
import Rooms from "../Rooms/Rooms";

import DateAvailabilityView from "../DateAvailability/DateAvailability";
const MainDialog = (props) => {
  const dialogType = useSelector((state) => state.staticSlice.type);

  const handleDataView = () => {
    console.log(dialogType);
    if (dialogType === "rooms") {
      return <Rooms />;
    } else if (dialogType === "roomsStatus") {
      return <DateAvailabilityView />;
    }
  };

  const { dialogOpen, closeModal } = props;

  return (
    <MainDialogView
      dialogOpen={dialogOpen}
      closeModal={closeModal}
      handleDataView={handleDataView}
    />
  );
};

export default MainDialog;
