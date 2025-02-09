import { createSlice } from "@reduxjs/toolkit";

export const paymentsSlice = createSlice({
  name: "paymentsSlice",
  initialState: {
    form: {
      amount:"",
      amountReceived:"",
      formOfPayment:"",
      paymentCurrency:"",
      paymentDate:"",
      remainsToBePaid:"",
      invoice:false
    },
    userPayments:[]
  },
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    updateForm: (state, action) => {
      state.form = action.payload;
    },
    updateUserPayments: (state, action) => {
      state.userPayments = action.payload;
    },
    resetForm: (state, action) => {
      state.form = [];
    },
  },
});

export const { updateFormField,updateForm,resetForm,updateUserPayments } = paymentsSlice.actions;




export default paymentsSlice.reducer;
