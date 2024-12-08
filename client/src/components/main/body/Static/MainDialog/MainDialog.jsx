import React from "react";
import MainDialogView from "./MainDialog.view";
import { useStyles } from "./MainDialog.style";
import { useDispatch, useSelector } from "react-redux";
import Room from "./Room/Room"
import Vacation from "./Vacation/Vacation";
import DateAvailabilityView from "./DateAvailability/DateAvailability"
const MainDialog = (props) => {
  const dialogType = useSelector((state) => state.staticSlice.type)

  const handleDataView = () => {
console.log(dialogType)
    if (dialogType === "editRoom") {
      return <Room />
    }else if(dialogType === "חופשות"){
      return <Vacation />
    }else if(dialogType === "showAvailableDates"){
      return <DateAvailabilityView />
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
