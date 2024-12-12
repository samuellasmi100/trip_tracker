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

import { useStyles } from "./Flights.style";
import React  from "react";
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";
import SearchIcon from "@material-ui/icons/Search";

function FlightsView({ 
  filteredFlightDetails,
  searchTerm,
  setSearchTerm,
  headers,
  handleExportToExcel
}) {

console.log(filteredFlightDetails)
  const classes = useStyles();

  
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
        <IconButton onClick={handleExportToExcel}>
          <DownloadIcon style={{ color: "#54A9FF", fontSize: "30px",border:'1px solid #494C55',padding:"10px",marginTop:"-7",borderRadius:"4px" }} />
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
            {filteredFlightDetails?.map((flight, index) => {
              return (
                <TableRow key={index}>
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
                 {flight?.english_first_name}
                 </TableCell>
                 <TableCell className={classes.dataTableCell}>
                 {flight?.hebrew_first_name + " " + flight.hebrew_last_name}
                 </TableCell>
                 <TableCell className={classes.dataTableCell}>
                 {flight?.birth_date}
                 </TableCell>
                 <TableCell className={classes.dataTableCell}>
                 {flight?.age === null ? flight.default_age : flight.age}
                 </TableCell>
                 <TableCell className={classes.dataTableCell}>
                 {flight?.user_classification}
                 </TableCell>
                 <TableCell className={classes.dataTableCell}>
                 {flight?.flights === "1" ? 'כן': "לא"}
                 </TableCell>
                 <TableCell className={classes.dataTableCell}>
                 {flight?.flights === "1" && flight?.flying_with_us === 1 ? 'כן': flight?.flights === "0" && flight?.flying_with_us === 1 ? "כן" : "לא"}
                 </TableCell>
                 <TableCell className={classes.dataTableCell}>
                 {flight?.flights === "1" && flight?.flights_direction === "round_trip" ? "הלוך חזור":flight.flights_direction === "one_way_outbound" ? "הלוך בלבד" : flight.flights_direction === "one_way_return" ? "חזור בלבד" : ""}
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
                
           
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default FlightsView;
