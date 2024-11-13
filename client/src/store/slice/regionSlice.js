import { createSlice } from "@reduxjs/toolkit";

export const regionSlice = createSlice({
  name: "regionSlice",
  initialState: {
    regions: [],
    clientUserRegions: [],
  },
  reducers: {
    updateRegionsList: (state, action) => {
      state.regions = action.payload;
    },
    clearRegionList : (state , action) => {
      state.regions = []
    }
  },
});

export const { updateRegionsList, clearRegionList } = regionSlice.actions;

export const updateSubscription = (newRegions) => (dispatch, getState) => {
  const currentRegions = getState().regionSlice.regions;
  const updatedRegions = currentRegions.map((region) => {
    if (newRegions?.includes(region.region_name) || newRegions.includes(region.region_id)) {
      if (region.subscribed === 0) {
        return { ...region, subscribed: 1 };
      } else {
        return region;
      }
    } else {
      return { ...region, subscribed: 0 };
    }
  });
  dispatch(updateRegionsList(updatedRegions))
  return updatedRegions
};


export default regionSlice.reducer;
