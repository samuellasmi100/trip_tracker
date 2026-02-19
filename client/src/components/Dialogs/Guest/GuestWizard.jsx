import React, { useState, useEffect } from "react";
import GuestWizardView from "./GuestWizard.view";
import ApiUser from "../../../apis/userRequest";
import ApiVacations from "../../../apis/vacationRequest";
import { useDispatch, useSelector } from "react-redux";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import * as userSlice from "../../../store/slice/userSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import * as vacationSlice from "../../../store/slice/vacationSlice";
import { v4 as uuidv4 } from "uuid";
import calculateAge from "../../../utils/HelperFunction/calculateAge";

const GuestWizard = () => {
  const dispatch = useDispatch();
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const form = useSelector((state) => state.userSlice.form);
  const familyDetails = useSelector((state) => state.userSlice.family);
  const guests = useSelector((state) => state.userSlice.guests);
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates);

  // Determine steps based on dialog type
  const isAddFamily = dialogType === "addFamily";
  const isAddFlow = dialogType === "addFamily" || dialogType === "addParent" || dialogType === "addChild";
  const isEditFlow = dialogType === "editParent" || dialogType === "editChild";

  // Step definitions
  const getSteps = () => {
    if (isAddFamily) {
      // Adding a family: family info + trip options only (no personal details)
      return [
        { key: "family", label: "פרטי משפחה" },
        { key: "trip", label: "פרטי הזמנה" },
      ];
    }
    if (isEditFlow) {
      // Edit mode: no stepper, just show personal details (tab navigation handled by MainDialog)
      return [{ key: "personal", label: "פרטים אישיים" }];
    }
    // addParent / addChild: personal details + trip options
    return [
      { key: "personal", label: "פרטים אישיים" },
      { key: "trip", label: "פרטי הזמנה" },
    ];
  };

  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(0);

  // Load vacations dates for trip step
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
  }, []);

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    let family_id = isAddFamily ? form.family_id : familyDetails.family_id;

    if (name === "flights_direction") {
      dispatch(userSlice.updateFormField({ field: "flights_direction", value: checked ? value : "" }));
    } else if (name === "birth_date") {
      const age = calculateAge(value);
      dispatch(userSlice.updateFormField({ field: "age", value: age }));
      dispatch(userSlice.updateFormField({ field: name, value }));
    } else if (name === "flights" || name === "flying_with_us" || name === "is_in_group") {
      dispatch(userSlice.updateFormField({ field: name, value: checked }));
    } else if (name === "week_chosen") {
      const findVacationDateDetails = vacationsDates?.find((key) => key.name === value);
      if (findVacationDateDetails && findVacationDateDetails.name !== "חריגים") {
        dispatch(userSlice.updateFormField({ field: "arrival_date", value: findVacationDateDetails.start_date }));
        dispatch(userSlice.updateFormField({ field: "departure_date", value: findVacationDateDetails.end_date }));
        dispatch(userSlice.updateFormField({ field: "week_chosen", value }));
        dispatch(userSlice.updateFormField({ field: "date_chosen", value: `${findVacationDateDetails.end_date}/${findVacationDateDetails.start_date}` }));
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

    if (family_id) {
      dispatch(userSlice.updateFormField({ field: "family_id", value: family_id }));
    }
    dispatch(userSlice.updateFormField({ field: "userType", value: dialogType }));
  };

  const handleNext = () => {
    const currentStepKey = steps[activeStep]?.key;

    // Validate before moving forward
    if (currentStepKey === "family") {
      if (!form.family_name || form.family_name.trim() === "") {
        dispatch(snackBarSlice.setSnackBar({ type: "error", message: "שם משפחה / קבוצה הוא חובה", timeout: 3000 }));
        return;
      }
    }

    if (currentStepKey === "personal") {
      if (!form.identity_id || form.identity_id.trim() === "") {
        dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מספר תעודת זהות הוא חובה", timeout: 3000 }));
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const submit = async () => {
    try {
      if (dialogType === "addFamily") {
        if (!form.family_name || form.family_name.trim() === "") {
          dispatch(snackBarSlice.setSnackBar({ type: "error", message: "שם משפחה / קבוצה הוא חובה", timeout: 3000 }));
          return;
        }
        const newFamilyId = uuidv4();
        await ApiUser.addFamily(token, form, newFamilyId, vacationId);
        dispatch(userSlice.updateFormField({ field: "family_id", value: newFamilyId }));
        dispatch(userSlice.updateFamily({ family_id: newFamilyId, family_name: form.family_name }));
        dispatch(snackBarSlice.setSnackBar({ type: "success", message: "משפחה נוספה בהצלחה", timeout: 3000 }));
        dispatch(userSlice.resetForm());
        dispatch(dialogSlice.resetState());
      } else if (dialogType === "addParent") {
        if (!form.identity_id || form.identity_id === "") {
          dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מספר תעודת זהות הוא חובה", timeout: 3000 }));
          return;
        }
        await ApiUser.addUser(token, form, form.family_id, undefined, vacationId);
        await getUsers();
        // Update with trip data
        await ApiUser.updateUser(token, form, vacationId);
        dispatch(snackBarSlice.setSnackBar({ type: "success", message: "אורח נוסף בהצלחה", timeout: 3000 }));
        dispatch(userSlice.resetForm());
        dispatch(dialogSlice.resetState());
        dispatch(dialogSlice.updateDialogType("editParent"));
        dispatch(dialogSlice.updateActiveButton("פרטי הזמנה"));
      } else if (dialogType === "addChild") {
        const checkIfUserAlreadyExist = guests.some((user) => user.identity_id === form.identity_id);
        if (checkIfUserAlreadyExist) {
          dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מספר תעודת זהות זה כבר נמצא במערכת", timeout: 3000 }));
          return;
        }
        const newUserId = uuidv4();
        await ApiUser.addUser(token, form, form.family_id, newUserId, vacationId);
        dispatch(userSlice.updateFormField({ field: "family_id", value: form.family_id }));
        dispatch(userSlice.updateFormField({ field: "user_id", value: newUserId }));
        // Update with trip data
        const updatedForm = { ...form, user_id: newUserId };
        await ApiUser.updateUser(token, updatedForm, vacationId);
        await getUsers();
        dispatch(snackBarSlice.setSnackBar({ type: "success", message: "בן משפחה נוסף בהצלחה", timeout: 3000 }));
        dispatch(dialogSlice.updateDialogType("editChild"));
        dispatch(dialogSlice.updateActiveButton("פרטי נסיעה"));
      } else if (dialogType === "editParent" || dialogType === "editChild") {
        if (dialogType === "editParent" && (!form.identity_id || form.identity_id === "")) {
          dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מספר תעודת זהות הוא חובה", timeout: 3000 }));
          return;
        }
        await ApiUser.updateUser(token, form, vacationId);
        await getUsers();
        dispatch(snackBarSlice.setSnackBar({ type: "success", message: "נתוני אורח עודכנו בהצלחה", timeout: 3000 }));
        if (dialogType === "editParent") {
          dispatch(dialogSlice.updateActiveButton("פרטי הזמנה"));
        } else {
          dispatch(dialogSlice.updateActiveButton("פרטי נסיעה"));
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "אירעה שגיאה, נסה שנית", timeout: 3000 }));
    }
  };

  const handleCloseClicked = () => {
    dispatch(userSlice.resetForm());
    dispatch(dialogSlice.resetState());
  };

  const getUsers = async () => {
    let family_id = form.family_id;
    try {
      let response = await ApiUser.getUserFamilyList(token, family_id, vacationId);
      if (response.data.length > 0) {
        dispatch(userSlice.updateGuest(response.data));
      } else {
        dispatch(userSlice.updateGuest([]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GuestWizardView
      steps={steps}
      activeStep={activeStep}
      handleNext={handleNext}
      handleBack={handleBack}
      submit={submit}
      handleInputChange={handleInputChange}
      handleCloseClicked={handleCloseClicked}
      isAddFlow={isAddFlow}
      isEditFlow={isEditFlow}
    />
  );
};

export default GuestWizard;
