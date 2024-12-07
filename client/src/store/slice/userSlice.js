import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    form: {},
    parents: [],
    parent: {},
    children: [],
    child: {},
    userType: "",
    families:[],
    family:{},
    guests:[]
  },
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form = { ...state.form, [field]: value };
    },
    updateForm: (state, action) => {
      state.form = action.payload;
    },
    updateUserType: (state, action) => {
      state.userType = action.payload;
    },
    updateParents: (state, action) => {
      state.parents = action.payload;
    },
    updateParent: (state, action) => {
      state.parent = action.payload;
    },
    updateChild: (state, action) => {
      state.child = action.payload;
    },
    updateChildren: (state, action) => {
      state.children = action.payload;
    },
    updateGuets: (state, action) => {
      state.guests = action.payload;
    },
    resetForm: (state, action) => {
      state.form = {};
      state.parents = [];
      state.parent = {};
      state.children = [];
      state.child = {};
      state.userType = "";
    },
    updateFamiliesList: (state, action) => {
      state.families = action.payload;
    },
    updateFamily:(state, action) => {
      state.family = action.payload;
    },
  },
 
});

export const {
  updateFormField,
  updateForm,
  updateParents,
  updateParent,
  updateChild,
  updateChildren,
  updateUserType,
  resetForm,
  updateFamiliesList,
  updateFamily,
  updateGuets
} = userSlice.actions;

export default userSlice.reducer;
