import React from "react";
import MainDialogView from "./MainDialog.view";
import { useDispatch, useSelector } from "react-redux";
import Rooms from "../../../../pages/Rooms/Rooms";
import Vacation from "../../../../pages/Vacation/Vacation"
import MainGuests from "../../../../pages/MainGuests/MainGuests"
import Guests from "../../../../pages/Guests/Guests"
import Flights from "../../../../pages/Flights/Flights"
import RoomsStatus from "../Widgets/RoomsStatus/RoomsStatus";
import GeneralInfo from "../../../../pages/GeneralInfo/GeneralInfo";
import Payments from "../../../../pages/Payments/Payments";


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
    }else if(dialogType === "payments"){
      return <Payments />;
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
