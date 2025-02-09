import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import { useStyles } from "./UploadFile.style";
import { useSelector, useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice";

const UploadFileView = (props) => {
 
  const classes = useStyles();

  const {
    handleInputChange, 
    submit,
     handleCloseClicked,
     setFile,
     file,
     filePreview,
    setFilePreview,
    newFileName,
    setNewFileName,
    handleFileChange,
    handleNameChange
  } = props;



  return (
    <>
      <Grid container style={{ minHeight: "510px", padding: "20px",marginTop:"-50px" }}>
        <Grid style={{ maxHeight: "500px", overflow: "auto",width:"100%" }}>
          <Grid>
            <h2>העלאת קבצים</h2>
          </Grid>
          <Grid>
            <Grid>
              <input
                type="text"
                value={newFileName}
                onChange={handleNameChange}
                placeholder="הוסף שם קובץ"
              />
            </Grid>
            <input
              type="file"
              accept=".pdf, .jpeg, .jpg"
              onChange={handleFileChange}
            />
            {filePreview && (
              <div style={{ marginTop: "20px" }}>
                {file.type.startsWith("image/") ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      border: "1px solid #ccc",
                      padding: "10px",
                    }}
                  />
                ) : file.type === "application/pdf" ? (
                  <iframe
                    src={filePreview}
                    title="PDF Preview"
                    style={{
                      width: "100%",
                      height: "500px",
                      border: "1px solid #ccc",
                    }}
                  ></iframe>
                ) : (
                  <p>File preview not available.</p>
                )}
              </div>
            )}
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
          <Button onClick={submit} className={classes.submitButton}>
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

export default UploadFileView;
