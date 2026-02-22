import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as vacationSlice from "../../../../store/slice/vacationSlice";
import ApiVacations from "../../../../apis/vacationRequest";
import "./Static.css";
import { Grid } from "@mui/material";
import Rooms from "./Widgets/Rooms/Rooms";
import RoomsStatus from "./Widgets/RoomsStatus/RoomsStatus";
import Vacation from "./Widgets/Vacation/Vacation";
import MainGuests from "./Widgets/MainGuests/MainGuests";
import Guests from "./Widgets/Guests/Guests";
import Flights from "./Widgets/Flights/Flights";
import GeneralInfo from "./Widgets/GeneralInfo/GeneralInfo";
import Payments from "./Widgets/Payments/Payments";
import Documents from "./Widgets/Documents/Documents";
const widgetMap = {
  rooms: Rooms,
  roomsStatus: RoomsStatus,
  vacations: Vacation,
  mainGuests: MainGuests,
  guests: Guests,
  flights: Flights,
  generalInformation: GeneralInfo,
  payments: Payments,
  documents: Documents,
};

const Static = () => {
  const dialogType = useSelector((state) => state.staticSlice.type);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");

  const getVacations = async () => {
    try {
      const response = await ApiVacations.getVacations(token, vacationId);
      if (response?.data?.vacationsDate?.length > 0) {
        dispatch(
          vacationSlice.updateVacationDatesList(response?.data?.vacationsDate)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!dialogType) {
      navigate("/workspace", { replace: true });
      return;
    }
    getVacations();
  }, []);

  const WidgetComponent = widgetMap[dialogType];

  return (
    <Grid style={{ height: "calc(100vh - 48px)", padding: "16px", boxSizing: "border-box" }}>
      {WidgetComponent ? (
        <Grid style={{
          height: "100%",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "auto",
          backgroundColor: "#ffffff",
        }}>
          <WidgetComponent />
        </Grid>
      ) : (
        null
      )}
    </Grid>
  );
};

export default Static;
