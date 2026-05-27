import React, { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { useStyles } from "../Documents.style";
import ApiDocuments from "../../../../apis/documentsRequest";
import ShareDocumentDialog from "../ShareDocumentDialog/ShareDocumentDialog";

function DocumentsDetailPanel({ open, onClose, family, vacationId, token, onDocDeleted }) {
  const classes = useStyles();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  // Share dialog state — only opens for signed_registration rows.
  const [shareDialog, setShareDialog] = useState({ open: false, docId: null });

  const fetchDocs = useCallback(async () => {
    if (!family?.family_id || !vacationId) return;
    setLoading(true);
    try {
      const res = await ApiDocuments.getFamilyDocuments(token, vacationId, family.family_id);
      setDocs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [family?.family_id, vacationId, token]);

  useEffect(() => {
    if (open) fetchDocs();
  }, [open, fetchDocs]);

  const handleDelete = async (docId) => {
    try {
      await ApiDocuments.deleteDocument(token, vacationId, docId);
      setDocs((prev) => prev.filter((d) => d.id !== docId));
      if (onDocDeleted) onDocDeleted();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = async (docId) => {
    try {
      const res = await ApiDocuments.getDownloadUrl(token, vacationId, docId);
      const url = res?.data?.url;
      if (url) window.open(url, "_blank", "noopener");
    } catch (e) {
      console.error(e);
    }
  };

  // Signed registrations are top-level (one per family, not per-guest), so
  // pull them out of the per-user grouping into their own section above.
  const registrationDocs = docs.filter((d) => d.type_key === "signed_registration");
  const otherDocs        = docs.filter((d) => d.type_key !== "signed_registration");
  const grouped = {};
  otherDocs.forEach((d) => {
    if (!grouped[d.user_id]) grouped[d.user_id] = { user_id: d.user_id, docs: [] };
    grouped[d.user_id].docs.push(d);
  });

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
        ) : docs.length === 0 ? (
          <Typography style={{ color: "#94a3b8", fontSize: "14px", marginTop: "24px", textAlign: "center" }}>
            אין מסמכים שהועלו
          </Typography>
        ) : (
          <>
            {registrationDocs.length > 0 && (
              <div>
                <Typography className={classes.sectionHeading}>טופס הרשמה חתום</Typography>
                {registrationDocs.map((doc) => (
                  <div key={doc.id} className={classes.docItem}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <AssignmentTurnedInOutlinedIcon style={{ fontSize: "20px", color: "#0d9488" }} />
                      <div className={classes.docItemInfo}>
                        <Typography className={classes.docItemLabel}>{doc.label || "טופס הרשמה חתום"}</Typography>
                        <Typography className={classes.docItemMeta}>{doc.file_name}</Typography>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      <Tooltip title="הורד PDF">
                        <IconButton size="small" onClick={() => handleDownload(doc.id)}>
                          <DownloadIcon style={{ fontSize: "18px", color: "#0d9488" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="שיתוף">
                        <IconButton size="small" onClick={() => setShareDialog({ open: true, docId: doc.id })}>
                          <ShareIcon style={{ fontSize: "18px", color: "#0d9488" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחק מסמך">
                        <IconButton size="small" onClick={() => handleDelete(doc.id)}>
                          <DeleteOutlineIcon style={{ fontSize: "18px", color: "#ef4444" }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {Object.values(grouped).map((group) => (
              <div key={group.user_id}>
                <Typography className={classes.sectionHeading}>{group.user_id}</Typography>
                {group.docs.map((doc) => (
                  <div key={doc.id} className={classes.docItem}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <DescriptionIcon style={{ fontSize: "18px", color: "#0d9488" }} />
                      <div className={classes.docItemInfo}>
                        <Typography className={classes.docItemLabel}>{doc.label || doc.file_name}</Typography>
                        <Typography className={classes.docItemMeta}>{doc.file_name}</Typography>
                      </div>
                    </div>
                    <Tooltip title="מחק מסמך">
                      <IconButton size="small" onClick={() => handleDelete(doc.id)}>
                        <DeleteOutlineIcon style={{ fontSize: "18px", color: "#ef4444" }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
              </div>
            ))}
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
    </Drawer>
  );
}

export default DocumentsDetailPanel;
