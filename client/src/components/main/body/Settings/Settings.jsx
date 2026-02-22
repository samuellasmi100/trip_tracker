import React, { useState, useEffect, useCallback } from "react";
import SettingsView from "./Settings.view";
import { useSelector } from "react-redux";
import ApiDocuments from "../../../../apis/documentsRequest";
import ApiSettings from "../../../../apis/settingsRequest";
import ApiPayments from "../../../../apis/paymentsRequest";

const EMPTY_PROVIDER_CONFIG = {
  terminalNumber: "",
  apiName: "",
  businessName: "",
  vatNumber: "",
  invoiceDocType: "Receipt",
  businessType: "exempt_dealer",
  invoiceEmailEnabled: false,
  invoiceNotes: "",
  isTestMode: true,
};

const Settings = () => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const vacationName = useSelector((state) => state.vacationSlice.vacationName);
  const token = sessionStorage.getItem("token");

  const [copied, setCopied] = useState(false);

  // Agreement text state
  const [agreementText, setAgreementText] = useState("");
  const [savingAgreement, setSavingAgreement] = useState(false);
  const [agreementSaved, setAgreementSaved] = useState(false);

  // Document types state
  const [docTypes, setDocTypes] = useState([]);
  const [newDocLabel, setNewDocLabel] = useState("");
  const [addingDocType, setAddingDocType] = useState(false);

  // Flight companies state
  const [flightCompanies, setFlightCompanies] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [addingCompany, setAddingCompany] = useState(false);

  // Payment provider config state
  const [providerConfig, setProviderConfig] = useState(EMPTY_PROVIDER_CONFIG);
  const [savingProvider, setSavingProvider] = useState(false);
  const [providerSaved, setProviderSaved] = useState(false);

  const publicUrl = vacationId
    ? `${window.location.origin}/public/leads/${vacationId}`
    : "";

  const handleCopy = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleOpenForm = () => {
    if (!publicUrl) return;
    window.open(publicUrl, "_blank");
  };

  const fetchAgreement = useCallback(async () => {
    if (!vacationId) return;
    try {
      const res = await ApiSettings.getAgreement(token, vacationId);
      setAgreementText(res.data?.agreement_text || "");
    } catch (e) {
      console.error(e);
    }
  }, [vacationId, token]);

  useEffect(() => {
    fetchAgreement();
  }, [fetchAgreement]);

  const handleAgreementSave = async () => {
    if (!vacationId) return;
    setSavingAgreement(true);
    try {
      await ApiSettings.updateAgreement(token, vacationId, agreementText);
      setAgreementSaved(true);
      setTimeout(() => setAgreementSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingAgreement(false);
    }
  };

  const fetchDocTypes = useCallback(async () => {
    if (!vacationId) return;
    try {
      const res = await ApiDocuments.getDocumentTypes(token, vacationId);
      setDocTypes(res.data || []);
    } catch (e) {
      console.error(e);
    }
  }, [vacationId, token]);

  useEffect(() => {
    fetchDocTypes();
  }, [fetchDocTypes]);

  const handleAddDocType = async () => {
    if (!newDocLabel.trim() || !vacationId) return;
    setAddingDocType(true);
    try {
      await ApiDocuments.addDocumentType(token, vacationId, { label: newDocLabel.trim() });
      setNewDocLabel("");
      await fetchDocTypes();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingDocType(false);
    }
  };

  const handleDeleteDocType = async (typeId) => {
    try {
      await ApiDocuments.deleteDocumentType(token, vacationId, typeId);
      setDocTypes((prev) => prev.filter((dt) => dt.id !== typeId));
    } catch (e) {
      console.error(e);
    }
  };

  // ── Flight companies ──────────────────────────────────────────────────────

  const fetchFlightCompanies = useCallback(async () => {
    try {
      const res = await ApiSettings.getFlightCompanies(token);
      setFlightCompanies(res.data || []);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  useEffect(() => {
    fetchFlightCompanies();
  }, [fetchFlightCompanies]);

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) return;
    setAddingCompany(true);
    try {
      await ApiSettings.addFlightCompany(token, { name: newCompanyName.trim() });
      setNewCompanyName("");
      await fetchFlightCompanies();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingCompany(false);
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      await ApiSettings.deleteFlightCompany(token, id);
      setFlightCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // ── Payment provider ───────────────────────────────────────────────────────

  const fetchProviderConfig = useCallback(async () => {
    try {
      const res = await ApiPayments.getProviderConfig(token);
      if (res.data) {
        setProviderConfig({
          terminalNumber: res.data.terminal_number || "",
          apiName: res.data.api_name || "",
          businessName: res.data.business_name || "",
          vatNumber: res.data.vat_number || "",
          invoiceDocType: res.data.invoice_doc_type || "Receipt",
          businessType: res.data.business_type || "exempt_dealer",
          invoiceEmailEnabled: Boolean(res.data.invoice_email_enabled),
          invoiceNotes: res.data.invoice_notes || "",
          isTestMode: Boolean(res.data.is_test_mode),
        });
      }
    } catch (e) {
      // Config may not exist yet — silently ignore
    }
  }, [token]);

  useEffect(() => {
    fetchProviderConfig();
  }, [fetchProviderConfig]);

  const handleProviderFieldChange = (field, value) => {
    setProviderConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProvider = async () => {
    setSavingProvider(true);
    try {
      await ApiPayments.saveProviderConfig(token, providerConfig);
      setProviderSaved(true);
      setTimeout(() => setProviderSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProvider(false);
    }
  };

  return (
    <SettingsView
      publicUrl={publicUrl}
      vacationName={vacationName}
      copied={copied}
      handleCopy={handleCopy}
      handleOpenForm={handleOpenForm}
      docTypes={docTypes}
      newDocLabel={newDocLabel}
      setNewDocLabel={setNewDocLabel}
      addingDocType={addingDocType}
      handleAddDocType={handleAddDocType}
      handleDeleteDocType={handleDeleteDocType}
      vacationId={vacationId}
      agreementText={agreementText}
      setAgreementText={setAgreementText}
      savingAgreement={savingAgreement}
      agreementSaved={agreementSaved}
      handleAgreementSave={handleAgreementSave}
      flightCompanies={flightCompanies}
      newCompanyName={newCompanyName}
      setNewCompanyName={setNewCompanyName}
      addingCompany={addingCompany}
      handleAddCompany={handleAddCompany}
      handleDeleteCompany={handleDeleteCompany}
      providerConfig={providerConfig}
      onProviderFieldChange={handleProviderFieldChange}
      savingProvider={savingProvider}
      providerSaved={providerSaved}
      handleSaveProvider={handleSaveProvider}
    />
  );
};

export default Settings;
