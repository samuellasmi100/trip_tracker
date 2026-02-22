import {
  Grid, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, FormControl, InputAdornment, TextField,
  Select, MenuItem, ListItemText, OutlinedInput,
  CircularProgress, Box, Typography,
} from "@mui/material";
import { useStyles } from "./GeneralInfo.style";
import React from "react";
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

function GeneralInfoView({
  rows, search, setSearch, headers, handleExportToExcel,
  setSelectedFilter, selectedFilter,
  loading, hasMore, sentinelRef,
}) {
  const vacationName = sessionStorage.getItem("vacName");
  const classes = useStyles();
  const selectOption = ["טסים איתנו", "גיל"];

  return (
    <Grid style={{ width: "100%" }}>
      {/* ── Sticky toolbar ── */}
      <Box sx={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Select
            value={selectedFilter || ""}
            displayEmpty
            onChange={(e) => setSelectedFilter(e.target.value)}
            input={<OutlinedInput className={classes.selectFilterOutline} />}
            MenuProps={{ PaperProps: { sx: { color: "#1e293b", bgcolor: "#ffffff" } } }}
          >
            {selectOption.map((option) => (
              <MenuItem key={option} value={option} className={classes.selectedMenuItem}>
                <ListItemText primaryTypographyProps={{ fontSize: "13px" }} primary={option} />
              </MenuItem>
            ))}
          </Select>
          <IconButton
            size="small"
            onClick={() => setSelectedFilter(undefined)}
            style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px" }}
          >
            <RefreshIcon style={{ color: "#0d9488", fontSize: "18px" }} />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FormControl>
            <TextField
              size="small"
              placeholder="חיפוש..."
              className={classes.textField}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
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
        </Box>
      </Box>

      {/* ── Table ── */}
      <TableContainer style={{ overflow: "visible" }}>
        <Table stickyHeader style={{ width: "inherit" }} size="small">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} className={classes.headerTableRow} style={{ textAlign: "center" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={classes.dataTableBody}>
            {loading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} sx={{ border: "none", py: 6 }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={28} sx={{ color: "#0d9488" }} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.map((flight, index) => (
              <TableRow key={flight.user_id || index}>
                <TableCell className={classes.dataTableCell}>{index + 1}</TableCell>
                <TableCell className={classes.dataTableCell}>{vacationName}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.week_chosen}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.date_chosen}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.room_id}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.hebrew_first_name + " " + (flight?.hebrew_last_name || "")}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.is_main_user === 1 ? "כן" : "לא"}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.hebrew_first_name}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.hebrew_last_name}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.english_first_name}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.english_last_name}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.birth_date === null ? flight?.defaule_birth_date : flight?.birth_date}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.identity_id}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.phone_a || ""}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.email}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.age === null ? flight?.default_age : flight?.age}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.user_classification}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.flights === "1" ? "כן" : "לא"}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.flying_with_us === 1 ? "כן" : "לא"}</TableCell>
                <TableCell className={classes.dataTableCell}>
                  {flight?.flights_direction === "round_trip" ? "הלוך חזור" : flight?.flights_direction === "one_way_outbound" ? "הלוך בלבד" : flight?.flights_direction === "one_way_return" ? "חזור בלבד" : ""}
                </TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.passport_number}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.validity_passport}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.outbound_flight_date}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.return_flight_date}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.outbound_flight_number}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.return_flight_number}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.outbound_airline}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.return_airline}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.total_amount}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.remains_to_be_paid}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.payment_currency}</TableCell>
                <TableCell className={classes.dataTableCell}>{flight?.form_of_payment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Infinite scroll sentinel ── */}
      <Box ref={sentinelRef} sx={{ height: "1px" }} />
      {loading && rows.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={22} sx={{ color: "#0d9488" }} />
        </Box>
      )}
      {!hasMore && rows.length > 0 && (
        <Box sx={{ textAlign: "center", py: 1.5 }}>
          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>סוף הרשימה — {rows.length} רשומות</Typography>
        </Box>
      )}
    </Grid>
  );
}

export default GeneralInfoView;
