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
  Select,
  MenuItem,
  ListItemText,
  OutlinedInput
} from "@mui/material";

import { useStyles } from "./GeneralInfo.style";
import React from "react";
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from '@mui/icons-material/Refresh';
function GeneralInfoView({
  filteredGeneralInfoDetailsDetails,
  searchTerm,
  setSearchTerm,
  headers,
  handleExportToExcel,
  handleSelectedChange,
  setSelectedFilter,
  selectedFilter
}) {
  const vacationName = sessionStorage.getItem("vacName") 
  const classes = useStyles();
  const selectOption = ["טסים איתנו", "גיל"]
  return (
    <Grid style={{
      width: "100%"
    }}>
      <Grid style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px" }}>
        <Grid style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Select
            value={selectedFilter}
            displayEmpty
            onChange={(e) => setSelectedFilter(e.target.value)}
            input={
              <OutlinedInput
                className={classes.selectFilterOutline}
              />
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  color: "#1e293b !important",
                  bgcolor: "#ffffff",
                },
              },
            }}
          >
            {selectOption.map((option) => (
              <MenuItem
                key={option}
                value={option}
                className={classes.selectedMenuItem}
              >
                <ListItemText
                  primaryTypographyProps={{ fontSize: "13px" }}
                  primary={option}
                />
              </MenuItem>
            ))}
          </Select>
          <IconButton size="small" onClick={(e) => setSelectedFilter(e.target.value)} style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px" }}>
            <RefreshIcon style={{ color: "#0d9488", fontSize: "18px" }} />
          </IconButton>
        </Grid>
        <Grid style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            {filteredGeneralInfoDetailsDetails?.map((flight, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className={classes.dataTableCell}>
                    {index + 1}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {vacationName}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.week_chosen}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.date_chosen}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.room_id}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.hebrew_first_name + " " + flight.hebrew_last_name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.is_main_user === 1 ? "כן" : "לא"}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.hebrew_first_name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.hebrew_last_name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.english_first_name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.english_last_name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.birth_date === null ? flight?.defaule_birth_date : flight?.birth_date}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.identity_id}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.phone_a && flight?.phone_b !== null ? flight?.phone_a + flight?.phone_b : ""}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.email}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.age === null ? flight.default_age : flight.age}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.user_classification}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.flights === "1" ? 'כן' : "לא"}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.flights === "1" && flight?.flying_with_us === 1 ? 'כן' : flight?.flights === "0" && flight?.flying_with_us === 1 ? "כן" : "לא"}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.flights === "1" && flight?.flights_direction === "round_trip" ? "הלוך חזור" : flight.flights_direction === "one_way_outbound" ? "הלוך בלבד" : flight.flights_direction === "one_way_return" ? "חזור בלבד" : ""}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.passport_number}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.validity_passport}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.outbound_flight_date}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.return_flight_date}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.outbound_flight_number}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.return_flight_number}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.outbound_airline}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.return_airline}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.total_amount}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.remains_to_be_paid}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.payment_currency}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {flight?.form_of_payment}
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

export default GeneralInfoView;
