import React, { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useStyles } from "../Documents.style";
import ApiDocuments from "../../../../apis/documentsRequest";
import ApiUser from "../../../../apis/userRequest";
import ShareDocumentDialog from "../ShareDocumentDialog/ShareDocumentDialog";

const SIGNED_REGISTRATION_KEY = "signed_registration";
const FLIGHT_TICKET_KEY = "flight_ticket";

const fullName = (g) => `${g.hebrew_first_name || ""} ${g.hebrew_last_name || ""}`.trim();
const isIndependent = (g) => Number(g.flying_with_us) === 0;

// Coordinator drawer: shows the full required-slot matrix per guest (passport
// for everyone; flight ticket only for independent fliers — flying_with_us=0;
// signed registration as a family-level row), each slot green/missing with
// view / download / share / delete on the uploaded ones. Deletes are full
// wipes, so they go through a confirmation dialog.
function DocumentsDetailPanel({ open, onClose, family, vacationId, token, onDocDeleted }) {
  const classes = useStyles();
  const [guests, setGuests] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareDialog, setShareDialog] = useState({ open: false, docId: null });
  // Destructive full wipe → confirm first. { doc } when open.
  const [confirm, setConfirm] = useState({ open: false, doc: null });

  const fetchAll = useCallback(async () => {
    if (!family?.family_id || !vacationId) return;
    setLoading(true);
    try {
      const [docsRes, guestsRes, typesRes] = await Promise.all([
        ApiDocuments.getFamilyDocuments(token, vacationId, family.family_id),
        ApiUser.getUserFamilyList(token, family.family_id, vacationId),
        ApiDocuments.getDocumentTypes(token, vacationId),
      ]);
      setDocs(docsRes.data || []);
      setGuests(guestsRes.data || []);
      setDocTypes(typesRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [family?.family_id, vacationId, token]);

  useEffect(() => {
    if (open) fetchAll();
  }, [open, fetchAll]);

  const handleConfirmDelete = async () => {
    const doc = confirm.doc;
    setConfirm({ open: false, doc: null });
    if (!doc) return;
    try {
      await ApiDocuments.deleteDocument(token, vacationId, doc.id);
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
      if (onDocDeleted) onDocDeleted();
    } catch (e) {
      console.error(e);
    }
  };

  // Both use a presigned URL opened in a new tab; "view" requests inline
  // disposition (renders in the tab — safe, content-type is always PDF/JPEG/PNG)
  // while "download" uses the default attachment disposition (saves a copy).
  const openPresigned = async (docId, { inline = false } = {}) => {
    try {
      const res = await ApiDocuments.getDownloadUrl(token, vacationId, docId, { inline });
      const url = res?.data?.url;
      if (url) window.open(url, "_blank", "noopener");
    } catch (e) {
      console.error(e);
    }
  };

  // Uploaded doc lookup by (user_id, doc_type_id).
  const uploadedMap = new Map();
  docs.forEach((d) => uploadedMap.set(`${d.user_id}-${Number(d.doc_type_id)}`, d));

  // Required, per-guest types (matches the server X/Y rule): every required type
  // except the family-level signed registration; flight_ticket only for
  // independent fliers (flying_with_us=0).
  const perGuestTypes = docTypes.filter(
    (t) => t.type_key !== SIGNED_REGISTRATION_KEY && Number(t.is_required) === 1
  );
  const slotsFor = (g) =>
    perGuestTypes.filter((t) => t.type_key !== FLIGHT_TICKET_KEY || isIndependent(g));

  // Family-level signed registration (one per family).
  const signedType = docTypes.find((t) => t.type_key === SIGNED_REGISTRATION_KEY);
  const signedDoc = docs.find((d) => d.type_key === SIGNED_REGISTRATION_KEY);

  const ActionIcons = ({ doc }) => (
    <div className={classes.slotState}>
      <Tooltip title="צפייה">
        <IconButton size="small" onClick={() => openPresigned(doc.id, { inline: true })}>
          <VisibilityIcon style={{ fontSize: "18px", color: "#0d9488" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="הורדה">
        <IconButton size="small" onClick={() => openPresigned(doc.id)}>
          <DownloadIcon style={{ fontSize: "18px", color: "#0d9488" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="שיתוף">
        <IconButton size="small" onClick={() => setShareDialog({ open: true, docId: doc.id })}>
          <ShareIcon style={{ fontSize: "18px", color: "#0d9488" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="מחיקה">
        <IconButton size="small" onClick={() => setConfirm({ open: true, doc })}>
          <DeleteOutlineIcon style={{ fontSize: "18px", color: "#ef4444" }} />
        </IconButton>
      </Tooltip>
    </div>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.drawerPaper }}
    >
      <div className={classes.drawerHeader}>
        <Typography className={classes.drawerTitle}>
          {family?.family_name || "מסמכים"}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon style={{ fontSize: "18px" }} />
        </IconButton>
      </div>

      <div className={classes.drawerBody}>
        {loading ? (
          <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
        ) : (
          <>
            {/* Family-level: signed registration form */}
            <Typography className={classes.sectionHeading}>טופס רישום חתום</Typography>
            <div className={classes.docItem}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <AssignmentTurnedInOutlinedIcon style={{ fontSize: "20px", color: signedDoc ? "#0d9488" : "#cbd5e1" }} />
                <div className={classes.docItemInfo}>
                  <Typography className={classes.docItemLabel}>
                    {signedType?.label || "טופס רישום חתום"}
                  </Typography>
                  {signedDoc
                    ? <Typography className={classes.docItemMeta}>{signedDoc.file_name}</Typography>
                    : <Typography className={classes.missingText}>טרם נחתם</Typography>}
                </div>
              </div>
              {signedDoc && <ActionIcons doc={signedDoc} />}
            </div>

            {/* Per-guest required slots */}
            {guests.map((g) => {
              const slots = slotsFor(g);
              const done = slots.filter((t) => uploadedMap.has(`${g.user_id}-${t.id}`)).length;
              return (
                <div key={g.user_id}>
                  <div className={classes.guestGroupHeader}>
                    <PersonOutlineIcon style={{ fontSize: "18px", color: "#0d9488" }} />
                    <Typography className={classes.guestGroupName}>{fullName(g) || "אורח"}</Typography>
                    <Typography style={{ fontSize: "12px", color: "#94a3b8", marginRight: "auto" }}>
                      {done}/{slots.length}
                    </Typography>
                  </div>
                  {slots.map((t) => {
                    const doc = uploadedMap.get(`${g.user_id}-${t.id}`);
                    return (
                      <div key={t.id} className={classes.docItem}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                          {doc
                            ? <CheckCircleIcon style={{ fontSize: "18px", color: "#22c55e" }} />
                            : <RadioButtonUncheckedIcon style={{ fontSize: "18px", color: "#cbd5e1" }} />}
                          <div className={classes.docItemInfo}>
                            <Typography className={classes.docItemLabel}>{t.label}</Typography>
                            {doc
                              ? <Typography className={classes.docItemMeta}>{doc.file_name}</Typography>
                              : <Typography className={classes.missingText}>חסר</Typography>}
                          </div>
                        </div>
                        {doc && <ActionIcons doc={doc} />}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}
      </div>

      <ShareDocumentDialog
        open={shareDialog.open}
        onClose={() => setShareDialog({ open: false, docId: null })}
        docId={shareDialog.docId}
        vacationId={vacationId}
        token={token}
      />

      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, doc: null })} dir="rtl">
        <DialogTitle>מחיקת מסמך</DialogTitle>
        <DialogContent>
          <DialogContentText>
            פעולה זו תמחק את המסמך לצמיתות (כולל הקובץ עצמו). לא ניתן לשחזר. להמשיך?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, doc: null })}>ביטול</Button>
          <Button onClick={handleConfirmDelete} sx={{ color: "#ef4444" }}>מחק</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

export default DocumentsDetailPanel;
