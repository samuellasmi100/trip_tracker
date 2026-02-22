import { createSlice } from "@reduxjs/toolkit";

export const documentsSlice = createSlice({
  name: "documentsSlice",
  initialState: {
    familiesStatus: [],
    selectedFamilyDocs: [],
    docTypes: [],
    loading: false,
  },
  reducers: {
    setFamiliesStatus: (state, action) => {
      state.familiesStatus = action.payload;
    },
    setSelectedFamilyDocs: (state, action) => {
      state.selectedFamilyDocs = action.payload;
    },
    clearSelectedFamilyDocs: (state) => {
      state.selectedFamilyDocs = [];
    },
    setDocTypes: (state, action) => {
      state.docTypes = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setFamiliesStatus,
  setSelectedFamilyDocs,
  clearSelectedFamilyDocs,
  setDocTypes,
  setLoading,
} = documentsSlice.actions;

export default documentsSlice.reducer;
