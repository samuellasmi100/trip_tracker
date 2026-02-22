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
import { useStyles } from "./Documents.style";
import ApiDocuments from "../../../../../../apis/documentsRequest";

function DocumentsDetailPanel({ open, onClose, family, vacationId, token, onDocDeleted }) {
  const classes = useStyles();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Group docs by user_id
  const grouped = {};
  docs.forEach((d) => {
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
          Object.values(grouped).map((group) => (
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
          ))
        )}
      </div>
    </Drawer>
  );
}

export default DocumentsDetailPanel;
