import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GroupFlightsDialogView from "./GroupFlightsDialog.view";
import ApiFlights from "../../../../apis/flightsRequest";
import ApiSettings from "../../../../apis/settingsRequest";
import * as snackBarSlice from "../../../../store/slices/snackbarSlice";
import { isoToDisplay, formatDateInput } from "../../../../utils/helpers/formatDate";
import { LEG_KEYS, ALL_SCOPE, hasFlightData, surnameKey, surnameLabel } from "../../../../utils/helpers/subFamilies";

const DATE_KEYS = ["outbound_flight_date", "return_flight_date"];
const emptyLegs = () => LEG_KEYS.reduce((acc, k) => ({ ...acc, [k]: "" }), {});

const isFilled = (v) => v !== null && v !== undefined && String(v).trim() !== "";

// Normalize a stored leg value for compare/prefill: dates → DD/MM/YYYY display
// (DB may hold ISO or display), others trimmed.
const normLeg = (key, value) => {
  if (!isFilled(value)) return "";
  return DATE_KEYS.includes(key) ? isoToDisplay(value) : String(value).trim();
};

// Pull a guest's 6 legs as a normalized {key: value} object (for copy-from).
const guestLegs = (g) => LEG_KEYS.reduce((acc, k) => ({ ...acc, [k]: normLeg(k, g[k]) }), {});

// Base per-person state. Everyone starts with their toggle OFF; the open effect
// then pre-selects the people matching the entry scope. People who already have
// flight data are LOCKED (a group apply would overwrite them) — never auto-
// selected and excluded from the apply.
const initialPersonState = (g) => ({
  flying: false,
  direction: g.flights_direction || "",
  // Passport is per-person/personal — prefilled from this guest's own row,
  // never shared. validity is a date → show DD/MM/YYYY.
  passport_number: g.passport_number || "",
  validity_passport: isoToDisplay(g.validity_passport) || "",
});

