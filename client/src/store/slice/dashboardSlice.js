import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboardSlice',
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.data = action.payload;
    },
    setDashboardLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearDashboardData: (state) => {
      state.data = null;
    },
  },
});

export const { setDashboardData, setDashboardLoading, clearDashboardData } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
