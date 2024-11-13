import { createSlice } from "@reduxjs/toolkit";

export const auctionSlice = createSlice({
  name: "auctionSlice",
  initialState: {
   auction:[]
  },
  reducers: {
    updateAuctionsList: (state, action) => {
      state.auction = action.payload;
    },
    updateAuctionDetails: (state, action) => {
    
      const auctionCopy = JSON.parse(JSON.stringify(state.auction));
      for (const item of auctionCopy) {
        const matchingItem = item.items.find((i) => Number(i.auctionStaticId) === Number(action.payload));
        if (matchingItem) {
          matchingItem.visible = false;
        }
      }
      state.auction = auctionCopy;
    },
  },
});

export const { updateAuctionsList,updateAuctionDetails } = auctionSlice.actions;

export default auctionSlice.reducer;
