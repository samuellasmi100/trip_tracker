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
    resetForm: (state, action) => {
      state.form = {
        amount:"",
        amountReceived:"",
        formOfPayment:"",
        parentId:"",
        paymentCurrency:"",
        paymentDate:"",
        remainsToBePaid:""
      };
    },
  },
});

export const { updateFormField,updateForm,resetForm } = paymentsSlice.actions;




export default paymentsSlice.reducer;
