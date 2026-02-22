import React, { useEffect, useState } from "react";
import LeadsView from "./Leads.view";
import LeadNotesDialog from "./LeadNotesDialog";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import { useDispatch, useSelector } from "react-redux";
import * as leadsSlice from "../../../../../../store/slice/leadsSlice";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import ApiLeads from "../../../../../../apis/leadsRequest";

const Leads = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const leads = useSelector((state) => state.leadsSlice.leads);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [notesLead, setNotesLead] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);

  const getAllLeads = async () => {
    try {
      const response = await ApiLeads.getAll(token, vacationId);
      dispatch(leadsSlice.updateLeadsList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllLeads();
  }, [vacationId]);

  const filteredLeads = leads?.filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      lead.full_name?.includes(searchTerm) ||
      lead.phone?.includes(searchTerm);
    const matchesStatus =
      selectedStatus === "all" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddClick = () => {
    dispatch(staticSlice.updateForm({ status: "new_interest", source: "phone" }));
    dispatch(staticSlice.updateDetailsModalType("addLead"));
    dispatch(staticSlice.openDetailsModal());
  };

  const handleEditClick = (lead) => {
    dispatch(staticSlice.updateForm(lead));
    dispatch(staticSlice.updateDetailsModalType("editLead"));
    dispatch(staticSlice.openDetailsModal());
  };

  const handleNotesClick = (lead) => {
    setNotesLead(lead);
    setNotesOpen(true);
  };

  const handleDeleteClick = async (lead) => {
    if (!window.confirm(`האם למחוק את הליד "${lead.full_name}"?`)) return;
    try {
      const response = await ApiLeads.deleteLead(token, vacationId, lead.lead_id);
      dispatch(leadsSlice.updateLeadsList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  return (
    <>
      <LeadsView
        filteredLeads={filteredLeads}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleAddClick={handleAddClick}
        handleEditClick={handleEditClick}
        handleNotesClick={handleNotesClick}
        handleDeleteClick={handleDeleteClick}
      />

      <EditOrUpdateDialog
        detailsDialogOpen={detailsDialogOpen}
        closeDetailsModal={closeDetailsModal}
      />

      <LeadNotesDialog
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        lead={notesLead}
        vacationId={vacationId}
      />
    </>
  );
};

export default Leads;
