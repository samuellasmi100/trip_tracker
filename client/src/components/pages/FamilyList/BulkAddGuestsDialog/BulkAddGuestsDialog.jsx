import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import BulkAddGuestsDialogView from "./BulkAddGuestsDialog.view";
import ApiUser from "../../../../apis/userRequest";
import * as snackBarSlice from "../../../../store/slices/snackbarSlice";
import { findMainUser, inheritTripFields } from "../../../../utils/helpers/inheritTripFields";
import { formatDateInput } from "../../../../utils/helpers/formatDate";
import calculateAge from "../../../../utils/helpers/calculateAge";

const NAME_KEYS = [
  "hebrew_first_name",
  "hebrew_last_name",
  "english_first_name",
  "english_last_name",
];

const emptyRow = () => ({
  hebrew_first_name: "",
  hebrew_last_name: "",
  english_first_name: "",
  english_last_name: "",
  user_classification: "",
  birth_date: "",
  age: "", // computed from birth_date — never typed (mirrors the single editor)
});

const INITIAL_ROWS = 3;
// Start with up to INITIAL_ROWS rows, but never more than the remaining capacity.
const makeInitialRows = (cap) =>
  Array.from({ length: Math.max(1, Math.min(INITIAL_ROWS, cap)) }, emptyRow);

const rowHasName = (row) => NAME_KEYS.some((k) => row[k] && row[k].trim() !== "");

// Container: owns the editable rows, inherits the head's trip info once, and
// posts the bulk batch. Reads the current family + its guests from Redux (the
// drawer already populated them when it opened).
const BulkAddGuestsDialog = ({ open, onClose, onAdded }) => {
  const dispatch = useDispatch();
  const family = useSelector((state) => state.userSlice.family);
  const guests = useSelector((state) => state.userSlice.guests);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");

  const [rows, setRows] = useState(() => makeInitialRows(INITIAL_ROWS));
  const [saving, setSaving] = useState(false);

  // Remaining capacity = family's defined size − existing guests. families.
  // number_of_guests holds the size (NULL/blank = no limit); the guest count
  // (loaded in the drawer) includes the main user. Infinity = no limit.
  const sizeLimit = Number(family?.number_of_guests);
  const hasLimit = family?.number_of_guests != null
    && String(family?.number_of_guests).trim() !== "" && !Number.isNaN(sizeLimit);
  const existingCount = guests?.length || 0;
  const remaining = hasLimit ? Math.max(0, sizeLimit - existingCount) : Infinity;
  const canAddRow = !Number.isFinite(remaining) || rows.length < remaining;

  // Re-seed the rows whenever the dialog opens, capped to the remaining capacity.
  useEffect(() => {
    if (open) setRows(makeInitialRows(remaining));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleRowChange = (index, field, value) => {
    setRows((prev) => prev.map((r, i) => {
      if (i !== index) return r;
      // birth_date: format DD/MM/YYYY and recompute age (same helper the single
      // editor uses) — age is derived, never typed.
      if (field === "birth_date") {
        const birth_date = formatDateInput(value);
        return { ...r, birth_date, age: birth_date ? calculateAge(birth_date) : "" };
      }
      return { ...r, [field]: value };
    }));
  };

  const addRow = () =>
    setRows((prev) => (Number.isFinite(remaining) && prev.length >= remaining ? prev : [...prev, emptyRow()]));

  const removeRow = (index) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const reset = () => setRows(makeInitialRows(remaining));

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const familyId = family?.family_id;
    if (!familyId) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "לא נבחרה משפחה", timeout: 3000 }));
      return;
    }
    // Skip rows the secretary left fully blank.
    const filled = rows.filter(rowHasName);
    if (filled.length === 0) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "יש להזין לפחות שם אחד", timeout: 3000 }));
      return;
    }
    // Block exceeding the family's defined size (server enforces this too).
    if (Number.isFinite(remaining) && filled.length > remaining) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: `לא ניתן להוסיף יותר מ-${remaining} אנשים — חרגת מגודל המשפחה`, timeout: 5000 }));
      return;
    }

    // Inherit the head's trip info ONCE; apply to every new person. Names stay
    // per-row (independent free text) — only the trip fields are shared.
    const sharedTrip = inheritTripFields(findMainUser(guests));
    const people = filled.map((row) => ({
      user_id: uuidv4(),
      hebrew_first_name: (row.hebrew_first_name || "").trim(),
      hebrew_last_name: (row.hebrew_last_name || "").trim(),
      english_first_name: (row.english_first_name || "").trim(),
      english_last_name: (row.english_last_name || "").trim(),
      // birth_date + age are guest columns; user_classification is split out
      // server-side and written to the flights table.
      birth_date: (row.birth_date || "").trim(),
      age: row.age === null || row.age === undefined ? "" : String(row.age),
      user_classification: row.user_classification || "",
      user_type: "client",
      is_main_user: 0,
      ...sharedTrip,
    }));

    try {
      setSaving(true);
      await ApiUser.addUsersBulk(token, familyId, people, vacationId);
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: `${people.length} אנשים נוספו בהצלחה`, timeout: 3000 }));
      reset();
      onClose();
      if (onAdded) await onAdded();
    } catch (error) {
      console.log(error);
      // Prefer the server's message (e.g. the family-size 400) when present.
      const serverMessage = error?.response?.data?.message;
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: serverMessage || "הוספת האנשים נכשלה, נסה שוב", timeout: 5000 }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <BulkAddGuestsDialogView
      open={open}
      rows={rows}
      saving={saving}
      familyName={family?.family_name}
      remaining={remaining}
      canAddRow={canAddRow}
      onRowChange={handleRowChange}
      onAddRow={addRow}
      onRemoveRow={removeRow}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
};

export default BulkAddGuestsDialog;
