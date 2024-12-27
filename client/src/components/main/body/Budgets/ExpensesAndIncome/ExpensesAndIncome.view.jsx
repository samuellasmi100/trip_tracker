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
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";import React from "react";
import { useStyles } from "./ExpensesAndIncome.style"
import { useSelector } from "react-redux";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@material-ui/icons/Search";

function ExpensesAndIncomeView({handleDialogTypeOpen}) {
  const classes = useStyles();
 const vacationList = useSelector((state) => state.vacationSlice.vacations)
  const vacationName = useSelector((state) => state.vacationSlice.vacationName)
  const isExpense = useSelector((state) => state.budgetSlice.isExpense)

  return (
      <Grid
         container
         style={{
           background: "#2d2d2d",
           width: "45vw",
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
          <Select
            value={vacationName}
            // onChange={handleSelectInputChange}
            input={
              <OutlinedInput
                className={classes.selectOutline}
              />
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  color: "#ffffff !important",
                  bgcolor: "#222222",
                },
              },
            }}>
            {vacationList?.map((vacation) => (
              <MenuItem key={vacation.name} value={vacation.name} className={classes.selectedMenuItem}>
                {vacation.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item></Grid>
        <Grid item style={{ marginRight: "-100px", marginTop: "10px" }}>
                <Typography style={{ color: "white" }}> {isExpense ? " הוצאות " : " הכנסות"}</Typography>
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
               onClick={() => handleDialogTypeOpen("ExpensesAndIncomeView")}>
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
                {/* {headers?.map((header, index) => {
                  return (
                    <TableCell
                      key={index}
                      className={classes.headerTableRow}
                      style={{ textAlign: "center" }}
                    >
                      {header}
                    </TableCell>
                  );
                })} */}
              </TableRow>
            </TableHead>
            {/* <TableBody className={classes.dataTableBody}>
              {filteredFamilyList?.map((user, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={classes.dataTableCell}>
                      {index + 1}
                    </TableCell>
                    <Button onClick={() => handleNameClick(user)}>
                      <TableCell className={classes.dataTableCell}>
                        {user.family_name}
                      </TableCell>
                    </Button>
                    <TableCell className={classes.dataTableCell}>
                      {user.remains_to_be_paid === null
                        ? user.total_amount
                        : user.remains_to_be_paid}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>{user.number_of_guests}</TableCell>
                    <TableCell className={`${classes.dataTableCell} ${classes.redText}`}>
                      {Number(user?.number_of_guests) - Number(user?.user_in_system_count) > 0 ? Number(user?.number_of_guests) - Number(user?.user_in_system_count) : ""}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>{vacationName}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody> */}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default ExpensesAndIncomeView;
