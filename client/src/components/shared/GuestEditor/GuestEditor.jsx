import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import { useStyles } from "./GuestEditor.style";
import { useDispatch, useSelector } from "react-redux";

// Section content (reused as-is from the previous add/edit flows)
import PersonalDetailsStep from "../Guest/steps/PersonalDetailsStep";
import TripOptionsStep from "../Guest/steps/TripOptionsStep";
import FlightDetailsStep from "../Guest/steps/FlightDetailsStep";
import NotesStep from "../Guest/steps/NotesStep";
import FlightToggles from "../Reservation/Flights/Flights";
import FlightsContainer from "../Flights/Flights";
import NotesContainer from "../Notes/Notes";

// APIs
import ApiUser from "../../../apis/userRequest";
import ApiFlights from "../../../apis/flightsRequest";
import ApiNotes from "../../../apis/notesRequest";
import ApiVacations from "../../../apis/vacationRequest";

// Redux
import * as userSlice from "../../../store/slices/userSlice";
import * as flightsSlice from "../../../store/slices/flightsSlice";
import * as notesSlice from "../../../store/slices/notesSlice";
import * as dialogSlice from "../../../store/slices/dialogSlice";
import * as vacationSlice from "../../../store/slices/vacationSlice";
import * as snackBarSlice from "../../../store/slices/snackbarSlice";

import { v4 as uuidv4 } from "uuid";
import calculateAge from "../../../utils/helpers/calculateAge";
import { isoToDisplay } from "../../../utils/helpers/formatDate";