// Container: pre-populates from existing data on open, owns per-person flight
// intent (toggle + direction) and the shared leg inputs, and POSTs the bulk
// apply. People come from the already-loaded family guests (userSlice.guests).
const GroupFlightsDialog = ({ open, scope = ALL_SCOPE, onClose, onApplied }) => {
  const dispatch = useDispatch();
  const family = useSelector((state) => state.userSlice.family);
  const guests = useSelector((state) => state.userSlice.guests);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");

  // user_id -> { flying, direction }
  const [peopleState, setPeopleState] = useState({});
  const [legs, setLegs] = useState(emptyLegs);
  const [saving, setSaving] = useState(false);
  const [flightsCompany, setFlightsCompany] = useState([]);
  // Selected "copy flight info from" person — controlled so the menu reliably
  // fires onChange and shows which person was copied (reset whenever we open).
  const [copyFromId, setCopyFromId] = useState("");

  // Shared flight DATES default from the family's route dates (start → outbound,
  // end → return). The real trip dates live on families.start_date/end_date (ISO);
  // the guest arrival/departure columns are an unpopulated '""' placeholder.
  const dateDefaultLegs = () => {
    const d = emptyLegs();
    d.outbound_flight_date = isoToDisplay(family?.start_date) || "";
    d.return_flight_date = isoToDisplay(family?.end_date) || "";
    return d;
  };

  // People with ANY existing flight leg data are locked out of the group apply
  // (it would overwrite them). Pre-selection / apply skip them; their changes are
  // made individually on their own page.
  const lockedIds = new Set((guests || []).filter((g) => hasFlightData(g)).map((g) => g.user_id));

  // The modal is scoped to the entry choice: only people of the chosen scope are
  // shown / counted / applied (other sub-families don't appear at all). Locked
  // people WITHIN the scope still show (with their note). ALL_SCOPE = everyone.
  const inScope = (g) => scope === ALL_SCOPE || surnameKey(g) === scope;

  // ── Pre-population (each time the dialog opens) ─────────────────────────────
  // The WHO was decided at the button click (scope = a surname key or ALL_SCOPE);
  // the modal opens already scoped — pre-select the matching NON-LOCKED people.
  useEffect(() => {
    if (!open) return;
    const state = {};
    (guests || []).forEach((g) => {
      state[g.user_id] = initialPersonState(g);
      if (hasFlightData(g)) return; // locked → never auto-selected
      const match = scope === ALL_SCOPE || surnameKey(g) === scope;
      if (match) state[g.user_id] = { ...state[g.user_id], flying: true, direction: state[g.user_id].direction || "round_trip" };
    });
    setPeopleState(state);

    // Shared legs default to the family's route dates.
    setLegs(dateDefaultLegs());
    setCopyFromId("");

    ApiSettings.getFlightCompanies(token)
      .then((res) => setFlightsCompany((res.data || []).map((c) => c.name)))
      .catch(() => setFlightsCompany([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // All handlers spread the prior per-person state so passport (and any other
  // personal field) is preserved when toggling flying / direction.
  const togglePersonFlying = (userId) => {
    if (lockedIds.has(userId)) return; // locked people are never group-toggled
    setPeopleState((prev) => {
      const cur = prev[userId] || { flying: false, direction: "" };
      const flying = !cur.flying;
      return { ...prev, [userId]: { ...cur, flying, direction: flying ? (cur.direction || "round_trip") : cur.direction } };
    });
  };

  const setPersonDirection = (userId, direction) => {
    setPeopleState((prev) => ({ ...prev, [userId]: { ...(prev[userId] || {}), flying: true, direction } }));
  };

  // Passport is per-person/personal — validity auto-slashes to DD/MM/YYYY.
  const setPersonPassport = (userId, field, value) => {
    const v = field === "validity_passport" ? formatDateInput(value) : value;
    setPeopleState((prev) => ({ ...prev, [userId]: { ...(prev[userId] || {}), [field]: v } }));
  };

  const handleLegChange = (name, value) => {
    const next = DATE_KEYS.includes(name) ? formatDateInput(value) : value;
    setLegs((prev) => ({ ...prev, [name]: next }));
  };

  const handleCopyFrom = (userId) => {
    setCopyFromId(userId);
    const g = (guests || []).find((x) => x.user_id === userId);
    if (g) setLegs({ ...emptyLegs(), ...guestLegs(g) });
  };

  const handleSubmit = async () => {
    const familyId = family?.family_id;
    if (!familyId) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "לא נבחרה משפחה", timeout: 3000 }));
      return;
    }
    // Only the chosen scope's NON-LOCKED people are in the payload — other
    // sub-families are never touched, and locked people are excluded.
    const people = (guests || [])
      .filter((g) => inScope(g) && !lockedIds.has(g.user_id))
      .map((g) => {
        const st = peopleState[g.user_id] || { flying: false, direction: "" };
        return {
          user_id: g.user_id,
          flying: !!st.flying,
          direction: st.flying ? (st.direction || "round_trip") : "",
          // Per-person passport — sent on each person's own record, never shared.
          passport_number: (st.passport_number || "").trim(),
          validity_passport: (st.validity_passport || "").trim(),
        };
      });
    if (!people.some((p) => p.flying)) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "יש לסמן לפחות אדם אחד שטס", timeout: 3000 }));
      return;
    }
    try {
      setSaving(true);
      await ApiFlights.applyFlightsBulk(token, familyId, people, legs, vacationId);
      const flyingCount = people.filter((p) => p.flying).length;
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: `פרטי הטיסה הוחלו על ${flyingCount} אנשים`, timeout: 3000 }));
      onClose();
      if (onApplied) await onApplied();
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "החלת פרטי הטיסה נכשלה, נסה שוב", timeout: 5000 }));
    } finally {
      setSaving(false);
    }
  };

  // View model — only the chosen scope's people are displayed.
  const people = (guests || []).filter(inScope).map((g) => {
    const st = peopleState[g.user_id] || { flying: false, direction: "" };
    return {
      user_id: g.user_id,
      hebrew_first_name: g.hebrew_first_name,
      hebrew_last_name: g.hebrew_last_name,
      english_first_name: g.english_first_name,
      english_last_name: g.english_last_name,
      identity_id: g.identity_id,
      is_main_user: g.is_main_user,
      // Tag reflects genuine flight DATA, not a (possibly stale) flag.
      hasFlights: hasFlightData(g),
      // Locked = already has flight data → excluded from the group apply.
      locked: lockedIds.has(g.user_id),
      flying: st.flying,
      direction: st.direction,
      passport_number: st.passport_number || "",
      validity_passport: st.validity_passport || "",
    };
  });
  // Counts reflect only the togglable (non-locked) people.
  const togglable = people.filter((p) => !p.locked);
  const flyingCount = togglable.filter((p) => p.flying).length;

  // Label of the scope the modal was opened with (shown in the header).
  const scopeLabel = scope === ALL_SCOPE ? "כל הקבוצה" : surnameLabel(scope);
  const copyFromOptions = (guests || [])
    .filter((g) => inScope(g) && hasFlightData(g))
    .map((g) => ({
      user_id: g.user_id,
      label: [g.hebrew_first_name, g.hebrew_last_name].filter(Boolean).join(" ").trim()
        || [g.english_first_name, g.english_last_name].filter(Boolean).join(" ").trim()
        || g.identity_id || "—",
    }));

  return (
    <GroupFlightsDialogView
      open={open}
      familyName={family?.family_name}
      scopeLabel={scopeLabel}
      legs={legs}
      flightsCompany={flightsCompany}
      onLegChange={handleLegChange}
      copyFromOptions={copyFromOptions}
      copyFromValue={copyFromId}
      onCopyFrom={handleCopyFrom}
      people={people}
      flyingCount={flyingCount}
      onTogglePerson={togglePersonFlying}
      onSetDirection={setPersonDirection}
      onSetPassport={setPersonPassport}
      saving={saving}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};

export default GroupFlightsDialog;
