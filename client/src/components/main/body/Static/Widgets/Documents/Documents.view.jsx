import React from "react";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CheckIcon from "@mui/icons-material/Check";
import { useStyles } from "./Documents.style";
import DocumentsDetailPanel from "./DocumentsDetailPanel";

function DocumentsView({
  familiesStatus,
  vacationId,
  token,
  panelFamily,
  panelOpen,
  openPanel,
  closePanel,
  copiedFamilyId,
  onCopyLink,
  onDocDeleted,
}) {
  const classes = useStyles();

  const headers = ["משפחה / קבוצה", "התקדמות", "סטטוס", "פעולות"];

  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <Typography className={classes.title}>מסמכים</Typography>
      </div>

      <div className={classes.tableWrap}>
        {familiesStatus.length === 0 ? (
          <div className={classes.emptyState}>אין נתונים להצגה</div>
        ) : (
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {headers.map((h) => (
                    <TableCell key={h} className={classes.headerCell}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {familiesStatus.map((row) => {
                  const total = Number(row.total_required) || 0;
                  const uploaded = Number(row.uploaded_count) || 0;
                  const pct = total > 0 ? Math.round((uploaded / total) * 100) : 0;
                  const statusClass =
                    pct === 100 ? classes.chipComplete
                    : pct > 0 ? classes.chipPartial
                    : classes.chipMissing;
                  const statusLabel =
                    pct === 100 ? "הושלם"
                    : pct > 0 ? "חלקי"
                    : "חסר";
                  const isCopied = copiedFamilyId === row.family_id;

                  return (
                    <TableRow key={row.family_id} hover>
                      <TableCell className={`${classes.dataCell} ${classes.familyName}`}>
                        {row.family_name}
                      </TableCell>
                      <TableCell className={classes.dataCell}>
                        <div className={classes.progressWrap}>
                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "#e2e8f0",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: pct === 100 ? "#22c55e" : pct > 0 ? "#f59e0b" : "#ef4444",
                                borderRadius: 3,
                              },
                            }}
                          />
                          <span className={classes.progressText}>{uploaded}/{total}</span>
                        </div>
                      </TableCell>
                      <TableCell className={classes.dataCell}>
                        <Chip label={statusLabel} size="small" className={statusClass} />
                      </TableCell>
                      <TableCell className={classes.dataCell}>
                        <Tooltip title={isCopied ? "הועתק!" : "העתק קישור להעלאה"}>
                          <IconButton
                            size="small"
                            className={classes.actionBtn}
                            onClick={() => onCopyLink(row.family_id)}
                          >
                            {isCopied
                              ? <CheckIcon style={{ fontSize: "18px", color: "#22c55e" }} />
                              : <LinkIcon style={{ fontSize: "18px" }} />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="צפה במסמכים">
                          <IconButton
                            size="small"
                            className={classes.actionBtn}
                            onClick={() => openPanel(row)}
                          >
                            <FolderOpenIcon style={{ fontSize: "18px" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      <DocumentsDetailPanel
        open={panelOpen}
        onClose={closePanel}
        family={panelFamily}
        vacationId={vacationId}
        token={token}
        onDocDeleted={onDocDeleted}
      />
    </div>
  );
}

export default DocumentsView;
