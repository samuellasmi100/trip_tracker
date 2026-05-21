import React from "react";
import { Typography, Button, LinearProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import { useStyles } from "./PublicDocumentUpload.style";

function PublicDocumentUploadView({
  family,
  members,
  docTypes,
  uploadedDocs,
  uploading,
  onUpload,
  allDone,
}) {
  const classes = useStyles();

  // Build a set of uploaded keys: `${userId}-${docTypeId}`
  const uploadedSet = new Set(
    (uploadedDocs || []).map((d) => `${d.user_id}-${d.doc_type_id}`)
  );

  const totalRequired = members.length * docTypes.length;
  const uploadedCount = uploadedSet.size;
  const progress = totalRequired > 0 ? Math.round((uploadedCount / totalRequired) * 100) : 0;

  if (allDone || (totalRequired > 0 && uploadedCount >= totalRequired)) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <div className={classes.logoArea}>
            <Typography className={classes.brandName}>Avimor Tourism</Typography>
            <Typography className={classes.brandSub}>אביאל מור טיורים</Typography>
            <div className={classes.divider} />
          </div>
          <div className={classes.successCard}>
            <CheckCircleOutlineIcon className={classes.successIcon} />
            <Typography className={classes.successTitle}>כל המסמכים הועלו בהצלחה!</Typography>
            <Typography className={classes.successText}>
              תודה, {family?.family_name}.
              <br />
              קיבלנו את כל המסמכים הנדרשים.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <div className={classes.logoArea}>
          <Typography className={classes.brandName}>Avimor Tourism</Typography>
          <Typography className={classes.brandSub}>אביאל מור טיורים</Typography>
          <div className={classes.divider} />
        </div>

        <Typography className={classes.title}>העלאת מסמכים — {family?.family_name}</Typography>
        <Typography className={classes.subtitle}>
          אנא העלו את המסמכים הנדרשים עבור כל אחד מהנוסעים
        </Typography>

        {/* Progress bar */}
        {totalRequired > 0 && (
          <div className={classes.progressBarWrap}>
            <Typography className={classes.progressLabel}>
              <span>התקדמות</span>
              <span>{uploadedCount} / {totalRequired}</span>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#e2e8f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: progress === 100 ? "#22c55e" : "#0d9488",
                  borderRadius: 4,
                },
              }}
            />
          </div>
        )}

        {/* Per-member sections */}
        {members.map((member) => {
          const memberUploaded = docTypes.filter((dt) =>
            uploadedSet.has(`${member.user_id}-${dt.id}`)
          ).length;

          return (
            <div key={member.user_id} className={classes.memberSection}>
              <div className={classes.memberHeader}>
                <PersonIcon style={{ fontSize: "18px", color: "#0d9488" }} />
                <Typography className={classes.memberName}>
                  {member.hebrew_first_name} {member.hebrew_last_name}
                </Typography>
                <Typography style={{ fontSize: "12px", color: "#64748b", marginRight: "auto" }}>
                  {memberUploaded}/{docTypes.length}
                </Typography>
              </div>

              <div className={classes.docGrid}>
                {docTypes.map((dt) => {
                  const key = `${member.user_id}-${dt.id}`;
                  const isUploaded = uploadedSet.has(key);
                  const isUploading = uploading === key;

                  return (
                    <div
                      key={dt.id}
                      className={`${classes.docCard} ${isUploaded ? classes.docCardUploaded : ""}`}
                    >
                      <Typography className={classes.docLabel}>{dt.label}</Typography>

                      {isUploaded ? (
                        <div className={classes.uploadedBadge}>
                          <CheckCircleIcon style={{ fontSize: "16px" }} />
                          <span>הועלה</span>
                        </div>
                      ) : isUploading ? (
                        <Typography className={classes.uploadingText}>מעלה...</Typography>
                      ) : (
                        <>
                          <input
                            type="file"
                            id={`file-${key}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onUpload(member.user_id, dt.id, file, key);
                              e.target.value = "";
                            }}
                          />
                          <label htmlFor={`file-${key}`}>
                            <Button
                              component="span"
                              variant="outlined"
                              className={classes.uploadBtn}
                              size="small"
                            >
                              העלה קובץ
                            </Button>
                          </label>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <Typography className={classes.footer}>
          הקבצים מועלים בצורה מאובטחת ומוצפנת
        </Typography>
      </div>
    </div>
  );
}

export default PublicDocumentUploadView;
