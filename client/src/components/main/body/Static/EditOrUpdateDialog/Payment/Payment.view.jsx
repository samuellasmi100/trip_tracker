import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useStyles } from "./Payment.style";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from "moment/moment";


function PaymentView({ submit, handleInputChange, handleCloseClicked,filteredPayments }) {
  const classes = useStyles();
  const userPayments = useSelector((state) => state.paymentsSlice.userPayments);

  const headers = [
    "סכום",
    "צורת תשלום",
    "מטבע תשלום",
    "שולם",
    "שולם בתאריך"
  ];
  return (
    <Grid container>
<TableContainer>
  <Table stickyHeader style={{ width: "inherit" }} size="small">
    <TableHead>
      <TableRow>
        {headers.map((header, index) => {
          return (
            <TableCell
              key={index}
              className={classes.headerTableRow}
              style={{ textAlign: "center" }}
            >
              {header}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
    <TableBody className={classes.dataTableBody}>
      {userPayments?.map((payment, index) => {
        return (
          <TableRow key={index}>

            <>
          
              <TableCell className={classes.dataTableCell}>
                {payment?.amountReceived}
              </TableCell>
              <TableCell className={classes.dataTableCell}>
                {payment?.formOfPayment}
              </TableCell>
              <TableCell className={classes.dataTableCell}>
              {payment?.paymentCurrency}
              </TableCell>
              <TableCell className={classes.dataTableCell}>
              <CheckCircleIcon
                  style={{
                    color: payment.is_paid === 1
                      ? "green"
                        : "red",
                    height: "25px",
                    width: "25px",
                  }}
                />
              </TableCell>
              <TableCell className={classes.dataTableCell}>
              {payment?.updated_at !== null ? moment(payment?.updated_at).format('YYYY-MM-DD') : payment?.updated_at}
              </TableCell>
            </>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>
      {/* <Grid
        item
        container
        xs={12}
        style={{ marginLeft: "30px" }}
      >
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          style={{ marginBottom: "30px" }}
        >
          פירוט תשלומים
        </Grid>
      </Grid>
      <Grid
      justifyContent="center"
        style={{ height: "100px", maxHeight: "300px", marginLeft: "30px" }}
      >
        {userPayments?.map((payment) => {
          return (
            <>
              <Grid container justifyContent="center"style={{ gap: "7px",marginRight:"15px" }}>
                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>
                    התקבל
                  </InputLabel>
                  <TextField
                    name=" rooms_id"
                    className={classes.textField}
                    value={payment?.amountReceived}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>
                    בתאריך
                  </InputLabel>
                  <TextField
                    name="floor"
                    value={payment?.paymentDate}
                    className={classes.textField}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>
                    מטבע תשלום
                  </InputLabel>
                  <TextField
                    name="floor"
                    value={payment?.paymentCurrency}
                    className={classes.textField}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>
                    צורת תשלום
                  </InputLabel>
                  <TextField
                    name="size"
                    value={payment?.formOfPayment}
                    className={classes.textField}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </>
          );
        })}
      </Grid>
      <Grid
        item
        xs={12}
        container
        style={{ marginTop: "300px" }}
        justifyContent="space-around"
      >
        <Grid item>
          <Button onClick={submit} className={classes.submitButton}>
            {" "}
            עדכן תשלומים
          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton} onClick={handleCloseClicked}>
            סגור
          </Button>
        </Grid>
      </Grid> */}
    </Grid>
  );
}

export default PaymentView;
