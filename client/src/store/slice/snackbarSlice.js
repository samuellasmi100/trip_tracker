import { createSlice } from "@reduxjs/toolkit";
let timeoutInstance = null;
export const userSlice = createSlice({
  name: "snackBarSlice",
  initialState: {
    timeout: 3000,
    message: "",
    type: "success" ,// ? can be : success ,error , warn, info.
    toastId : null,
    position : null
  },
  reducers: {
    setSnackBar: (state, action) => {
      state.timeout = action.payload.timeout;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.toastId = action.payload.toastId || null;
      state.position = action.payload.position || null;
    },
    
    disableSnackBar: (state, action) => {
      state.message = "";
      state.type = "success";
      state.toastId = null;
      state.position = null
    },
  },
});

export const { setSnackBar, disableSnackBar } = userSlice.actions;

export default userSlice.reducer;
