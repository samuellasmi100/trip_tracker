import { createSlice } from "@reduxjs/toolkit";

export const leadsSlice = createSlice({
  name: "leadsSlice",
  initialState: {
    leads: [],
    selectedLead: null,
    notesDialogOpen: false,
    followupDueCount: 0,
  },
  reducers: {
    updateLeadsList: (state, action) => {
      state.leads = action.payload;
      // Recompute due count from the list so the badge stays in sync after edits.
      const today = new Date().toISOString().slice(0, 10);
      state.followupDueCount = (action.payload || []).filter((l) => {
        if (!l.followup_date) return false;
        if (Number(l.is_active) !== 1) return false;
        const d = String(l.followup_date).slice(0, 10);
        return d <= today;
      }).length;
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
    setFollowupDueCount: (state, action) => {
      state.followupDueCount = Number(action.payload) || 0;
    },
  },
});

export const {
  updateLeadsList,
  setSelectedLead,
  clearSelectedLead,
  openNotesDialog,
  closeNotesDialog,
  setFollowupDueCount,
} = leadsSlice.actions;

export default leadsSlice.reducer;
