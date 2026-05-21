import { createSlice } from "@reduxjs/toolkit";

export const bookingsSlice = createSlice({
  name: "bookingsSlice",
  initialState: {
    // Array of { family_id, family_name, submission_id, contact_name, submitted_at }
    statusList: [],
    loading: false,
  },
  reducers: {
    setStatusList: (state, action) => {
      state.statusList = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setStatusList, setLoading } = bookingsSlice.actions;

export default bookingsSlice.reducer;
