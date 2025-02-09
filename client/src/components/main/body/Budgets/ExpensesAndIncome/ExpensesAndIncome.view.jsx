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
} from "@mui/material";
import React from "react";
import { useStyles } from "./ExpensesAndIncome.style";
import { useSelector } from "react-redux";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@material-ui/icons/Search";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ReactComponent as EditIcon } from "../../../../../assets/icons/edit.svg";
import ErrorIcon from '@mui/icons-material/Error';

function ExpensesAndIncomeView({ handleDialogTypeOpen }) {
  const classes = useStyles();
  const vacationList = useSelector((state) => state.vacationSlice.vacations);
  const vacationName = useSelector((state) => state.vacationSlice.vacationName);
  const isExpense = useSelector((state) => state.budgetSlice.isExpense);
  const headers = [
    " ",
    "קטגוריה",
    "תת קטגוריה",
    "מטבע תשלום",
    "הוצאה בשקלים",
    "הוצאה במטבע זר",
    "תאריך תשלום",
    "שולם",
    "ערוך"
  ];
  const expensesAndIncome = useSelector(
    (state) => state.budgetSlice.expensesAndIncome
  );
  console.log(expensesAndIncome)
  return (
    <Grid
      container
      style={{
        background: "#2d2d2d",
        width: "42vw",
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
        <Grid style={{ marginRight: "5px", marginTop: "5px" }}>
        </Grid>
        <Grid item></Grid>
        <Grid item style={{ marginRight: "-100px", marginTop: "10px" }}>
          <Typography style={{ color: "white" }}>
            {" "}
            {isExpense ? " הוצאות " : " הכנסות"}
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
                    <TableCell className={classes.dataTableCell}>
                      {key.categoryName}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {key.subCategoryName}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {key.payment_currency}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {key.expenditure_ils}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {key.expenditure}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {key.payment_date}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {(() => {
                        const paymentDate = new Date(key.payment_date);
                        const today = new Date();

                        if (key.is_paid === 1) {
                          return <CheckCircleIcon style={{ color: "green" }} />;
                        } else if (paymentDate < today) {
                          return <ErrorIcon style={{ color: "red" }} />;
                        } else {
                          return <CheckCircleIcon style={{ color: "orange" }} />;
                        }
                      })()}
                    </TableCell>
                    <TableCell
                      className={classes.dataTableCell}
                      style={{ maxWidth: "1px" }}
                    >
                      <IconButton
                        size={"small"}
                      // onClick={() =>
                      //   handleDialogTypeOpen(
                      //     user.is_main_user
                      //       ? "editParent"
                      //       : "editChild",
                      //     user
                      //   )
                      // }
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default ExpensesAndIncomeView;
