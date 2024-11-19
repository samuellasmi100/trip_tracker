import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    form: {},
    parents:[],
    parent:{}
  },
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    updateForm: (state, action) => {
      state.form = action.payload;
    },
    updateParents: (state, action) => {
      state.parents = action.payload;
    },
    updateParent: (state, action) => {
      state.parent = action.payload;
    },
  },
});

export const { updateFormField,updateForm,updateParents,updateParent } = userSlice.actions;




export default userSlice.reducer;
