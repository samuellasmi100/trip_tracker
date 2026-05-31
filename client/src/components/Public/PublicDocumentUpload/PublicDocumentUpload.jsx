import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ApiDocuments from "../../../apis/documentsRequest";
import PublicDocumentUploadView from "./PublicDocumentUpload.view";

// Mirrors the server: PDF/JPEG/PNG, 10MB. The server is authoritative (magic
// bytes + size); these are just cheap UX guards.
const MAX_BYTES = 10 * 1024 * 1024;

// In-browser image compression so large phone photos (modern iPhone passport/
// ticket shots run 10–15MB) shrink under the per-file limit while staying
// legible. Canvas-based, no dependency — same "plain canvas, no library"
// approach as the registration signature pad. We downscale to a max edge and
// re-encode in the SAME mime type, so the result is still a real JPEG/PNG that
// passes the server's magic-byte check. PDFs / non-images pass through
// untouched. Always resolves (never rejects) — on any hiccup it returns the
// original file so staging is never blocked; the per-file size check is the
// safety net after this.
const IMAGE_MAX_DIMENSION = 2400; // px on the longest edge — keeps passport/ticket text crisp
const IMAGE_JPEG_QUALITY = 0.85;  // legible, but a big size win on phone JPEGs

const compressImageFile = (file) =>
  new Promise((resolve) => {
    if (!file || !/^image\/(jpeg|png)$/.test(file.type)) { resolve(file); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      // White matte so a transparent PNG never flattens to black.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const quality = file.type === "image/jpeg" ? IMAGE_JPEG_QUALITY : undefined;
      canvas.toBlob((blob) => {
        // Keep the original if re-encoding didn't actually help (e.g. an already
        // small PNG) or produced nothing.
        if (!blob || blob.size >= file.size) { resolve(file); return; }
        resolve(new File([blob], file.name, { type: blob.type }));
      }, file.type, quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });

// Page-level container. Owns the load → 4-digit verify → upload/replace/delete
// flow against the public document endpoints. The verify step returns a short-
// lived JWT (verifyToken) plus the family's members, doc types and already-
// uploaded docs; every mutation carries that token.
const PublicDocumentUpload = () => {
  const { vacationId, docToken } = useParams();
  // Optional surname filter (?group=<hebrew_last_name>). When present, the page
  // renders only the guests whose surname matches this subgroup — a forwarding
  // convenience for families that fold several surnames under one family_id.
  // Verification, uploads and the coordinator-side X/Y stay family-level; this
  // only narrows what THIS page shows. Absent/blank → show the whole family.
  const [searchParams] = useSearchParams();
  const group = (searchParams.get("group") || "").trim();
  // split=1 marks the "one link containing links" mode: after the head verifies,
  // his page shows a per-surname forward-link panel (built below) so HE hands each
  // subgroup its own ?group= link. Absent → the normal single-page upload screen.
  const splitMode = searchParams.get("split") === "1";

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
  const [copiedForward, setCopiedForward] = useState(null); // surname just copied
  // Split mode: head's grid defaults to his OWN subgroup; this reveals everyone.
  const [showAllGuests, setShowAllGuests] = useState(false);

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
  // Images are compressed in-browser first (PDFs pass through); the slot shows
  // its spinner while re-encoding so a big photo doesn't feel frozen.
  const handleStage = useCallback(async (userId, docTypeId, file, key) => {
    setSlotError(null);
    setSaveSuccess(false);
    if (!file) return;
    setBusyKey(key);
    let prepared = file;
    try {
      prepared = await compressImageFile(file);
    } finally {
      setBusyKey(null);
    }
    // Safety net: the per-file limit still applies — now to the COMPRESSED result.
    if (prepared.size > MAX_BYTES) {
      setSlotError({ key, message: "הקובץ גדול מדי — עד 10MB" });
      return;
    }
    setStaged((prev) => ({ ...prev, [key]: { file: prepared, name: prepared.name, userId, docTypeId, key } }));
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

  // The head's own surname, taken from the authoritative is_main_user member
  // (the verify payload now includes is_main_user). A verified session always
  // has an is_main_user head — getFamilyByToken resolves the head's phone from
  // that same flag — so this is reliably populated.
  const headSurname = useMemo(() => {
    const head = members.find((m) => Number(m.is_main_user) === 1);
    return (head?.hebrew_last_name || "").trim();
  }, [members]);

  // Distinct surnames in the full family. Split mode "engages" only when the
  // family actually spans more than one — otherwise no toggle, no forward panel.
  const splitActive = useMemo(() => {
    if (!splitMode) return false;
    const set = new Set();
    members.forEach((m) => {
      const s = (m.hebrew_last_name || "").trim();
      if (s) set.add(s);
    });
    return set.size > 1;
  }, [splitMode, members]);

  // What the upload grid renders:
  //  • ?group filter (recipient's own filtered link) → just that surname.
  //  • split mode, default → the head's OWN subgroup (the files HE must upload).
  //  • split mode + "show all" toggle, or normal mode → the whole family.
  // The full `members` list still backs server-side membership checks regardless.
  const visibleMembers = useMemo(() => {
    if (group) return members.filter((m) => (m.hebrew_last_name || "").trim() === group);
    if (splitActive && !showAllGuests && headSurname) {
      const own = members.filter((m) => (m.hebrew_last_name || "").trim() === headSurname);
      if (own.length) return own; // guard: never strand the head with an empty grid
    }
    return members;
  }, [members, group, splitActive, showAllGuests, headSurname]);

  // Split mode only: one forward link per OTHER surname (same doc link +
  // ?group=<surname>) — the head's own subgroup is excluded (no point forwarding
  // a link to himself). The head copies or WhatsApp-shares each to the right
  // people — no preset number, he picks the recipient.
  const forwardLinks = useMemo(() => {
    if (!splitActive) return [];
    const counts = new Map();
    members.forEach((m) => {
      const surname = (m.hebrew_last_name || "").trim();
      if (!surname) return;
      counts.set(surname, (counts.get(surname) || 0) + 1);
    });
    const base = `${window.location.origin}/public/documents/${vacationId}/${docToken}`;
    return [...counts.entries()]
      .filter(([surname]) => surname !== headSurname) // exclude the head's own subgroup
      .map(([surname, count]) => {
        const sgLink = `${base}?group=${encodeURIComponent(surname)}`;
        const body =
          `קישור להעלאת מסמכים עבור משפחת ${surname} (${count} נופשים):\n` +
          `\n` +
          `${sgLink}\n`;
        return {
          surname,
          count,
          link: sgLink,
          whatsappHref: `https://wa.me/?text=${encodeURIComponent(body)}`,
        };
      })
      .sort((a, b) => b.count - a.count || a.surname.localeCompare(b.surname, "he"));
  }, [splitActive, members, vacationId, docToken, headSurname]);

  const handleCopyForward = useCallback(async (surname, sgLink) => {
    try {
      await navigator.clipboard.writeText(sgLink);
      setCopiedForward(surname);
      setTimeout(() => setCopiedForward(null), 2200);
    } catch (e) {
      console.warn("clipboard write failed:", e);
    }
  }, []);

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
      members={visibleMembers}
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
      forwardLinks={forwardLinks}
      copiedForward={copiedForward}
      onCopyForward={handleCopyForward}
      splitActive={splitActive}
      showAllGuests={showAllGuests}
      onToggleShowAll={setShowAllGuests}
    />
  );
};

export default PublicDocumentUpload;
