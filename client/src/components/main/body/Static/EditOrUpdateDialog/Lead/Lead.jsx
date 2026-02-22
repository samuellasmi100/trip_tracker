import React, { useState } from "react";
import LeadView from "./Lead.view";
import { useSelector, useDispatch } from "react-redux";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import * as leadsSlice from "../../../../../../store/slice/leadsSlice";
import ApiLeads from "../../../../../../apis/leadsRequest";

const Lead = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.staticSlice.form);
  const dialogType = useSelector((state) => state.staticSlice.detailsModalType);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");

  const isEdit = dialogType === "editLead";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(staticSlice.updateFormField({ field: name, value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    dispatch(staticSlice.updateFormField({ field: name, value }));
  };

  const submit = async () => {
    if (!form.full_name?.trim()) return;
    try {
      let response;
      if (isEdit) {
        response = await ApiLeads.update(token, vacationId, form.lead_id, form);
      } else {
        response = await ApiLeads.create(token, vacationId, form);
      }
      dispatch(leadsSlice.updateLeadsList(response.data));
      dispatch(staticSlice.resetState());
      dispatch(staticSlice.closeDetailsModal());
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseClicked = () => {
    dispatch(staticSlice.resetState());
    dispatch(staticSlice.closeDetailsModal());
  };

  return (
    <LeadView
      form={form}
      isEdit={isEdit}
      handleInputChange={handleInputChange}
      handleSelectChange={handleSelectChange}
      submit={submit}
      handleCloseClicked={handleCloseClicked}
    />
  );
};

export default Lead;
