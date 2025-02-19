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
} from "@mui/material";

import React from "react";
import { useStyles } from "./Rooms.style";
import { ReactComponent as EditIcon } from "../../../../../../assets/icons/edit.svg";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";
import SearchIcon from "@material-ui/icons/Search";

function StaticView({
  filteredRooms,
  handleDialogTypeOpen,
  searchTerm,
  setSearchTerm,
  handleEditClick,
  headers,
  handleExportToExcel,
}) {
  const classes = useStyles();
  return (
    <Grid>
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
          <DownloadIcon style={{ color: "#54A9FF", fontSize: "30px", border: '1px solid #494C55', padding: "10px", marginTop: "-2", borderRadius: "4px" }} />
        </IconButton>
      </Grid>
      <TableContainer
        style={{
          // border: "1px solid #3D3F47",
          // height: "calc(100vh - 279px)",
          maxHeight: "80vh",
        }}
      >
        <Table style={{ width: "inherit" }} size="small" stickyHeader>
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
            {filteredRooms?.map((room, index) => {
              return (
                <TableRow key={index}>

                  <TableCell className={classes.dataTableCell}>
                    {room.rooms_id}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {room.type}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {room.floor}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {room.direction}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {room.size}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {room.base_occupancy}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {room.max_occupancy}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {room.family_name}
                  </TableCell>
                  <TableCell
                    className={`${classes.dataTableCell} ${Number(room.number_of_people) === 0 ? classes.greenText : classes.redText
                      }`}
                  >
                    {room.number_of_people}
                  </TableCell>
                  <TableCell
                    className={classes.dataTableCell}
                    style={{ maxWidth: "1px" }}
                  >
                    <IconButton size="small">
                      <EditIcon
                        onClick={() => handleEditClick(index, room)}
                      />
                    </IconButton>
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    <IconButton size="small">
                      <EventAvailableIcon
                        style={{ color: "#FF9E54" }}
                        onClick={() =>
                          handleDialogTypeOpen("showAvailableDates", room)
                        }
                      />
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

export default StaticView;
