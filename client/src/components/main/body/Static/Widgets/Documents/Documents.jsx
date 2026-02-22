import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import DocumentsView from "./Documents.view";
import ApiDocuments from "../../../../../../apis/documentsRequest";
import * as documentsSlice from "../../../../../../store/slice/documentsSlice";

const Documents = () => {
  const dispatch = useDispatch();
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");
  const familiesStatus = useSelector((state) => state.documentsSlice.familiesStatus);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelFamily, setPanelFamily] = useState(null);
  const [copiedFamilyId, setCopiedFamilyId] = useState(null);

  const fetchStatus = useCallback(async () => {
    if (!vacationId) return;
    try {
      const res = await ApiDocuments.getAllFamiliesStatus(token, vacationId);
      dispatch(documentsSlice.setFamiliesStatus(res.data || []));
    } catch (e) {
      console.error(e);
    }
  }, [vacationId, token, dispatch]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const openPanel = useCallback((row) => {
    setPanelFamily(row);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setPanelFamily(null);
  }, []);

  const handleCopyLink = useCallback(async (familyId) => {
    try {
      const res = await ApiDocuments.getFamilyLink(token, vacationId, familyId);
      const docToken = res.data?.docToken;
      if (!docToken) return;
      const url = `${window.location.origin}/public/documents/${vacationId}/${docToken}`;
      await navigator.clipboard.writeText(url);
      setCopiedFamilyId(familyId);
      setTimeout(() => setCopiedFamilyId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  }, [token, vacationId]);

  const handleDocDeleted = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <DocumentsView
      familiesStatus={familiesStatus}
      vacationId={vacationId}
      token={token}
      panelOpen={panelOpen}
      panelFamily={panelFamily}
      openPanel={openPanel}
      closePanel={closePanel}
      copiedFamilyId={copiedFamilyId}
      onCopyLink={handleCopyLink}
      onDocDeleted={handleDocDeleted}
    />
  );
};

export default Documents;
