import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
import { getGuestCompleteness } from "../../../utils/helpers/guestCompleteness";

// Fields the editor can change, per entity — used for the close-time dirty diff.
const USER_FIELDS = [
  "hebrew_first_name", "hebrew_last_name", "english_first_name", "english_last_name",
  "birth_date", "identity_id", "email", "address", "phone_a", "phone_b",
  "flights", "flying_with_us", "is_in_group", "flights_direction",
  "week_chosen", "arrival_date", "departure_date",
];
const FLIGHT_FIELDS = [
  "passport_number", "validity_passport", "user_classification",
  "outbound_flight_number", "outbound_airline", "outbound_flight_date",
  "return_flight_number", "return_airline", "return_flight_date",
  "is_source_user",
];

// Normalise for comparison so null/undefined/blank and 1-vs-"1" don't read as
// changes. A field-level diff (rather than whole-object JSON.stringify) avoids
// the key-order / injected-key noise that made the old dirty check misfire.
const norm = (v) => (v === null || v === undefined ? "" : String(v).trim());
const diffFields = (fields, a = {}, b = {}) => fields.some((f) => norm(a[f]) !== norm(b[f]));

// Unified Add/Edit Guest editor (Direction B).
//   P1 shell · P2 one global save + load-once panes · P3 conditional flights.
//   P4 (here): correct dirty tracking — section switching is always free; we only
//   prompt on close, and only when a real change exists. The baseline snapshot is
//   captured AFTER async data settles (flights load / add prefill), so the load
//   itself never reads as a change. Exit dialog offers שמור וצא / צא בלי לשמור / ביטול.
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
  const hasFlights =
    Number(userForm.flights) === 1 || userForm.flights === true ||
    Number(userForm.flying_with_us) === 1 || userForm.flying_with_us === true;

  // Live completeness for the nav chips + overall badge. Personal fields come
  // from userForm; flight fields from flightsForm (authoritative once loaded),
  // so they're merged into one object for the check.
  const completeness = getGuestCompleteness({ ...userForm, ...flightsForm });

  // Flights section only exists when the guest actually has flights.
  const sections = isAdd
    ? [
        { key: "personal", title: "פרטים אישיים" },
        { key: "trip", title: "פרטי נסיעה" },
        ...(hasFlights ? [{ key: "flights", title: "פרטי טיסה" }] : []),
        { key: "notes", title: "הערות" },
      ]
    : [
        { key: "personal", title: "פרטים אישיים" },
        ...(hasFlights ? [{ key: "flights", title: "טיסות" }] : []),
        { key: "notes", title: "הערות" },
      ];

  const [activeSection, setActiveSection] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Dirty-tracking baseline. Captured once async data has settled (see effect).
  const snapshotRef = useRef(null);
  const initialFlyingRef = useRef(undefined); // did the guest start with flights?
  const [prefillDone, setPrefillDone] = useState(!isAdd); // edit needs no prefill

  // If flights is toggled off while its pane is active, fall back to personal.
  useEffect(() => {
    if (!hasFlights && activeSection === "flights") setActiveSection("personal");
  }, [hasFlights, activeSection]);

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
    setPrefillDone(true);
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

  // ── Capture the dirty baseline once everything has loaded ──────────────────
  // edit-with-flights waits for the flight row to load (flightsForm.type set);
  // add waits for prefill. Capturing too early is exactly what made the old
  // check think an untouched guest was dirty.
  useEffect(() => {
    if (snapshotRef.current) return;
    if (initialFlyingRef.current === undefined) {
      if (isAdd) {
        initialFlyingRef.current = false;
      } else if (userForm.user_id) {
        initialFlyingRef.current =
          Number(userForm.flying_with_us) === 1 || userForm.flying_with_us === true ||
          Number(userForm.flights) === 1 || userForm.flights === true;
      } else {
        return; // wait for the guest to populate
      }
    }
    const flightsReady = !initialFlyingRef.current || Boolean(flightsForm.type);
    if (prefillDone && flightsReady) {
      snapshotRef.current = { user: { ...userForm }, flights: { ...flightsForm }, notes: { ...notesForm } };
    }
  }, [isAdd, prefillDone, userForm, flightsForm, notesForm]);

  const isDirty = () => {
    const s = snapshotRef.current;
    if (!s) return false; // baseline not established yet → nothing to lose
    if (diffFields(USER_FIELDS, s.user, userForm)) return true;
    if (diffFields(FLIGHT_FIELDS, s.flights, flightsForm)) return true;
    if (norm(s.notes.note) !== norm(notesForm.note)) return true;
    return false;
  };

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

  // ── Single global save: persists user + flights + notes from Redux ─────────
  const saveAll = async () => {
    if ((dialogType === "addParent" || dialogType === "editParent") && (!userForm.identity_id || String(userForm.identity_id).trim() === "")) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מספר תעודת זהות הוא חובה", timeout: 3000 }));
      return null;
    }
    if (dialogType === "addChild" && guests.some((u) => u.identity_id === userForm.identity_id)) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מספר תעודת זהות זה כבר נמצא במערכת", timeout: 3000 }));
      return null;
    }

    const familyId = userForm.family_id || familyDetails?.family_id;
    const userId = isAdd ? uuidv4() : userForm.user_id;

    if (isAdd) {
      await ApiUser.addUser(token, userForm, familyId, userId, vacationId);
    } else {
      await ApiUser.updateUser(token, userForm, vacationId);
    }

    if (isAdd) {
      if (userForm.flights && Object.keys(flightsForm).length > 0) {
        await ApiFlights.addUserFlights(token, { ...flightsForm, family_id: familyId, user_id: userId }, vacationId);
      }
    } else if (hasFlights && flightsForm.type) {
      if (flightsForm.type === "edit") {
        await ApiFlights.updateUserFligets(token, userId, flightsForm, vacationId);
      } else {
        await ApiFlights.addUserFlights(token, { ...flightsForm, family_id: familyId, user_id: userId }, vacationId);
      }
    }

    if (notesForm.note && notesForm.note.trim() !== "") {
      await ApiNotes.addNotes(token, { ...notesForm, family_id: familyId, user_id: userId }, vacationId);
    }

    await refreshGuests();
    return userId;
  };

  const successMessage = () => {
    if (dialogType === "addParent") return "אורח נוסף בהצלחה";
    if (dialogType === "addChild") return "בן משפחה נוסף בהצלחה";
    return "נתוני אורח נשמרו";
  };

  const saveAndClose = async () => {
    try {
      setSaving(true);
      const userId = await saveAll();
      if (userId === null) return false;
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: successMessage(), timeout: 3000 }));
      resetAndClose();
      return true;
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: saveErrorMessage(error), timeout: 5000 }));
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Add only: save then stay open in edit mode for the just-created guest.
  const saveAndContinue = async () => {
    try {
      setSaving(true);
      const userId = await saveAll();
      if (userId === null) return;
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: successMessage(), timeout: 3000 }));
      dispatch(userSlice.updateFormField({ field: "user_id", value: userId }));
      dispatch(flightsSlice.resetForm());
      dispatch(notesSlice.resetForm());
      // Re-establish the dirty baseline for the new edit session.
      snapshotRef.current = null;
      initialFlyingRef.current = undefined;
      dispatch(dialogSlice.updateDialogType(dialogType === "addParent" ? "editParent" : "editChild"));
      setActiveSection("personal");
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: saveErrorMessage(error), timeout: 5000 }));
    } finally {
      setSaving(false);
    }
  };

  // ── Close flow (prompt only when there are unsaved changes) ────────────────
  const handleCloseRequest = () => {
    if (isDirty()) setShowExitDialog(true);
    else resetAndClose();
  };

  const exitSaveAndClose = async () => {
    setShowExitDialog(false);
    await saveAndClose(); // closes on success; stays open (with toast) on failure
  };

  const exitDiscard = () => {
    setShowExitDialog(false);
    resetAndClose();
  };

  // ── Section content ─────────────────────────────────────────────────────────
  const renderSectionBody = (key) => {
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
        return isAdd ? <FlightDetailsStep /> : <FlightsContainer embedded />;
      case "notes":
        return isAdd ? <NotesStep /> : <NotesContainer embedded />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.layoutWrapper}>
        {/* ===== SIDE NAV ===== */}
        <div className={classes.sideNav}>
          {sections.map((section) => {
            const sec = completeness.bySection[section.key];
            return (
              <div
                key={section.key}
                className={`${classes.navItem} ${activeSection === section.key ? classes.navItemActive : ""}`}
                onClick={() => setActiveSection(section.key)}
              >
                <span>{section.title}</span>
                {sec && (
                  <span
                    className={`${classes.navChip} ${sec.complete ? classes.navChipComplete : classes.navChipIncomplete}`}
                    title={sec.complete ? "הושלם" : `חסרים ${sec.missingCount}`}
                  >
                    {sec.complete ? "✓" : sec.missingCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className={classes.contentArea}>
          <div className={classes.contentScroll}>
            {/* All panes mounted once; only the active one is shown. */}
            {sections.map((section) => (
              <div key={section.key} style={{ display: activeSection === section.key ? "block" : "none" }}>
                {renderSectionBody(section.key)}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className={classes.sectionActions}>
            <Button className={classes.primaryBtn} onClick={saveAndClose} disabled={saving}>
              שמור וסגור
            </Button>
            {isAdd && (
              <Button className={classes.secondaryBtn} onClick={saveAndContinue} disabled={saving}>
                שמור והמשך
              </Button>
            )}
            <Button className={classes.cancelBtn} onClick={handleCloseRequest} disabled={saving}>
              ביטול
            </Button>

            <span
              className={`${classes.overallBadge} ${completeness.status === "complete" ? classes.overallComplete : classes.overallIncomplete}`}
            >
              {completeness.status === "complete"
                ? "✓ מוכן להנפקת כרטיס"
                : `חסרים ${completeness.missing.length} שדות`}
            </span>
          </div>
        </div>
      </div>

      {/* ===== SAVE-ON-EXIT WARNING ===== */}
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        PaperProps={{ className: classes.warningDialogPaper }}
        style={{ zIndex: 1700 }}
      >
        <DialogTitle className={classes.warningTitle}>שינויים שלא נשמרו</DialogTitle>
        <DialogContent>
          <Typography className={classes.warningText}>יש שינויים שלא נשמרו, מה תרצה לעשות?</Typography>
        </DialogContent>
        <DialogActions className={classes.warningActions}>
          <Button onClick={exitSaveAndClose} className={classes.warningSaveBtn} disabled={saving}>
            שמור וצא
          </Button>
          <Button onClick={exitDiscard} className={classes.warningExitBtn} disabled={saving}>
            צא בלי לשמור
          </Button>
          <Button onClick={() => setShowExitDialog(false)} className={classes.warningCancelBtn} disabled={saving}>
            ביטול
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GuestEditor;
