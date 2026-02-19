import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from "@mui/material";
import { useStyles } from "./UnifiedTable.style";
import StatusChip from "./StatusChip";
import { ReactComponent as EditIcon } from "../../../../../assets/icons/edit.svg";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

function UnifiedTableView({ data, type, onEdit, onDelete, onStatusToggle }) {
  const classes = useStyles();

  const getHeaders = () => {
    const base = ["#", "קטגוריה", "תת קטגוריה", "סכום (מט״ח)", "מטבע", "סכום (ש״ח)", "תאריך מתוכנן", "סטטוס"];
    if (type === "combined") {
      return ["#", "סוג", "קטגוריה", "תת קטגוריה", "מטבע", "סכום (ש״ח)", "תאריך", "סטטוס"];
    }
    return [...base, "פעולות"];
  };

  const headers = getHeaders();

  const formatAmount = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
  };

  return (
    <TableContainer className={classes.tableContainer} sx={{ maxHeight: "calc(100vh - 340px)" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} className={classes.headerCell}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(!data || data.length === 0) ? (
            <TableRow>
              <TableCell colSpan={headers.length} className={classes.emptyState}>
                <Typography>אין נתונים להצגה</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.action_id || index} className={classes.bodyRow}>
                <TableCell className={classes.bodyCell}>{index + 1}</TableCell>

                {type === "combined" && (
                  <TableCell className={classes.bodyCell}>
                    <span className={row.recordType === "income" ? classes.incomeType : classes.expenseType}>
                      {row.recordType === "income" ? "הכנסה" : "הוצאה"}
                    </span>
                  </TableCell>
                )}

                <TableCell className={classes.bodyCell}>{row.categoryName}</TableCell>
                <TableCell className={classes.bodyCell}>{row.subCategoryName}</TableCell>

                {type !== "combined" && (
                  <TableCell className={classes.bodyCell}>
                    {row.paymentCurrency0 === "שקל" ? "" : formatAmount(row.expenditure0)}
                  </TableCell>
                )}

                <TableCell className={classes.bodyCell}>{row.paymentCurrency0}</TableCell>
                <TableCell className={classes.bodyCell}>{formatAmount(row.expenditure_ils)}</TableCell>
                <TableCell className={classes.bodyCell}>{row.paymentDate0}</TableCell>
                <TableCell className={classes.bodyCell}>
                  <StatusChip isPaid={row.is_paid} paymentDate={row.paymentDate0} />
                </TableCell>

                {type !== "combined" && (
                  <TableCell className={classes.bodyCell}>
                    <IconButton
                      className={classes.actionButton}
                      onClick={() => onStatusToggle && onStatusToggle(row)}
                      title={row.is_paid === 1 ? "סמן כלא שולם" : "סמן כשולם"}
                    >
                      <SwapHorizIcon sx={{ fontSize: 18, color: "#64748b" }} />
                    </IconButton>
                    <IconButton
                      className={classes.actionButton}
                      onClick={() => onEdit && onEdit(row)}
                    >
                      <EditIcon style={{ width: "16px", height: "16px" }} />
                    </IconButton>
                    <IconButton
                      className={classes.actionButton}
                      onClick={() => onDelete && onDelete(row.action_id)}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UnifiedTableView;
