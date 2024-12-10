import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
  InputLabel
} from "@mui/material";

import { useStyles } from "./Vacation.style";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Vacation.css"
import { ReactComponent as EditIcon } from "../../../../../../assets/icons/edit.svg";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@material-ui/icons/Search";
import moment from "moment";

function VacationView({ 
  filteredVacations,
  searchTerm,
  setSearchTerm,
  headers,
  handleEditClick,
  handleAddRow
}) {

  const dispatch = useDispatch()
  const classes = useStyles();
  const form = useSelector((state) => state.staticSlice.form)
  const userForm = useSelector((state) => state.userSlice.form)
  
  return (
    <Grid style={{
      width:"99.9%",  maxHeight: "80vh",
     }}> 
      <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
        <Grid style={{ marginTop: "5px" }}>
          <FormControl>
            <TextField
              size="small"
              className={classes.textField}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: "rgb(84, 169, 255)" }} />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
        <IconButton onClick={handleAddRow}>
          <AddBoxIcon style={{ color: "#54A9FF", fontSize: "30px" }} />
        </IconButton>
      </Grid>
      <TableContainer
      
      >
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
            {filteredVacations?.map((vac, index) => {
              return (
                <TableRow key={index}>
                 
                 <>
                      <TableCell className={classes.dataTableCell}>
                        {vac.name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {vac.details.length}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {vac.details.map((key) => {
                           const formattedStartDate = key.start_date
                           ? moment(key.start_date).format("D-M-YYYY")
                           : "";
                           
                         const formattedEndDate = key.end_date
                           ? moment(key.end_date).format("D-M-YYYY")
                           : "";
                           return (
                            <Typography key={index}>
                              {key.name !== "חריגים"
                                ? `${key.name}: ${formattedEndDate} / ${formattedStartDate} `
                                : key.name}
                            </Typography>
                          );
                      
                    
                        })}
                      </TableCell>
                      <TableCell
                        className={classes.dataTableCell}
                        style={{ maxWidth: "1px" }}
                      >
                        <IconButton size="small">
                          <EditIcon
                            onClick={() => handleEditClick(index, vac)}
                          />
                        </IconButton>
                      </TableCell>
                      
                    </>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default VacationView;
