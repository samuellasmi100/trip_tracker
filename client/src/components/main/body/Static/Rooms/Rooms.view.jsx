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

  function StaticView() {
    const classes = useStyles();
    const headers = ["מספר חדר", "סוג חדר","קומה","כיוון","גודל","קיבולת החדר","תפוסה מקסימלית","מספר מקומות פנויים","ערוך"];
    const rooms = useSelector((state) => state.roomsSlice.rooms);
 
    return (
      <Grid>
        <TableContainer
          style={{
            border: "1px solid #3D3F47",
            height: "calc(100vh - 225px)",
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
              {rooms?.map((room, index) => {
                return (
                  <TableRow
                    key={index}>
                    <TableCell className={classes.dataTableCell}>
                      {room.roomId}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {room.roomType}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {room.roomFloor}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {room.roomDirection}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {room.roomSize}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {0}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {0}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {0}
                    </TableCell>
                    <TableCell
                      className={classes.dataTableCell} style={{ maxWidth: "1px" }}>
                        <IconButton size={"small"}> 
                            <EditIcon />
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
  