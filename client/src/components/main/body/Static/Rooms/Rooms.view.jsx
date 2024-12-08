import {
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
  } from "@mui/material";

  import React from "react";
  import { useStyles } from "./Rooms.style";
  import { useSelector } from "react-redux";
  import { ReactComponent as EditIcon  } from "../../../../../assets/icons/edit.svg"
  import EventAvailableIcon from '@mui/icons-material/EventAvailable';

  function StaticView({
    filteredRooms,
    handleDialogTypeOpen,
  }) {
    const classes = useStyles();
    const headers = ["מספר חדר", "סוג חדר","קומה","כיוון","גודל","קיבולת החדר","תפוסה מקסימלית","מספר אנשים בחדר ","ערוך","זמינות"];
    const rooms = useSelector((state) => state.roomsSlice.rooms);

    return (
      <Grid>
        <TableContainer
          style={{
            border: "1px solid #3D3F47",
            height: "calc(100vh - 245px)",
            maxHeight:"80vh"
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
                  <TableRow
                    key={index}>
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
                      {room.number_of_people}
                    </TableCell>
                    <TableCell
                      className={classes.dataTableCell} style={{ maxWidth: "1px" }}>
                        <IconButton size={"small"}> 
                            <EditIcon onClick={() => handleDialogTypeOpen("editRoom",room)}/>
                      </IconButton>
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                    <IconButton size={"small"} > 
                     <EventAvailableIcon style={{color:"#FF9E54"}} onClick={() => handleDialogTypeOpen("showAvailableDates",room)}/>
                     </IconButton>
                    </TableCell>
                    
                
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    );
  }
  
  export default StaticView;
  