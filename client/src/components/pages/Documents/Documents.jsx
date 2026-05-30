import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import DocumentsView from "./Documents.view";
import ApiDocuments from "../../../apis/documentsRequest";
import { connectSocket } from "../../../utils/socketService";
import * as documentsSlice from "../../../store/slices/documentsSlice";

const Documents = () => {
  const dispatch = useDispatch();
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");
  const familiesStatus = useSelector((state) => state.documentsSlice.familiesStatus);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelFamily, setPanelFamily] = useState(null);

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

  // ── Realtime: refresh on public upload / delete ──────────────────────────
  // The server emits document_uploaded / document_deleted to the 'coordinators'
  // room on every public mutation (mirrors new_registration / new_lead). Refresh
  // the status table so X/Y updates live. connectSocket is idempotent — App.jsx
  // and this component share the one socket singleton.
  useEffect(() => {
    if (!vacationId || !token) return;
    const socket = connectSocket(token);
    if (!socket) return;
    const handler = (payload) => {
      if (String(payload?.vacationId) === String(vacationId)) fetchStatus();
    };
    socket.on("document_uploaded", handler);
    socket.on("document_deleted", handler);
    return () => {
      socket.off("document_uploaded", handler);
      socket.off("document_deleted", handler);
    };
  }, [vacationId, token, fetchStatus]);

  const openPanel = useCallback((row) => {
    setPanelFamily(row);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setPanelFamily(null);
  }, []);

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
      onDocDeleted={handleDocDeleted}
    />
  );
};

export default Documents;
