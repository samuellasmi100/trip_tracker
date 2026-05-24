import { createSlice } from "@reduxjs/toolkit";
import { toLocalYMD, todayLocalYMD } from "../../utils/helpers/formatDate";

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
      // LOCAL dates so a follow-up set for tomorrow isn't counted as due today.
      const today = todayLocalYMD();
      state.followupDueCount = (action.payload || []).filter((l) => {
        if (!l.followup_date) return false;
        if (Number(l.is_active) !== 1) return false;
        return toLocalYMD(l.followup_date) <= today;
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
