import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ApiDocuments from "../../../apis/documentsRequest";
import PublicDocumentUploadView from "./PublicDocumentUpload.view";

// Mirrors the server: PDF/JPEG/PNG, 10MB. The server is authoritative (magic
// bytes + size); these are just cheap UX guards.
const MAX_BYTES = 10 * 1024 * 1024;

// Page-level container. Owns the load → 4-digit verify → upload/replace/delete
// flow against the public document endpoints. The verify step returns a short-
// lived JWT (verifyToken) plus the family's members, doc types and already-
// uploaded docs; every mutation carries that token.
const PublicDocumentUpload = () => {
  const { vacationId, docToken } = useParams();

  const [loading, setLoading] = useState(true);
  const [fatal, setFatal] = useState(null);       // { message } unrecoverable
  const [info, setInfo] = useState(null);          // { familyName, headFirstName } (no-leak load)

  // Verify gate
  const [last4, setLast4] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [verifyToken, setVerifyToken] = useState(null);

  // Post-verify page data
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const [busyKey, setBusyKey] = useState(null);    // slot key being mutated (delete)
  const [slotError, setSlotError] = useState(null); // { key, message }

  // Staging: files the head has picked but NOT yet saved. Keyed by slot
  // `${userId}-${docTypeId}` → { file, name, userId, docTypeId, key }. The
  // "שמור" button commits the whole batch at once (handleSave).
  const [staged, setStaged] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── No-leak load ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await ApiDocuments.getPublicPage(vacationId, docToken);
        if (!cancelled) setInfo(res.data);
      } catch (e) {
        if (!cancelled) {
          setFatal({ message: e?.response?.data?.message || "קישור לא תקין או שפג תוקפו" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [vacationId, docToken]);

  const handleLast4Change = useCallback((e) => {
    setLast4(e.target.value.replace(/\D/g, "").slice(0, 4));
    setVerifyError(null);
  }, []);

  // ── 4-digit verify → JWT + page data ───────────────────────────────────────
  const handleVerify = useCallback(async () => {
    if (last4.length !== 4) { setVerifyError("יש להזין בדיוק 4 ספרות"); return; }
    setVerifying(true);
    setVerifyError(null);
    try {
      const res = await ApiDocuments.verifyPublic(vacationId, docToken, last4);
      setVerifyToken(res.data.verifyToken);
      setFamily(res.data.family || null);
      setMembers(res.data.members || []);
      setDocTypes(res.data.docTypes || []);
      setUploadedDocs(res.data.uploadedDocs || []);
    } catch (e) {
      const code = e?.response?.data?.code;
      const message = e?.response?.data?.message;
      if (code === "RATE_LIMITED") {
        setVerifyError(message || "יותר מדי ניסיונות, נסה שוב מאוחר יותר");
      } else if (code === "WRONG_PHONE") {
        setVerifyError("4 הספרות אינן תואמות, נסה שוב");
      } else if (code === "TOKEN_NOT_FOUND" || code === "HEAD_GUEST_NO_PHONE") {
        setFatal({ message: message || "הקישור אינו תקין" });
      } else {
        setVerifyError(message || "אימות נכשל, נסה שוב");
      }
    } finally {
      setVerifying(false);
    }
  }, [last4, vacationId, docToken]);

  // Optimistically reflect a mutation in the uploaded list (server returns only
  // {success}; latest-only means one row per user+type). A fresh upload keeps
  // id=null until the head re-verifies — see note on delete below.
  const upsertUploaded = (userId, docTypeId, patch) => {
    setUploadedDocs((prev) => {
      const idx = prev.findIndex(
        (d) => d.user_id === userId && Number(d.doc_type_id) === Number(docTypeId)
      );
      if (idx === -1) return [...prev, { user_id: userId, doc_type_id: docTypeId, ...patch }];
      const next = prev.slice();
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  // Verify token expired/missing mid-session → bounce back to the gate.
  const bounceToVerify = (msg) => {
    setVerifyToken(null);
    setVerifyError(msg || "האימות פג, אמת שוב כדי להמשיך");
  };

  // Stage a picked file (no upload yet) — used for new slots and "replace".
  const handleStage = useCallback((userId, docTypeId, file, key) => {
    setSlotError(null);
    setSaveSuccess(false);
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setSlotError({ key, message: "הקובץ גדול מדי — עד 10MB" });
      return;
    }
    setStaged((prev) => ({ ...prev, [key]: { file, name: file.name, userId, docTypeId, key } }));
  }, []);

  // Drop a staged (not-yet-saved) file.
  const handleUnstage = useCallback((key) => {
    setStaged((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Preview a STAGED (not-yet-uploaded) file locally — no server call. Opens the
  // selected File via a blob URL in a new tab so the head can confirm it's the
  // right document before saving. Only PDF/JPEG/PNG are stageable, so opening
  // inline is safe. The object URL is revoked after the tab has had time to load.
  const handlePreviewStaged = useCallback((key) => {
    const entry = staged[key];
    if (!entry?.file) return;
    const url = URL.createObjectURL(entry.file);
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }, [staged]);

  // Commit the whole staged batch: upload each file, then fire ONE batched
  // coordinator notification. Saving is "I'm done with this wave" — the head can
  // stage more later and save again. Best-effort notify; never blocks the saves.
  const handleSave = useCallback(async () => {
    const entries = Object.values(staged);
    if (!entries.length) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    setSlotError(null);

    const remaining = { ...staged };
    const savedItems = [];
    let expired = false;
    let failedMsg = null;

    for (const entry of entries) {
      try {
        const fd = new FormData();
        fd.append("file", entry.file);
        fd.append("verifyToken", verifyToken);
        fd.append("user_id", entry.userId);
        fd.append("doc_type_id", entry.docTypeId);
        const res = await ApiDocuments.uploadPublic(vacationId, docToken, fd);
        upsertUploaded(entry.userId, entry.docTypeId, { file_name: entry.name, id: res?.data?.docId ?? null });
        savedItems.push({ userId: entry.userId, docTypeId: entry.docTypeId, replaced: !!res?.data?.replaced });
        delete remaining[entry.key];
      } catch (e) {
        const code = e?.response?.data?.code;
        if (code === "VERIFY_EXPIRED" || code === "VERIFY_REQUIRED") { expired = true; break; }
        failedMsg = e?.response?.data?.message || "השמירה נכשלה, נסה שוב";
        break;
      }
    }

    setStaged(remaining);
    // One detailed notification for whatever committed (best-effort).
    if (savedItems.length) {
      try { await ApiDocuments.notifyPublic(vacationId, docToken, verifyToken, savedItems); }
      catch (e) { /* best-effort — never block the save */ }
    }
    setSaving(false);

    if (expired) { bounceToVerify(); return; }
    if (failedMsg) { setSaveError(failedMsg); return; }
    setSaveSuccess(true);
  }, [staged, verifyToken, vacationId, docToken]);

  // View an uploaded file — presigned URL from the verified-session endpoint
  // (mirrors the coordinator view). Needs the doc id (present once uploaded).
  const handleView = useCallback(async (doc, key) => {
    if (!doc?.id) return;
    setSlotError(null);
    try {
      const res = await ApiDocuments.viewPublic(vacationId, docToken, doc.id, verifyToken);
      const url = res?.data?.url;
      if (url) window.open(url, "_blank", "noopener");
    } catch (e) {
      const code = e?.response?.data?.code;
      if (code === "VERIFY_EXPIRED" || code === "VERIFY_REQUIRED") {
        bounceToVerify();
      } else {
        setSlotError({ key, message: "פתיחת הקובץ נכשלה" });
      }
    }
  }, [vacationId, docToken, verifyToken]);

  const handleDelete = useCallback(async (doc, key) => {
    // Public delete is by family_documents id, which we only have from the
    // verify snapshot. A just-uploaded (this-session) slot has no id yet — the
    // view offers "replace" (overwrite) for those instead of delete.
    if (!doc?.id) return;
    setSlotError(null);
    setBusyKey(key);
    try {
      await ApiDocuments.deletePublic(vacationId, docToken, doc.id, verifyToken);
      setUploadedDocs((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (e) {
      const code = e?.response?.data?.code;
      const message = e?.response?.data?.message;
      if (code === "VERIFY_EXPIRED" || code === "VERIFY_REQUIRED") {
        bounceToVerify();
      } else {
        setSlotError({ key, message: message || "המחיקה נכשלה" });
      }
    } finally {
      setBusyKey(null);
    }
  }, [vacationId, docToken, verifyToken]);

  return (
    <PublicDocumentUploadView
      loading={loading}
      fatal={fatal}
      info={info}
      last4={last4}
      verifying={verifying}
      verifyError={verifyError}
      verified={!!verifyToken}
      onLast4Change={handleLast4Change}
      onVerify={handleVerify}
      family={family}
      members={members}
      docTypes={docTypes}
      uploadedDocs={uploadedDocs}
      staged={staged}
      saving={saving}
      saveError={saveError}
      saveSuccess={saveSuccess}
      busyKey={busyKey}
      slotError={slotError}
      onStage={handleStage}
      onUnstage={handleUnstage}
      onPreviewStaged={handlePreviewStaged}
      onSave={handleSave}
      onView={handleView}
      onDelete={handleDelete}
    />
  );
};

export default PublicDocumentUpload;
