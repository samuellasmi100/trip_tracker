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
  const dispatch = useDispatch();
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
    setNewFileName,} = props;
  // Handle file upload
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFilePreview(URL.createObjectURL(uploadedFile));
      setNewFileName(uploadedFile.name.split(".").slice(0, -1).join(".")); // Default name without extension
    }
  };

  // Handle name change
  const handleNameChange = (event) => {
    setNewFileName(event.target.value);
  };

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
                placeholder="Enter new file name"
              />
            </Grid>
            <input
              type="file"
              accept="image/*,.pdf"
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
