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
import { useStyles } from "./ParentList.style";
import SearchInput from "../../../ReusableComps/SearchInput/SearchInput";
import { ReactComponent as DownloadIcon } from "../../../../assets/icons/download.svg";
import { ReactComponent as EditIcon } from "../../../../assets/icons/edit.svg";
import DescriptionIcon from '@mui/icons-material/Description';

function ParentListView(props) {

  const classes = useStyles();
  const { tableData, handleDialogTypeOpen, handleNameClick } =
    props;
  const headers = [
    "שם פרטי",
    "שם משפחה",
    "נותר לתשלום",
    "טיסות",
    "ערוך",
    "הוסף",
    "פרטים"
  ];

  return (
    <Grid container style={{ background: "#2d2d2d",width:"100vw" }}>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "4px",
        }}
      >
        <Grid style={{ display: "flex", justifyContent: "space-between" }} item>
          <Grid item>
            <SearchInput />
          </Grid>
          <Grid item style={{ paddingRight: "12px" }}>
            <IconButton className={classes.downloadButton}>
              <DownloadIcon style={{ color: "#54A9FF" }} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid>
          <Button
            className={classes.submitButton}
            onClick={() => handleDialogTypeOpen("addParent")}
          >
            צור אורח
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{ border: "1px solid rgb(61, 63, 71)" }}>
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
              {tableData?.map((user, index) => {
                return (             
                  
                    <TableRow key={index}>
                      <Button onClick={() => handleNameClick(user)}>
                        <TableCell className={classes.dataTableCell}>
                          {user.first_name}
                        </TableCell>
                      </Button>
                      <TableCell className={classes.dataTableCell}>
                        {user.last_name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.remains_to_be_paid !== null && user.remains_to_be_paid !== undefined ? user.remains_to_be_paid :
                        user.total_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
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
                          onClick={() =>
                            handleDialogTypeOpen("editParent", user)
                          }
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
                          onClick={() => handleDialogTypeOpen("addChild", user)}
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
                          onClick={() => handleDialogTypeOpen("addChild", user)}
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
    </Grid>
  );
}

export default ParentListView;
