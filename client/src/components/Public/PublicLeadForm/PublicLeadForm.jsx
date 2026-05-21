import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PublicLeadFormView from "./PublicLeadForm.view";
import ApiLeads from "../../../apis/leadsRequest";

const PublicLeadForm = () => {
  const { vacationId } = useParams();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    family_size: 1,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (!form.full_name.trim()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await ApiLeads.submitPublic(vacationId, form);
      setSubmitted(true);
    } catch (error) {
      console.log(error);
      // No Redux/snackbar on public route — surface inline so the prospect knows.
      setErrorMessage("שליחת הטופס נכשלה, נסה שוב מאוחר יותר");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLeadFormView
      form={form}
      loading={loading}
      submitted={submitted}
      errorMessage={errorMessage}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default PublicLeadForm;
