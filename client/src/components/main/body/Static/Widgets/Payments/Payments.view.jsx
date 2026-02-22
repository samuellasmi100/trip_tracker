import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useStyles } from "./Payments.style";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";

function PaymentsView({ filteredSummary, searchTerm, setSearchTerm, onFamilyClick, handleExportToExcel }) {
  const classes = useStyles();
  const headers = ["#", "שם משפחה", "סכום עסקה", "שולם", "נותר", "סטטוס"];

  return (
    <Grid style={{ width: "100%" }}>
      {/* toolbar */}
      <Grid style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "8px 12px", gap: "8px" }}>
        <FormControl>
          <TextField
            size="small"
            placeholder="חיפוש..."
            className={classes.textField}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon style={{ color: "#0d9488", fontSize: "18px" }} />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <IconButton size="small" onClick={handleExportToExcel} style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px" }}>
          <DownloadIcon style={{ color: "#0d9488", width: "18px", height: "18px" }} />
        </IconButton>
      </Grid>

      {/* table */}
      <TableContainer style={{ overflow: "visible" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {headers.map((h, i) => (
                <TableCell key={i} className={classes.headerTableRow} style={{ textAlign: "center" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={classes.dataTableBody}>
            {filteredSummary?.map((item, index) => {
              const total     = Number(item.totalAmount || 0);
              const paid      = Number(item.paidAmount  || 0);
              const remaining = total - paid;

              const badgeClass = !total
                ? null
                : paid === 0
                ? classes.paymentUnpaid
                : paid < total
                ? classes.paymentPartial
                : classes.paymentPaid;

              const statusLabel = !total ? null : paid === 0 ? "לא שולם" : paid < total ? "חלקי" : "שולם ✓";

              return (
                <TableRow
                  key={item.familyId}
                  className={classes.clickableRow}
                  onClick={() => onFamilyClick(item)}
                >
                  <TableCell className={classes.dataTableCell}>{index + 1}</TableCell>
                  <TableCell className={classes.familyNameCell}>{item.familyName}</TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {total ? `₪${total.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    ₪{paid.toLocaleString()}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {total ? `₪${remaining.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {!total ? (
                      <span className={classes.paymentNoneText}>ממתין למחיר</span>
                    ) : (
                      <span className={`${classes.statusBadge} ${badgeClass}`}>{statusLabel}</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default PaymentsView;
