import { createSlice } from "@reduxjs/toolkit";

export const leadsSlice = createSlice({
  name: "leadsSlice",
  initialState: {
    leads: [],
    selectedLead: null,
    notesDialogOpen: false,
  },
  reducers: {
    updateLeadsList: (state, action) => {
      state.leads = action.payload;
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
    openNotesDialog: (state) => {
      state.notesDialogOpen = true;
    },
    closeNotesDialog: (state) => {
      state.notesDialogOpen = false;
    },
  },
});

export const {
  updateLeadsList,
  setSelectedLead,
  clearSelectedLead,
  openNotesDialog,
  closeNotesDialog,
} = leadsSlice.actions;

export default leadsSlice.reducer;
