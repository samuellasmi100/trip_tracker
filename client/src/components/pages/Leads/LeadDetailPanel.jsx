import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LeadDetailPanelView from "./LeadDetailPanel.view";
import * as leadsSlice from "../../../store/slices/leadsSlice";
import * as snackBarSlice from "../../../store/slices/snackbarSlice";
import ApiLeads from "../../../apis/leadsRequest";
import { toLocalYMD, todayLocalYMD } from "../../../utils/helpers/formatDate";
import { STATUS_CONFIG } from "./Leads.style";

// Drawer-style detail panel for fast lead updates: status pills, follow-up /
// last-contact dates, inline note add+history, and a read-only details strip.
// Heavy edits go through the existing full edit form via onOpenFullEdit.
const LeadDetailPanel = ({ selectedLeadId, onClose, onOpenFullEdit, onDelete }) => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((s) => s.vacationSlice.vacationId);
  const leads = useSelector((s) => s.leadsSlice.leads);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Re-derive the live lead from the slice so any list refresh (status pill,
  // date change, full-edit save) is reflected immediately in the panel.
  const lead = useMemo(
    () => leads?.find((l) => l.lead_id === selectedLeadId) || null,
    [leads, selectedLeadId]
  );

  const today = todayLocalYMD();
  const followupOverdue =
    !!lead?.followup_date &&
    Number(lead.is_active) === 1 &&
    toLocalYMD(lead.followup_date) <= today;

  const persist = async (patch, successMessage) => {
    if (!lead) return;
    try {
      const response = await ApiLeads.update(token, vacationId, lead.lead_id, patch);
      dispatch(leadsSlice.updateLeadsList(response.data));
      if (successMessage) {
        dispatch(snackBarSlice.setSnackBar({
          type: "success",
          message: successMessage,
          timeout: 3000,
        }));
      }
    } catch (error) {
      console.log(error);
      dispatch(snackBarSlice.setSnackBar({
        type: "error",
        message: "עדכון הליד נכשל, נסה שוב",
        timeout: 4000,
      }));
    }
  };

  const handleStatusChange = (newStatus) =>
    persist({ status: newStatus }, `הסטטוס עודכן ל"${STATUS_CONFIG[newStatus]?.label || newStatus}"`);

  // Empty-string from a cleared date input maps to null on the server via
  // NULLABLE_ON_BLANK in leadsDb.update — safe.
  const handleDateChange = (field, value) => persist({ [field]: value }, "הפולואפ נשמר");

  // "Mark as handled": clear the follow-up so the lead leaves the due-count
  // badge. Same persist path → updateLeadsList recomputes the count immediately.
  const handleMarkHandled = () => persist({ followup_date: null }, "הפולואפ סומן כטופל");

  return (
    <LeadDetailPanelView
      open={!!selectedLeadId && !!lead}
      lead={lead}
      vacationId={vacationId}
      onClose={onClose}
      onStatusChange={handleStatusChange}
      onDateChange={handleDateChange}
      onMarkHandled={handleMarkHandled}
      onOpenFullEdit={() => lead && onOpenFullEdit(lead)}
      followupOverdue={followupOverdue}
      confirmDeleteOpen={confirmDeleteOpen}
      onRequestDelete={() => setConfirmDeleteOpen(true)}
      onCancelDelete={() => setConfirmDeleteOpen(false)}
      onConfirmDelete={async () => {
        setConfirmDeleteOpen(false);
        if (lead) await onDelete(lead);
      }}
    />
  );
};

export default LeadDetailPanel;
