import { createSlice } from "@reduxjs/toolkit";

export const vacationSlice = createSlice({
  name: "vacationSlice",
  initialState: {
    vacations: [],
    vacationId:sessionStorage.getItem("vacId") !== null ? sessionStorage.getItem("vacId") : ""
  },
  reducers: {
    updateVacationList: (state, action) => {
      state.vacations = action.payload
    },
    updateChossenVacation: (state, action) => {
      state.vacationId = action.payload;
    },
  
  },
});

export const { updateVacationList,updateChossenVacation } = vacationSlice.actions;




export default vacationSlice.reducer;
