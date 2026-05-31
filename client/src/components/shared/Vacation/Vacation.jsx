import React, { useEffect, useState } from "react";
import VacationsView from "./Vacation.view";
import { useDispatch, useSelector } from "react-redux";
import * as staticSlice from "../../../store/slices/staticSlice"
import * as vacationSlice from "../../../store/slices/vacationSlice"
import * as snackBarSlice from "../../../store/slices/snackbarSlice"
import ApiVacations from "../../../apis/vacationRequest"

const Vacation = () => {
  const dispatch = useDispatch()
  const token = sessionStorage.getItem("token")
  const form = useSelector((state) => state.staticSlice.form)
  const vacationDetails = useSelector((state) => state.vacationSlice.vacationDetails)
  const detailsModalType = useSelector((state) => state.staticSlice.detailsModalType)
  const isEdit = detailsModalType === "editVacation"

  // Part-deletion state lives here, in the Edit Vacation dialog. `partToDelete`
  // holds the part awaiting confirmation; `blockers` is set only when the server
  // refuses the delete (part still in use), switching the dialog to "who to
  // reassign first". This is independent of the edit/update form logic below.
  const [partToDelete, setPartToDelete] = useState(null)
  const [blockers, setBlockers] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Existing parts of the vacation being edited, taken from the already-loaded
  // table data and keyed by vacation_id. Each carries its id (the delete target).
  const parts = (vacationDetails || []).find((v) => v.vacation_id === form?.vacation_id)?.details || []

  // Drop a deleted part from the shared table state so both this dialog's list
  // and the Vacations table reflect it without a refetch. No renumbering — the
  // surviving parts keep their ids and positional names untouched.
  const removePartFromDetails = (partId) => {
    const updated = (vacationDetails || []).map((v) =>
      v.vacation_id === form?.vacation_id
        ? { ...v, details: (v.details || []).filter((d) => d.id !== partId) }
        : v
    )
    dispatch(vacationSlice.updateVacationDetails(updated))
  }

  // The route list renders one row per part, with each row's date inputs bound to
  // the positional form fields (start_date_<i>/end_date_<i>) the save flow reads.
  // When a part is removed we close the gap in that positional copy and drop the
  // route count by one, so the remaining rows stay aligned with the parts list
  // (no stale/extra date row after deleting a middle part). This only reindexes
  // the client-side form copy — the DB delete is targeted by id, never renumbered.
  const syncFormAfterDelete = (deletedPart) => {
    const idx = parts.findIndex((p) => p.id === deletedPart.id)
    if (idx === -1) return
    const count = Number(form?.vacation_routes) || parts.length
    const newForm = { ...form }
    for (let k = idx; k < count - 1; k++) {
      newForm[`start_date_${k}`] = form[`start_date_${k + 1}`] ?? ""
      newForm[`end_date_${k}`] = form[`end_date_${k + 1}`] ?? ""
    }
    delete newForm[`start_date_${count - 1}`]
    delete newForm[`end_date_${count - 1}`]
    newForm.vacation_routes = Math.max(0, count - 1)
    if (deletedPart.name === "חריגים") newForm.exceptions = false
    dispatch(staticSlice.updateForm(newForm))
  }

  const handleDeletePartClick = (part) => {
    setBlockers(null)
    setPartToDelete(part)
  }

  const handleCancelDeletePart = () => {
    setPartToDelete(null)
    setBlockers(null)
  }

  const handleConfirmDeletePart = async () => {
    if (!partToDelete) return
    setDeleting(true)
    try {
      const response = await ApiVacations.deleteVacationPart(token, partToDelete.id)
      if (response?.data?.deleted) {
        dispatch(snackBarSlice.setSnackBar({ type: "success", message: "המסלול נמחק בהצלחה", timeout: 4000 }))
        syncFormAfterDelete(partToDelete)
        removePartFromDetails(partToDelete.id)
        setPartToDelete(null)
        setBlockers(null)
      } else if (response?.data?.blockers) {
        // Server refused: the part is still in use. Show who is assigned so the
        // user can reassign them to another route before deleting.
        setBlockers(response.data.blockers)
      } else if (response?.data?.notFound) {
        dispatch(snackBarSlice.setSnackBar({ type: "error", message: "המסלול לא נמצא", timeout: 4000 }))
        syncFormAfterDelete(partToDelete)
        removePartFromDetails(partToDelete.id)
        setPartToDelete(null)
      }
    } catch (error) {
      console.error("Failed to delete vacation part", error)
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מחיקת המסלול נכשלה, נסה שוב", timeout: 4000 }))
    } finally {
      setDeleting(false)
    }
  }


 const handleInputChange = (eventOrValue, fieldName) => {

    if (typeof eventOrValue === "object" && eventOrValue.target) {
      const { name, value } = eventOrValue.target;
      dispatch(staticSlice.updateFormField({ field: name, value }));
    } else {
      dispatch(
        staticSlice.updateFormField({ field: fieldName, value: eventOrValue })
      );
    }
  };

  const submit = async () => {
    try {
      if (isEdit) {
        // Update the EXISTING vacation by its existing id — never addVacation,
        // so no new UUID and no new tenant DB (that was the duplicate bug).
        const payload = {
          vacation_id: form.vacation_id,
          vacation_name: form.vacation_name,
          exceptions: !!form.exceptions,
          // One entry per visible route, aligned with the unified list: existing
          // parts carry their id (updated in place server-side, name preserved),
          // new rows have no id (inserted). Removal is the guarded delete's job.
          parts: Array.from({ length: Number(form?.vacation_routes) || 0 }).map((_, i) => ({
            id: parts[i]?.id ?? null,
            start_date: form[`start_date_${i}`] || "",
            end_date: form[`end_date_${i}`] || "",
          })),
        };
        const response = await ApiVacations.updateVacation(token, payload);
        // Reflect name + refreshed parts (incl. new ids) in the table and this
        // dialog without a manual refresh.
        const freshDetails = response?.data?.details || [];
        const updated = (vacationDetails || []).map((v) =>
          v.vacation_id === form.vacation_id
            ? { ...v, name: form.vacation_name, details: freshDetails }
            : v
        );
        dispatch(vacationSlice.updateVacationDetails(updated));
        dispatch(snackBarSlice.setSnackBar({ type: "success", message: "החופשה עודכנה בהצלחה", timeout: 4000 }));
      } else {
        await ApiVacations.addVacation(token, form);
      }
      dispatch(staticSlice.closeDetailsModal());
    } catch (error) {
      console.error("Failed to save vacation", error);
      dispatch(snackBarSlice.setSnackBar({
        type: "error",
        message: isEdit ? "עדכון החופשה נכשל, נסה שוב" : "הוספת החופשה נכשלה, נסה שוב",
        timeout: 4000,
      }));
    }
  }

  const handleCloseClicked = () => {
    dispatch(staticSlice.resetState());
    dispatch(staticSlice.closeDetailsModal());
  };

  return (
    <VacationsView
      handleInputChange={handleInputChange}
      submit={submit}
      handleCloseClicked={handleCloseClicked}
      parts={parts}
      handleDeletePartClick={handleDeletePartClick}
      partToDelete={partToDelete}
      blockers={blockers}
      deleting={deleting}
      handleConfirmDeletePart={handleConfirmDeletePart}
      handleCancelDeletePart={handleCancelDeletePart}
    />
  );
};

export default Vacation;
