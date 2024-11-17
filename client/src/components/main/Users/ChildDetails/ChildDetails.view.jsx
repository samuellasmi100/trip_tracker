import {
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Collapse,
    Box,
    Typography,
  } from "@mui/material";
  import React, { useState,useRef } from "react";
  import { useStyles } from "./ChildDetails.style";
  import SearchInput from "../../../ReusableComps/SearchInput/SearchInput";
  import { ReactComponent as DownloadIcon } from "../../../../assets/icons/download.svg";
  import { ReactComponent as EditIcon } from "../../../../assets/icons/edit.svg";
  
  
  function ChildDetailsView({childDataDetails}) {
  
    const classes = useStyles();

    const headers = [
      "שם פרטי",
      "שם משפחה",
      "תעודת זהות",
      "ערוך",
    ];
    
    return (
       <Grid item xs={12} style={{ border: "1px solid rgb(61, 63, 71)",background: "rgb(45, 45, 45)",width:"30vw",marginTop:"35px" }}>
        <TableContainer
          style={{
            border: "1px solid #3D3F47",
            height: "calc(100vh - 230px)",
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
              {childDataDetails?.map((user, index) => {
                return (             
                    <TableRow key={index}>
                        <TableCell className={classes.dataTableCell}>
                          {user.name}
                        </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.lastName}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.identityId}
                      </TableCell>
                      <TableCell
                        className={classes.dataTableCell}
                        style={{ maxWidth: "1px" }}
                      >
                        <IconButton
                          size={"small"}
                        //   onClick={() => handleDialogTypeOpen("addChild", user)}
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
     
    );
  }
  
  export default ChildDetailsView;
  