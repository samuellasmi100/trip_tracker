import React from "react";
import MainDialogView from "./MainDialog.view";
import { useDispatch, useSelector } from "react-redux";
import Rooms from "../Widgets/Rooms/Rooms";
import Vacation from "../Widgets/Vacation/Vacation"
import MainGuests from "../Widgets/MainGuests/MainGuests"
import Guests from "../Widgets/Guests/Guests"
import Flights from "../Widgets/Flights/Flights"
import RoomsStatus from "../Widgets/RoomsStatus/RoomsStatus";
import GeneralInfo from "../Widgets/GeneralInfo/GeneralInfo";


const MainDialog = (props) => {
  const dialogType = useSelector((state) => state.staticSlice.type);

  const handleDataView = () => {
    if (dialogType === "rooms") {
      return <Rooms />;
    } else if (dialogType === "roomsStatus") {
      return <RoomsStatus />;
    }else if (dialogType === "vacations") {
      return <Vacation />;
    }else if (dialogType === "mainGuests") {
      return <MainGuests />;
    }else if (dialogType === "guests") {
      return <Guests />;
    }else if (dialogType === "flights") {
      return <Flights />;
    }else if(dialogType === "generalInformation"){
      return <GeneralInfo />;
    }
  };

  const { mainDialogOpen,closeMainModal } = props;

  return (
    <MainDialogView
    mainDialogOpen={mainDialogOpen}
    closeMainModal={closeMainModal}
      handleDataView={handleDataView}
    />
  );
};

export default MainDialog;
