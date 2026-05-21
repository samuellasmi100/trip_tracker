import { createSlice } from "@reduxjs/toolkit";

export const signaturesSlice = createSlice({
  name: "signaturesSlice",
  initialState: {
    // Array of { family_id, family_name, signature_sent_at, doc_token, signer_name, signed_at, sig_id }
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
    markFamilySent: (state, action) => {
      const { familyId } = action.payload;
      const item = state.statusList.find((s) => s.family_id === familyId);
      if (item) {
        item.signature_sent_at = new Date().toISOString();
      }
    },
  },
});

export const { setStatusList, setLoading, markFamilySent } = signaturesSlice.actions;

export default signaturesSlice.reducer;
