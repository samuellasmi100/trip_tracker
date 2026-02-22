import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useStyles } from "./Payment.style";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function PaymentView({ userPayments = [] }) {
  const classes = useStyles();

  const headers = ["תאריך", "צורת תשלום", "סכום", "סטטוס", "הערות"];

  return (
    <Grid container>
      <TableContainer>
        <Table stickyHeader style={{ width: "inherit" }} size="small">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  className={classes.headerTableRow}
                  style={{ textAlign: "center" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={classes.dataTableBody}>
            {userPayments?.map((payment, index) => (
              <TableRow key={index}>
                <TableCell className={classes.dataTableCell}>{payment?.paymentDate}</TableCell>
                <TableCell className={classes.dataTableCell}>{payment?.paymentMethod}</TableCell>
                <TableCell className={classes.dataTableCell}>
                  {payment?.amount ? `₪${Number(payment.amount).toLocaleString()}` : "—"}
                </TableCell>
                <TableCell className={classes.dataTableCell}>
                  <CheckCircleIcon
                    style={{
                      color: payment?.status === "completed" ? "#16a34a" : "#ef4444",
                      height: "20px",
                      width: "20px",
                    }}
                  />
                </TableCell>
                <TableCell className={classes.dataTableCell}>{payment?.notes || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default PaymentView;
