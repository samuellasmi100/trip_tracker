import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from "@mui/material";
import React, { useState } from "react";
import { useStyles } from "./UserLogs.style";
import SearchInput from "../../ReusableComps/SearchInput/SearchInput"
import { ReactComponent as DownloadIcon }  from "../../../assets/icons/download.svg"
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";

function UserLogsView(props) {
  const [sortedField, setSortedField] = useState("Date Time (UTC)");

  const classes = useStyles();
  const {
    setDialogOpen,
    tableData,
  } = props;

  const headers = [
    "שם פרטי",
    "שם משפחה",
    "נותר לתשלום",
    "טיסות",
    "ערוך",
    "הוסף"
  ]
  return (
    <Grid conatiner style={{background: "#2d2d2d"}}>
     <Grid item xs={12} style={{display:"flex",justifyContent:"space-between",borderRadius:"4px"}}>
        <Grid
          style={{display:"flex",justifyContent:"space-between"}}
          item>
         <Grid item>
            <SearchInput />
         </Grid>
        <Grid item style={{ paddingRight: "12px" }}>
            <IconButton
              className={classes.downloadButton}>
              <DownloadIcon style={{ color: "#54A9FF" }} />
            </IconButton>
         </Grid> 
        </Grid>
        <Grid>
          <Button className={classes.submitButton} onClick={() => setDialogOpen(true)}>צור אורח</Button>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{border:"1px solid rgb(61, 63, 71)"}}>
        <TableContainer style={{
              border: "1px solid #3D3F47",
              height: "calc(100vh - 210px)",
          }}>
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
            {tableData?.map((user, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className={classes.dataTableCell}>
                        {user.first_name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                      {user.last_name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                      {user.total_amount}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                      {user.flights}
                      </TableCell>
                      
                     
                      <TableCell
                        className={classes.dataTableCell}
                        style={{ maxWidth: "1px" }}
                      >
                        <IconButton
                          size={"small"}
                          // onClick={() =>
                          //   openNewOrEditDialog(client.clientUserId)
                          // }
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        className={classes.dataTableCell}
                        style={{ maxWidth: "1px" }}
                      >
                        <IconButton
                          size={"small"}
                          // onClick={() =>
                          //   openNewOrEditDialog(client.clientUserId)
                          // }
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default UserLogsView;
