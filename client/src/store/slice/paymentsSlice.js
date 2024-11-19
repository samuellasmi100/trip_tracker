import { createSlice } from "@reduxjs/toolkit";

export const paymentsSlice = createSlice({
  name: "paymentsSlice",
  initialState: {
    form: {
      amount:"",
      amountReceived:"",
      formOfPayment:"",
      parentId:"",
      paymentCurrency:"",
      paymentDate:"",
      remainsToBePaid:""
    }
  },
  reducers: {
    updateFormField: (state, action) => {

      const { field, value } = action.payload;
      state.form[field] = value;
    },
    updateForm: (state, action) => {
      state.form = action.payload;
    },
  },
});

export const { updateFormField,updateForm } = paymentsSlice.actions;




export default paymentsSlice.reducer;
