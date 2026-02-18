import React, { useEffect,useState } from "react";
import StaticView from "./Static.view";
import { useDispatch, useSelector } from "react-redux";
import * as staticSlice from "../../../../store/slice/staticSlice";
import * as vacationSlice from "../../../../store/slice/vacationSlice";
import MainDialog from "./MainDialog/MainDialog";
import ApiVacations from "../../../../apis/vacationRequest";
import "./Static.css";
import { Grid } from "@mui/material";


const Static = () => {
  const mainDialogOpen = useSelector((state) => state.staticSlice.mainModalOpen);

  const dispatch = useDispatch();
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");

  const closeMainModal = () => {
    dispatch(staticSlice.closeMainModal());
  };

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
    getVacations();
  }, []);

  const handleWidgetClick = (name) => {
    dispatch(staticSlice.openMainModal());
    dispatch(staticSlice.updateDialogType(name));
  }


  return (
    <Grid>
      <StaticView />
      <MainDialog mainDialogOpen={mainDialogOpen} closeMainModal={closeMainModal} />
    </Grid>
  );
};

export default Static;
