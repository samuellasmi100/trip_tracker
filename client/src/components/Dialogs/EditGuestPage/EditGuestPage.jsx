import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useStyles } from "./EditGuestPage.style";
import { useDispatch, useSelector } from "react-redux";

// Section content
import PersonalDetailsStep from "../Guest/steps/PersonalDetailsStep";
import FlightToggles from "../Reservation/Flights/Flights";

// Embedded containers
import FlightsContainer from "../Flights/Flights";
import NotesContainer from "../Notes/Notes";

// APIs
import ApiUser from "../../../apis/userRequest";

// Redux
import * as userSlice from "../../../store/slice/userSlice";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";

import calculateAge from "../../../utils/HelperFunction/calculateAge";

const EditGuestPage = ({ onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Redux state
  const userForm = useSelector((state) => state.userSlice.form);
  const flightsForm = useSelector((state) => state.flightsSlice.form);
  const notesForm = useSelector((state) => state.notesSlice.form);
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");

  const isParent = dialogType === "editParent";
  // A guest has flights if either the "flights" toggle OR "flying_with_us" is set —
  // imported guests sometimes have flying_with_us=1 without flights=1 being set
  const hasFlights =
    Number(userForm.flights) === 1 || userForm.flights === true ||
    Number(userForm.flying_with_us) === 1 || userForm.flying_with_us === true;

  // Active section (single selection, not accordion)
  const [activeSection, setActiveSection] = useState("personal");

  // Dirty tracking
  const snapshots = useRef({});
  const [dirtyMap, setDirtyMap] = useState({});
  const [savingMap, setSavingMap] = useState({});

  // Dialogs
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [showSwitchWarning, setShowSwitchWarning] = useState(false);
  const [pendingSection, setPendingSection] = useState(null);

  // Save refs for embedded containers
  const flightsSaveRef = useRef(null);
  const notesSaveRef = useRef(null);

  // Take snapshots on mount (delay for embedded containers to load)
  useEffect(() => {
    const timer = setTimeout(() => {
      snapshots.current = {
        personal: JSON.stringify(userForm),
        flights: JSON.stringify(flightsForm),
        notes: JSON.stringify(notesForm),
      };
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Track dirty: personal
  useEffect(() => {
    if (snapshots.current.personal) {
      setDirtyMap((prev) => ({
        ...prev,
        personal: JSON.stringify(userForm) !== snapshots.current.personal,
      }));
    }
  }, [userForm]);

  // Track dirty: flights
  useEffect(() => {
    if (snapshots.current.flights) {
      setDirtyMap((prev) => ({
        ...prev,
        flights: JSON.stringify(flightsForm) !== snapshots.current.flights,
      }));
    }
  }, [flightsForm]);

  // Track dirty: notes
  useEffect(() => {
    if (snapshots.current.notes) {
      setDirtyMap((prev) => ({
        ...prev,
        notes: JSON.stringify(notesForm) !== snapshots.current.notes,
      }));
    }
  }, [notesForm]);

  // Personal section handleInputChange
  const handlePersonalInputChange = useCallback(
    (e) => {
      let { name, value, checked } = e.target;
      if (name === "birth_date") {
        const age = calculateAge(value);
        dispatch(userSlice.updateFormField({ field: "age", value: age }));
        dispatch(userSlice.updateFormField({ field: name, value }));
      } else if (
        name === "flights" ||
        name === "flying_with_us" ||
        name === "is_in_group"
      ) {
        dispatch(userSlice.updateFormField({ field: name, value: checked }));
      } else if (name === "flights_direction") {
        dispatch(
          userSlice.updateFormField({
            field: "flights_direction",
            value: checked ? value : "",
          })
        );
      } else {
        dispatch(userSlice.updateFormField({ field: name, value }));
      }
    },
    [dispatch]
  );

  // Save personal section
  const savePersonal = async () => {
    try {
      setSavingMap((prev) => ({ ...prev, personal: true }));
      await ApiUser.updateUser(token, userForm, vacationId);
      const family_id = userForm.family_id;
      if (family_id) {
        const response = await ApiUser.getUserFamilyList(
          token,
          family_id,
          vacationId
        );
        dispatch(
          userSlice.updateGuest(
            response.data?.length > 0 ? response.data : []
          )
        );
      }
      snapshots.current.personal = JSON.stringify(userForm);
      setDirtyMap((prev) => ({ ...prev, personal: false }));
      dispatch(
        snackBarSlice.setSnackBar({
          type: "success",
          message: "פרטים אישיים נשמרו",
          timeout: 2000,
        })
      );
    } catch (err) {
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: "שגיאה בשמירת פרטים",
          timeout: 3000,
        })
      );
    } finally {
      setSavingMap((prev) => ({ ...prev, personal: false }));
    }
  };

  // Save a specific section
  const saveSection = async (key) => {
    try {
      if (key === "personal") {
        await savePersonal();
      } else if (key === "flights" && flightsSaveRef.current) {
        setSavingMap((prev) => ({ ...prev, flights: true }));
        await flightsSaveRef.current();
        snapshots.current.flights = JSON.stringify(flightsForm);
        setDirtyMap((prev) => ({ ...prev, flights: false }));
        setSavingMap((prev) => ({ ...prev, flights: false }));
      } else if (key === "notes" && notesSaveRef.current) {
        setSavingMap((prev) => ({ ...prev, notes: true }));
        await notesSaveRef.current();
        snapshots.current.notes = JSON.stringify(notesForm);
        setDirtyMap((prev) => ({ ...prev, notes: false }));
        setSavingMap((prev) => ({ ...prev, notes: false }));
      }
    } catch (err) {
      setSavingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Switch section — check dirty state first
  const switchSection = (key) => {
    if (key === activeSection) return;
    if (dirtyMap[activeSection]) {
      setPendingSection(key);
      setShowSwitchWarning(true);
    } else {
      setActiveSection(key);
    }
  };

  // Save current section then switch
  const handleSaveAndSwitch = async () => {
    setShowSwitchWarning(false);
    await saveSection(activeSection);
    setActiveSection(pendingSection);
    setPendingSection(null);
  };

  // Switch without saving
  const handleSwitchWithoutSave = () => {
    setShowSwitchWarning(false);
    // Reset dirty for the section we're leaving
    setDirtyMap((prev) => ({ ...prev, [activeSection]: false }));
    setActiveSection(pendingSection);
    setPendingSection(null);
  };

  // Close handler with dirty check
  const handleClose = () => {
    const hasDirty = Object.values(dirtyMap).some(Boolean);
    if (hasDirty) {
      setShowCloseWarning(true);
    } else {
      actualClose();
    }
  };

  const actualClose = () => {
    if (onClose) onClose();
  };

  // Save current section and close
  const handleSaveAndClose = async () => {
    setShowCloseWarning(false);
    // Save all dirty sections
    const dirtyKeys = Object.keys(dirtyMap).filter((k) => dirtyMap[k]);
    for (const key of dirtyKeys) {
      await saveSection(key);
    }
    actualClose();
  };

  // Save current section and go to next tab
  const saveAndGoToNext = async () => {
    if (dirtyMap[activeSection]) {
      await saveSection(activeSection);
    }
    const currentIndex = sections.findIndex((s) => s.key === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].key);
    }
  };

  // Save current section and close modal
  const saveCurrentAndClose = async () => {
    if (dirtyMap[activeSection]) {
      await saveSection(activeSection);
    }
    actualClose();
  };

  // Section definitions
  const sections = [
    { key: "personal", title: "פרטים אישיים" },
    ...(hasFlights ? [{ key: "flights", title: "טיסות" }] : []),
    { key: "notes", title: "הערות" },
  ];

  const renderSectionContent = (key) => {
    switch (key) {
      case "personal":
        return (
          <>
            <PersonalDetailsStep
              handleInputChange={handlePersonalInputChange}
              cardLayout
            />
            <div style={{
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "24px 28px",
            }}>
              <Typography style={{ fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "20px" }}>
                טיסות ואפשרויות
              </Typography>
              <FlightToggles handleInputChange={handlePersonalInputChange} />
            </div>
          </>
        );
      case "flights":
        return <FlightsContainer embedded saveRef={flightsSaveRef} />;
      case "notes":
        return <NotesContainer embedded saveRef={notesSaveRef} />;
      default:
        return null;
    }
  };

  // Can the current section be saved via saveRef/savePersonal?
  const canSaveActiveSection =
    activeSection === "personal" ||
    activeSection === "flights" ||
    activeSection === "notes";

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.layoutWrapper}>
        {/* ===== SIDE NAV ===== */}
        <div className={classes.sideNav}>
          {sections.map((section) => (
            <div
              key={section.key}
              className={`${classes.navItem} ${
                activeSection === section.key ? classes.navItemActive : ""
              }`}
              onClick={() => switchSection(section.key)}
            >
              <span>{section.title}</span>
              {dirtyMap[section.key] && !savingMap[section.key] && (
                <span className={classes.navDirtyDot} />
              )}
              {savingMap[section.key] && (
                <Typography className={classes.savingBadge}>שומר...</Typography>
              )}
            </div>
          ))}
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className={classes.contentArea}>
          <div className={classes.contentScroll}>
            {renderSectionContent(activeSection)}
          </div>

          {/* Action buttons */}
          <div className={classes.sectionActions}>
            {canSaveActiveSection && sections.findIndex((s) => s.key === activeSection) < sections.length - 1 && (
              <Button
                className={classes.sectionSaveBtn}
                onClick={saveAndGoToNext}
                disabled={savingMap[activeSection]}
              >
                {savingMap[activeSection] ? "שומר..." : "שמור והמשך"}
              </Button>
            )}
            {canSaveActiveSection && (
              <Button
                className={classes.saveCloseBtn}
                onClick={saveCurrentAndClose}
                disabled={savingMap[activeSection]}
              >
                שמור וסגור
              </Button>
            )}
            <Button className={classes.closePageButton} onClick={handleClose}>
              ביטול
            </Button>
          </div>
        </div>
      </div>

      {/* ===== SWITCH-SECTION WARNING ===== */}
      <Dialog
        open={showSwitchWarning}
        onClose={() => {
          setShowSwitchWarning(false);
          setPendingSection(null);
        }}
        PaperProps={{ className: classes.warningDialogPaper }}
        style={{ zIndex: 1700 }}
      >
        <DialogTitle className={classes.warningTitle}>
          שינויים שלא נשמרו
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.warningText}>
            יש שינויים שלא נשמרו, מה תרצה לעשות?
          </Typography>
        </DialogContent>
        <DialogActions className={classes.warningActions}>
          <Button
            onClick={handleSaveAndSwitch}
            className={classes.warningSaveBtn}
          >
            שמור והמשך
          </Button>
          <Button
            onClick={handleSwitchWithoutSave}
            className={classes.warningExitBtn}
          >
            המשך ללא שמירה
          </Button>
          <Button
            onClick={() => {
              setShowSwitchWarning(false);
              setPendingSection(null);
            }}
            className={classes.warningCancelBtn}
          >
            ביטול
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== CLOSE WARNING ===== */}
      <Dialog
        open={showCloseWarning}
        onClose={() => setShowCloseWarning(false)}
        PaperProps={{ className: classes.warningDialogPaper }}
        style={{ zIndex: 1700 }}
      >
        <DialogTitle className={classes.warningTitle}>
          שינויים שלא נשמרו
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.warningText}>
            יש שינויים שלא נשמרו, לצאת בכל זאת?
          </Typography>
        </DialogContent>
        <DialogActions className={classes.warningActions}>
          <Button
            onClick={handleSaveAndClose}
            className={classes.warningSaveBtn}
          >
            שמור וצא
          </Button>
          <Button
            onClick={() => {
              setShowCloseWarning(false);
              actualClose();
            }}
            className={classes.warningExitBtn}
          >
            צא ללא שמירה
          </Button>
          <Button
            onClick={() => setShowCloseWarning(false)}
            className={classes.warningCancelBtn}
          >
            ביטול
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditGuestPage;
