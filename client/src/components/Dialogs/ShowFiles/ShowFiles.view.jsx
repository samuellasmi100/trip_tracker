import React, { useState } from "react";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from "@mui/material";
import { useStyles } from "./ShowFiles.style";
import { useSelector, useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload"
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
const ShowFilesView = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    handleInputChange,
    handleCloseClicked,
    setFile,
    files,
    handleDownload
  } = props;
  const headers = [" ", "שם קובץ", "הורדה", "מחיקה"]

  return (
    <>
      <Grid container style={{ minHeight: "510px", padding: "20px", marginTop: "-50px" }}>
        <Grid style={{ maxHeight: "500px", overflow: "auto", width: "100%" }}>
          <Grid>
            <h2> קבצים שהועלו</h2>
          </Grid>
          <Grid item xs={11} style={{ border: "1px solid rgb(61, 63, 71)" }}>
            <TableContainer
              style={{
                border: "1px solid #3D3F47",

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
                  {files.files?.map((file, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className={classes.dataTableCell}>
                          {index + 1}
                        </TableCell>
                        <TableCell
                          className={classes.dataTableCell}
                          style={{ maxWidth: "1px" }}
                        >
                          {file}
                        </TableCell>
                        <TableCell
                          className={classes.dataTableCell}
                          style={{ maxWidth: "1px" }}
                        >
                          <IconButton size={"small"}
                           onClick={() => handleDownload(file)}>
                            <DownloadIcon
                              style={{ color: "#54A9FF", fontSize: "27px" }} />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          className={classes.dataTableCell}
                          style={{ maxWidth: "1px" }}>
                          <IconButton size={"small"}>
                            <DeleteIcon style={{ color: "red", fontSize: "27px" }} />
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
      </Grid>

      <Grid
        item
        xs={12}
        container
        style={{ marginTop: "20px" }}
        justifyContent="space-around"
      >
        <Grid item>
          <Button className={classes.submitButton}>
            {" "}
            הוסף קובץ
          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton} onClick={handleCloseClicked}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ShowFilesView;
