import { createSlice } from "@reduxjs/toolkit";

export const vacationSlice = createSlice({
  name: "vacationSlice",
  initialState: {
    vacations: [],
    vacationsDates:[],
    vacationId:sessionStorage.getItem("vacId") !== null ? sessionStorage.getItem("vacId") : ""
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
  },
});

export const { updateVacationList,updateChosenVacation,updateVacationDatesList } = vacationSlice.actions;




export default vacationSlice.reducer;
