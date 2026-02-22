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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.full_name.trim()) return;
    setLoading(true);
    try {
      await ApiLeads.submitPublic(vacationId, form);
      setSubmitted(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLeadFormView
      form={form}
      loading={loading}
      submitted={submitted}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default PublicLeadForm;
