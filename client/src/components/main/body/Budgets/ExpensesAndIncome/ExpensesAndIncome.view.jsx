import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React from "react";
import { StyledTooltip, useStyles } from "./ExpensesAndIncome.style";
import { useSelector } from "react-redux";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@material-ui/icons/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ReactComponent as EditIcon } from "../../../../../assets/icons/edit.svg";
import ErrorIcon from "@mui/icons-material/Error";

function ExpensesAndIncomeView({
  handleDialogTypeOpen,
  handlePaymentStatus,
  handleClose,
  handleConfirm,
  open,
  selectedKey,
  handleClickOpen
}) {
  const classes = useStyles();
  const vacationList = useSelector((state) => state.vacationSlice.vacations);
  const vacationName = useSelector((state) => state.vacationSlice.vacationName);
  const isExpense = useSelector((state) => state.budgetSlice.isExpense);
  const budgetStatus = useSelector((state) => state.budgetSlice.status);
  const headers = [
    " ",
    "קטגוריה",
    "תת קטגוריה",
    "מטבע תשלום",
    budgetStatus === "צפי הוצאות"
      ? "הוצאה בשקלים"
      : budgetStatus === "צפי הכנסות"
      ? "הכנסה בשקלים"
      : "הוצאה בשקלים",
    budgetStatus === "צפי הוצאות"
      ? "הוצאה במטבע זר"
      : budgetStatus === "צפי הכנסות"
      ? "הכנסה במטבע זר"
      : "הוצאה במטבע זר",
    "שולם בתאריך",
    "סטטוס תשלום",
    "ערוך",
  ];
  const expensesAndIncome = useSelector(
    (state) => state.budgetSlice.expensesAndIncome
  );
  const handleMessageString = () => {
    if (selectedKey) {
      if (selectedKey.is_paid === 1) {
        return "האם הנך בטוח שברצונך לשנות סטטוס הוצאה זו להוצאה שלא שולמה?";
      } else {
        return "האם הנך בטוח שברצןנך לשנות סטטוס הוצאה זו להוצאה ששולמה?";
      }
    }
  };

  return (
    <Grid
      container
      style={{
        background: "#2d2d2d",
        width: "47vw",
        border: "1px solid rgb(61, 63, 71)",
        marginLeft: "10px",
      }}
    >
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "4px",
        }}
      >
        <Grid style={{ marginRight: "5px", marginTop: "5px" }}></Grid>
        <Grid item></Grid>
        <Grid item style={{ marginRight: "-100px", marginTop: "10px" }}>
          {" "}
          <Typography style={{ color: "white" }}>
            {" "}
            {budgetStatus === "צפי הוצאות"
              ? "הוצאות"
              : budgetStatus === "צפי הכנסות"
              ? "הכנסות"
              : "הוצאות"}
          </Typography>
        </Grid>
        <Grid>
          <Grid style={{ display: "flex" }}>
            <Grid style={{ marginRight: "5px", marginTop: "5px" }}>
              <FormControl>
                <TextField
                  size="small"
                  className={classes.searchField}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                  // value={searchTerm}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        // style={{ display: showClearIcon }}
                        // onClick={handleClick}
                      >
                        <SearchIcon style={{ color: "rgb(84, 169, 255)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid>
              <IconButton
                onClick={() => handleDialogTypeOpen("ExpensesAndIncomeView")}
              >
                <AddBoxIcon style={{ color: "#54A9FF", fontSize: "30px" }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{ border: "1px solid rgb(61, 63, 71)" }}>
        <TableContainer
          style={{
            border: "1px solid #3D3F47",
            height: "calc(100vh - 230px)",
          }}
        >
          <Table style={{ width: "inherit" }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {headers?.map((header, index) => {
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
              {expensesAndIncome?.map((key, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={classes.dataTableCell}>
                      {index + 1}
                    </TableCell>
                    <TableCell
                      className={
                        key.is_unexpected === 1 && budgetStatus === "צפי הוצאות"
                          ? classes.dataTableCell2
                          : classes.dataTableCell
                      }
                    >
                      {key.categoryName}
                    </TableCell>
                    <TableCell
                      className={
                        key.is_unexpected === 1 && budgetStatus === "צפי הוצאות"
                          ? classes.dataTableCell2
                          : classes.dataTableCell
                      }
                    >
                      {key.subCategoryName}
                    </TableCell>
                    <TableCell
                      className={
                        key.is_unexpected === 1 && budgetStatus === "צפי הוצאות"
                          ? classes.dataTableCell2
                          : classes.dataTableCell
                      }
                    >
                      {key.paymentCurrency0}
                    </TableCell>
                    <TableCell
                      className={
                        key.is_unexpected === 1 && budgetStatus === "צפי הוצאות"
                          ? classes.dataTableCell2
                          : classes.dataTableCell
                      }
                    >
                      {Number(key.expenditure_ils) % 1 === 0
                        ? Number(key.expenditure_ils).toFixed(0)
                        : key.expenditure_ils.toString()}
                    </TableCell>
                    <TableCell
                      className={
                        key.is_unexpected === 1 && budgetStatus === "צפי הוצאות"
                          ? classes.dataTableCell2
                          : classes.dataTableCell
                      }
                    >
                      {key.paymentCurrency0 === "שקל" ? "" : key.expenditure0}
                    </TableCell>
                    <TableCell
                      className={
                        key.is_unexpected === 1 && budgetStatus === "צפי הוצאות"
                          ? classes.dataTableCell2
                          : classes.dataTableCell
                      }
                    >
                      {key.actual_payment_date}
                    </TableCell>
                    <TableCell
                      className={
                        key.is_unexpected === 1 && budgetStatus === "צפי הוצאות"
                          ? classes.dataTableCell2
                          : classes.dataTableCell
                      }
                    >
                      {(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const paymentDate = new Date(key.paymentDate0);
                        paymentDate.setHours(0, 0, 0, 0);
                        if (key.is_paid === 1) {
                          return (
                            <StyledTooltip
                              title="שולם"
                              placement="bottom-end"
                              arrow
                            >
                              <IconButton
                                onClick={() => handleClickOpen(key, false)}
                              >
                                <CheckCircleIcon
                                  style={{
                                    color: "green",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />
                              </IconButton>
                            </StyledTooltip>
                          );
                        } else if (paymentDate <= today) {
                          return (
                            <StyledTooltip
                              title={`תשלום זה היה צריך להיות משולם עד ${
                                key.paymentDate0
                              }`}
                              placement="bottom-end"
                              arrow
                            >
                              <IconButton
                                onClick={() => handleClickOpen(key, true)}
                              >
                                <ErrorIcon
                                  style={{
                                    color: "red",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />
                              </IconButton>
                            </StyledTooltip>
                          );
                        } else {
                          return (
                            <StyledTooltip
                              title={`תשלום זה צריך להיות משולם עד ${
                        
                                  key.paymentDate0
                              }`}
                              placement="bottom-end"
                              arrow
                            >
                              <IconButton
                                onClick={() => handleClickOpen(key, true)}
                              >
                                <CheckCircleIcon
                                  style={{
                                    color: "orange",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />
                              </IconButton>
                            </StyledTooltip>
                          );
                        }
                      })()}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      <IconButton
                        onClick={() =>
                          handleDialogTypeOpen("updateExpense", key)
                        }
                      >
                        <EditIcon style={{ width: "20px", height: "20px" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialog }}
      >
     <DialogContent> {handleMessageString()}</DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{
              color: "#FFFFFF",
              padding: "2px",
              border: "1px solid black",
              marginLeft: "3px",
              background: "#494C55",
            }}
          >
            ביטול
          </Button>
          <Button
          onClick={handleConfirm}
            autoFocus
            style={{
              color: "#FFFFFF",
              padding: "2px",
              border: "1px solid black",
              background: "red",
            }}
          >
            עדכן
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ExpensesAndIncomeView;
