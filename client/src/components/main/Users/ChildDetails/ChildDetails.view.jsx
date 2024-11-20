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
  import React from "react";
  import { useStyles } from "./ChildDetails.style";
  import { ReactComponent as DownloadIcon } from "../../../../assets/icons/download.svg";
  import { ReactComponent as EditIcon } from "../../../../assets/icons/edit.svg";
  import DescriptionIcon from '@mui/icons-material/Description';
   import { useSelector } from "react-redux";

  function ChildDetailsView({childDataDetails,handleDialogTypeOpen}) {
   const childrenDetails = useSelector((state) => state.userSlice.children)
   const child = useSelector((state) => state.userSlice.child)
 
    const classes = useStyles();

    const headers = [
      "שם פרטי",
      "שם משפחה",
      "תעודת זהות",
      "ערוך",
      "פרטים"
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
               {childrenDetails?.map((user, index) => {
                return (             
                    <TableRow key={index}>
                        <TableCell className={classes.dataTableCell}>
                          {user.first_name}
                        </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.last_ame}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.identity_id}
                      </TableCell>
                      <TableCell
                        className={classes.dataTableCell}
                        style={{ maxWidth: "1px" }}
                      >
                        <IconButton
                          size={"small"}
                          onClick={() => handleDialogTypeOpen("editChild", user)}
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
                        //   onClick={() => handleDialogTypeOpen("addChild", user)}
                        >
                          <DescriptionIcon style={{color:"rgb(255, 158, 84)"}}/>
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
  