// Unified Add/Edit Guest editor (Direction B, Phase 1 — the shell).
// One component, one side-nav + pane shell, for addParent/addChild/editParent/
// editChild. Phase 1 keeps the existing section components and per-flow save
// logic wired as-is so behaviour is unchanged; later phases add the single
// global save (P2), conditional flights (P3), corrected dirty tracking (P4),
// and completeness chips (P5). addFamily intentionally stays on GuestWizard.
const GuestEditor = ({ onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const dialogType = useSelector((state) => state.dialogSlice.type);
  const userForm = useSelector((state) => state.userSlice.form);
  const flightsForm = useSelector((state) => state.flightsSlice.form);
  const notesForm = useSelector((state) => state.notesSlice.form);
  const familyDetails = useSelector((state) => state.userSlice.family);
  const guests = useSelector((state) => state.userSlice.guests);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates);
  const token = sessionStorage.getItem("token");

  const isAdd = dialogType === "addParent" || dialogType === "addChild";
  const isEdit = dialogType === "editParent" || dialogType === "editChild";

  const sections = isAdd
    ? [
        { key: "personal", title: "פרטים אישיים" },
        { key: "trip", title: "פרטי נסיעה" },
        { key: "flights", title: "פרטי טיסה" },
        { key: "notes", title: "הערות" },
      ]
    : [
        { key: "personal", title: "פרטים אישיים" },
        { key: "flights", title: "טיסות" },
        { key: "notes", title: "הערות" },
      ];

  const [activeSection, setActiveSection] = useState("personal");
  const [saving, setSaving] = useState(false);

  // Save refs exposed by the embedded edit-flow containers
  const flightsSaveRef = useRef(null);
  const notesSaveRef = useRef(null);

  // ── Add flow: prefill trip fields from the main user / family ──────────────
  useEffect(() => {
    if (!isAdd) return;
    const mainUser = guests?.find((g) => g.is_main_user === 1 || g.is_main_user === true);
    if (mainUser) {
      ["week_chosen", "number_of_guests", "number_of_rooms", "flights", "flying_with_us", "flights_direction"].forEach((field) => {
        if (mainUser[field] !== undefined && mainUser[field] !== null && mainUser[field] !== "") {
          dispatch(userSlice.updateFormField({ field, value: mainUser[field] }));
        }
      });
      if (mainUser.arrival_date) dispatch(userSlice.updateFormField({ field: "arrival_date", value: isoToDisplay(mainUser.arrival_date) }));
      if (mainUser.departure_date) dispatch(userSlice.updateFormField({ field: "departure_date", value: isoToDisplay(mainUser.departure_date) }));
      if (mainUser.date_chosen) dispatch(userSlice.updateFormField({ field: "date_chosen", value: mainUser.date_chosen }));
    } else if (familyDetails) {
      if (familyDetails.start_date) dispatch(userSlice.updateFormField({ field: "arrival_date", value: isoToDisplay(familyDetails.start_date) }));
      if (familyDetails.end_date) dispatch(userSlice.updateFormField({ field: "departure_date", value: isoToDisplay(familyDetails.end_date) }));
      if (familyDetails.start_date && familyDetails.end_date) {
        dispatch(userSlice.updateFormField({ field: "date_chosen", value: `${isoToDisplay(familyDetails.end_date)}/${isoToDisplay(familyDetails.start_date)}` }));
      }
      if (vacationsDates?.length > 0 && familyDetails.start_date) {
        const matchedWeek = vacationsDates.find((d) => d.start_date === familyDetails.start_date && d.end_date === familyDetails.end_date);
        if (matchedWeek) dispatch(userSlice.updateFormField({ field: "week_chosen", value: matchedWeek.name }));
      }
      ["number_of_guests", "number_of_rooms"].forEach((field) => {
        if (familyDetails[field]) dispatch(userSlice.updateFormField({ field, value: familyDetails[field] }));
      });
    }
    if (familyDetails?.family_id) dispatch(userSlice.updateFormField({ field: "family_id", value: familyDetails.family_id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogType]);

  // Load vacation dates (for the route dropdown in the add trip step)
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

  // ── Shared field change handler (superset of both old handlers) ────────────
  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    if (name === "flights_direction") {
      dispatch(userSlice.updateFormField({ field: "flights_direction", value: checked ? value : "" }));
    } else if (name === "birth_date") {
      dispatch(userSlice.updateFormField({ field: "age", value: calculateAge(value) }));
      dispatch(userSlice.updateFormField({ field: name, value }));
    } else if (name === "flights" || name === "flying_with_us" || name === "is_in_group") {
      dispatch(userSlice.updateFormField({ field: name, value: checked }));
    } else if (name === "week_chosen") {
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
      dispatch(userSlice.updateFormField({ field: "date_chosen", value: `${value}/${userForm.arrival_date}` }));
    } else {
      dispatch(userSlice.updateFormField({ field: name, value }));
    }
    if (isAdd) {
      if (familyDetails?.family_id) dispatch(userSlice.updateFormField({ field: "family_id", value: familyDetails.family_id }));
      dispatch(userSlice.updateFormField({ field: "userType", value: dialogType }));
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const refreshGuests = async () => {
    const family_id = userForm.family_id || familyDetails?.family_id;
    if (!family_id) return;
    try {
      const res = await ApiUser.getUserFamilyList(token, family_id, vacationId);
      dispatch(userSlice.updateGuest(res.data?.length > 0 ? res.data : []));
    } catch (error) {
      console.log(error);
    }
  };

  const saveErrorMessage = (err) => {
    const status = err?.response?.status;
    const serverMessage = err?.response?.data?.message;
    if (status === 409) return serverMessage || "לא ניתן לשנות תאריכים כל עוד המשפחה משובצת לחדרים. יש לבטל את השיבוץ תחילה.";
    if (status === 400) return serverMessage || "תאריכי שהייה לא תקינים";
    return "אירעה שגיאה, נסה שנית";
  };

  const resetAndClose = () => {
    dispatch(userSlice.resetForm());
    dispatch(flightsSlice.resetForm());
    dispatch(notesSlice.resetForm());
    if (onClose) onClose();
    else dispatch(dialogSlice.resetState());
  };

  // ── Add flow save (batch: user + flights + notes) ──────────────────────────
  const saveNewGuest = async () => {
    if (dialogType === "addParent" && (!userForm.identity_id || userForm.identity_id === "")) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מספר תעודת זהות הוא חובה", timeout: 3000 }));
      return null;
    }
    if (dialogType === "addChild" && guests.some((u) => u.identity_id === userForm.identity_id)) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מספר תעודת זהות זה כבר נמצא במערכת", timeout: 3000 }));
      return null;
    }
    const newUserId = uuidv4();
    await ApiUser.addUser(token, userForm, userForm.family_id, newUserId, vacationId);
    if (Object.keys(flightsForm).length > 0 && userForm.flights) {
      await ApiFlights.addUserFlights(token, { ...flightsForm, family_id: userForm.family_id, user_id: newUserId }, vacationId);
    }
    if (notesForm.note && notesForm.note.trim() !== "") {
      await ApiNotes.addNotes(token, { ...notesForm, family_id: userForm.family_id, user_id: newUserId }, vacationId);
    }
    await refreshGuests();
    return newUserId;
  };

  const addSaveAndClose = async () => {
    try {
      setSaving(true);
      const newUserId = await saveNewGuest();
      if (newUserId === null) return;
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: dialogType === "addParent" ? "אורח נוסף בהצלחה" : "בן משפחה נוסף בהצלחה", timeout: 3000 }));
      resetAndClose();
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: saveErrorMessage(error), timeout: 4000 }));
    } finally {
      setSaving(false);
    }
  };

  const addSaveAndContinue = async () => {
    try {
      setSaving(true);
      const newUserId = await saveNewGuest();
      if (newUserId === null) return;
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: dialogType === "addParent" ? "אורח נוסף בהצלחה" : "בן משפחה נוסף בהצלחה", timeout: 3000 }));
      // Switch into edit mode for the just-created guest
      dispatch(userSlice.updateFormField({ field: "user_id", value: newUserId }));
      dispatch(flightsSlice.resetForm());
      dispatch(notesSlice.resetForm());
      dispatch(dialogSlice.updateDialogType(dialogType === "addParent" ? "editParent" : "editChild"));
      setActiveSection("personal");
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: saveErrorMessage(error), timeout: 4000 }));
    } finally {
      setSaving(false);
    }
  };

  // ── Edit flow save (current section — interim; P2 makes it one global save) ──
  const saveActiveSection = async () => {
    if (activeSection === "personal") {
      await ApiUser.updateUser(token, userForm, vacationId);
      await refreshGuests();
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: "פרטים אישיים נשמרו", timeout: 2000 }));
    } else if (activeSection === "flights" && flightsSaveRef.current) {
      await flightsSaveRef.current();
    } else if (activeSection === "notes" && notesSaveRef.current) {
      await notesSaveRef.current();
    }
  };

  const editSave = async (thenClose) => {
    try {
      setSaving(true);
      await saveActiveSection();
      if (thenClose) resetAndClose();
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: saveErrorMessage(error), timeout: 5000 }));
    } finally {
      setSaving(false);
    }
  };

  // ── Section content ─────────────────────────────────────────────────────────
  const renderSectionContent = (key) => {
    switch (key) {
      case "personal":
        return isAdd ? (
          <PersonalDetailsStep handleInputChange={handleInputChange} />
        ) : (
          <>
            <PersonalDetailsStep handleInputChange={handleInputChange} cardLayout />
            <div className={classes.togglesCard}>
              <Typography className={classes.togglesTitle}>טיסות ואפשרויות</Typography>
              <FlightToggles handleInputChange={handleInputChange} />
            </div>
          </>
        );
      case "trip":
        return <TripOptionsStep handleInputChange={handleInputChange} />;
      case "flights":
        return isAdd ? <FlightDetailsStep /> : <FlightsContainer embedded saveRef={flightsSaveRef} />;
      case "notes":
        return isAdd ? <NotesStep /> : <NotesContainer embedded saveRef={notesSaveRef} />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.layoutWrapper}>
        {/* ===== SIDE NAV ===== */}
        <div className={classes.sideNav}>
          {sections.map((section) => (
            <div
              key={section.key}
              className={`${classes.navItem} ${activeSection === section.key ? classes.navItemActive : ""}`}
              onClick={() => setActiveSection(section.key)}
            >
              <span>{section.title}</span>
            </div>
          ))}
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className={classes.contentArea}>
          <div className={classes.contentScroll}>{renderSectionContent(activeSection)}</div>

          {/* Action buttons */}
          <div className={classes.sectionActions}>
            {isAdd ? (
              <>
                <Button className={classes.primaryBtn} onClick={addSaveAndClose} disabled={saving}>
                  שמור וסגור
                </Button>
                <Button className={classes.secondaryBtn} onClick={addSaveAndContinue} disabled={saving}>
                  שמור והמשך
                </Button>
                <Button className={classes.cancelBtn} onClick={resetAndClose}>
                  ביטול
                </Button>
              </>
            ) : (
              <>
                <Button className={classes.primaryBtn} onClick={() => editSave(true)} disabled={saving}>
                  שמור וסגור
                </Button>
                <Button className={classes.secondaryBtn} onClick={() => editSave(false)} disabled={saving}>
                  שמור
                </Button>
                <Button className={classes.cancelBtn} onClick={resetAndClose}>
                  ביטול
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestEditor;
