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
      width: "100%",
     }}> 
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
        <IconButton size="small" onClick={handleAddRow} style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px" }}>
          <AddBoxIcon style={{ color: "#0d9488", fontSize: "18px" }} />
        </IconButton>
      </Grid>
      <TableContainer style={{ overflow: "visible" }}>
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
                  <TableCell className={classes.dataTableCell}>
                    {index + 1}
                  </TableCell>
                  <TableCell className={`${classes.dataTableCell} ${classes.vacationName}`}>
                    {vac.name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    <span className={classes.countBadge}>{vac.details.length}</span>
                  </TableCell>
                  <TableCell className={classes.routesCell}>
                    {vac.details.map((key, i) => {
                      const formattedStartDate = key.start_date
                        ? moment(key.start_date).format("DD/MM/YY")
                        : "";
                      const formattedEndDate = key.end_date
                        ? moment(key.end_date).format("DD/MM/YY")
                        : "";
                      return (
                        <div key={i} className={classes.routeChip}>
                          <span className={classes.routeName}>{key.name}</span>
                          {key.name !== "חריגים" && (
                            <span className={classes.routeDates}>
                              {formattedStartDate} — {formattedEndDate}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    <IconButton size="small" onClick={() => handleEditClick(index, vac)}>
                      <EditIcon style={{ width: "16px", height: "16px" }} />
                    </IconButton>
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

export default VacationView;
