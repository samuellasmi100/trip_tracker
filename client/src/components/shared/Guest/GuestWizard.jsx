import React, { useState, useEffect } from "react";
import GuestWizardView from "./GuestWizard.view";
import ApiUser from "../../../apis/userRequest";
import ApiVacations from "../../../apis/vacationRequest";
import { useDispatch, useSelector } from "react-redux";
import * as snackBarSlice from "../../../store/slices/snackbarSlice";
import * as userSlice from "../../../store/slices/userSlice";
import * as dialogSlice from "../../../store/slices/dialogSlice";
import * as vacationSlice from "../../../store/slices/vacationSlice";
import { v4 as uuidv4 } from "uuid";
import { isoToDisplay } from "../../../utils/helpers/formatDate";

// Family / group creation wizard (addFamily only). Guest add/edit now lives in
// the unified GuestEditor; this stepper just creates the family shell.
const GuestWizard = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.userSlice.form);
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates);

  const steps = [
    { key: "family", label: "פרטי משפחה" },
    { key: "trip", label: "פרטי הזמנה" },
  ];
  const [activeStep, setActiveStep] = useState(0);

  // Load vacation dates for the route dropdown in the trip step
  useEffect(() => {
    const getVacations = async () => {
      try {
        const response = await ApiVacations.getVacations(token, vacationId);
        if (response?.data?.vacationsDate?.length > 0) {
          dispatch(vacationSlice.updateVacationDatesList(response.data.vacationsDate));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getVacations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "week_chosen") {
      const found = vacationsDates?.find((k) => k.name === value);
      if (found && found.name !== "חריגים") {
        const arr = isoToDisplay(found.start_date);
        const dep = isoToDisplay(found.end_date);
        dispatch(userSlice.updateFormField({ field: "arrival_date", value: arr }));
        dispatch(userSlice.updateFormField({ field: "departure_date", value: dep }));
        dispatch(userSlice.updateFormField({ field: "week_chosen", value }));
        dispatch(userSlice.updateFormField({ field: "date_chosen", value: `${dep}/${arr}` }));
      } else {
        dispatch(userSlice.updateFormField({ field: "week_chosen", value }));
        dispatch(userSlice.updateFormField({ field: "arrival_date", value: "" }));
        dispatch(userSlice.updateFormField({ field: "departure_date", value: "" }));
        dispatch(userSlice.updateFormField({ field: "date_chosen", value: "" }));
      }
    } else if (name === "departure_date") {
      dispatch(userSlice.updateFormField({ field: "departure_date", value }));
      dispatch(userSlice.updateFormField({ field: "date_chosen", value: `${value}/${form.arrival_date}` }));
    } else {
      dispatch(userSlice.updateFormField({ field: name, value }));
    }
  };

  const submit = async () => {
    try {
      if (!form.family_name || form.family_name.trim() === "") {
        dispatch(snackBarSlice.setSnackBar({ type: "error", message: "שם משפחה / קבוצה הוא חובה", timeout: 3000 }));
        return;
      }
      const newFamilyId = uuidv4();
      await ApiUser.addFamily(token, form, newFamilyId, vacationId);
      dispatch(userSlice.updateFormField({ field: "family_id", value: newFamilyId }));
      dispatch(userSlice.updateFamily({
        family_id: newFamilyId,
        family_name: form.family_name,
        number_of_guests: form.number_of_guests,
        number_of_rooms: form.number_of_rooms,
        total_amount: form.total_amount,
        start_date: form.arrival_date,
        end_date: form.departure_date,
      }));
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: "משפחה נוספה בהצלחה", timeout: 3000 }));
      dispatch(userSlice.resetForm());
      dispatch(dialogSlice.resetState());
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "אירעה שגיאה, נסה שנית", timeout: 3000 }));
    }
  };

  const handleCloseClicked = () => {
    dispatch(userSlice.resetForm());
    dispatch(dialogSlice.resetState());
  };

  return (
    <GuestWizardView
      steps={steps}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      submit={submit}
      handleInputChange={handleInputChange}
      handleCloseClicked={handleCloseClicked}
    />
  );
};

export default GuestWizard;
