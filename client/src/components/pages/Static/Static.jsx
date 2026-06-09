import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as vacationSlice from "../../../store/slices/vacationSlice";
import ApiVacations from "../../../apis/vacationRequest";
import "./Static.css";
import { Grid } from "@mui/material";
import Rooms from "../Rooms/Rooms";
import RoomsStatus from "../RoomsStatus/RoomsStatus";
import Vacation from "../Vacation/Vacation";
import MainGuests from "../MainGuests/MainGuests";
import Guests from "../Guests/Guests";
import Flights from "../Flights/Flights";
import GeneralInfo from "../GeneralInfo/GeneralInfo";
import Payments from "../Payments/Payments";
import Documents from "../Documents/Documents";
import RequireVacation from "../../layout/RequireVacation/RequireVacation";
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

  const content = (
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

  // The vacations-management view (create/list vacations) must be reachable with
  // NO vacation selected — otherwise the first vacation could never be created.
  // Every other widget here is vacation-scoped, so it stays behind RequireVacation
  // (placeholder + no Unknown-database calls), exactly as the route-level gate did.
  return dialogType === "vacations" ? content : <RequireVacation>{content}</RequireVacation>;
};

export default Static;
