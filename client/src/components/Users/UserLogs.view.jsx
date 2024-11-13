import {
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";
  import React, { useState } from "react";
  import { StyledTableCell, useStyles } from "./UserLogs.style";
  import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
  import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
  
  function UserLogsView(props) {
    const [sortedField, setSortedField] = useState("Date Time (UTC)");
    const classes = useStyles();
    const {
      tableData,
      handleSorting,
      tableContainerSx,
      component,
      fullView = null,
    } = props;

    const headers = [
      "שם פרטי",
       "שם משפחה",
       "Auction price",
      "נותר לתשלום",
      "טיסות",
    ]
    return (
    <Grid style={{marginTop:'100px'}}>
         <TableContainer>
         <Table>
          <TableHead>
          <TableRow>
          {headers.map((header, index) => {
              return (
                <TableCell
                  key={index}
                  auction={index}
                  className={classes.userOnlineHeaderTableRow}
                >
                  {header}
                </TableCell>
              );
            })}
          </TableRow>
          </TableHead>
          <TableBody  className={classes.userOnlineDataTableBody}>

          </TableBody>
         </Table>
         </TableContainer>
    </Grid>
    )
  }
  
  export default UserLogsView;
  