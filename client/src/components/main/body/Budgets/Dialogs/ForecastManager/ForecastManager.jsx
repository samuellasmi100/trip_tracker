import React ,{useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import ForecastManagerView from "./ForecastManager.view";
import * as budgetSlice from "../../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../../apis/budgetsRequest"

const ForecastManager = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.budgetSlice.form);
  const token = sessionStorage.getItem("token")
  const vacationId =  useSelector((state) => state.vacationSlice.vacationId)


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === "categories"){
      getSubCategories(value)
    }
   dispatch(budgetSlice.updateFormField({ field: name, value }));

  };
  const getCategories = async () => {
    try {
      const response = await ApiBudgets.getCategories(token,vacationId)
      dispatch(budgetSlice.updateCategories(response.data))
    } catch (error) {
      console.log(error)
    }
}

const getSubCategories = async (categoryId) => {
  try {
    const response = await ApiBudgets.getSubCategories(token,vacationId,categoryId)
    dispatch(budgetSlice.updateSubCategories(response.data))
  } catch (error) {
    console.log(error)
  }
}

  const submit = async () => {
    try {
      //  await ApiBudgets.addNotes(token,form,vacationId)
      //  dispatch(
      //   snackBarSlice.setSnackBar({
      //     type: "success",
      //     message: "הערות עודכנו בהצלחה",
      //     timeout: 3000,
      //   })
      //   )
    } catch (error) {
      console.log(error);
    }
  };
 const handleCloseClicked = () => {
   dispatch(budgetSlice.resetForm())
   dispatch(budgetSlice.closeModal())
 }

 useEffect(() => {
  getCategories()
 }, [])
 
  return <ForecastManagerView handleInputChange={handleInputChange} submit={submit}  handleCloseClicked={handleCloseClicked}/>;
};

export default ForecastManager;
