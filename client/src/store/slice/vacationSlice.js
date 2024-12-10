import { createSlice } from "@reduxjs/toolkit";

export const vacationSlice = createSlice({
  name: "vacationSlice",
  initialState: {
    vacations: [],
    vacationsDates:[],
    vacationDetails:[],
    vacationId:sessionStorage.getItem("vacId") !== null ? sessionStorage.getItem("vacId") : "",
    vacationName:sessionStorage.getItem("vacName") !== null ? sessionStorage.getItem("vacName") : ""
  },
  reducers: {
    updateVacationList: (state, action) => {
      state.vacations = action.payload
    },
    updateChosenVacation: (state, action) => {
      state.vacationId = action.payload;
    },
    updateVacationDatesList: (state, action) => {
      state.vacationsDates = action.payload;
    },
    updateVacationName: (state, action) => {
      state.vacationName = action.payload;
    },
    updateVacationDetails:(state, action) => {
      state.vacationDetails = action.payload;
    },
  },
});

export const { updateVacationList,updateChosenVacation,updateVacationDatesList,updateVacationName,updateVacationDetails } = vacationSlice.actions;




export default vacationSlice.reducer;
