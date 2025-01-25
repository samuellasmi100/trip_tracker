import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ShowFilesView from "./ShowFiles.view";
import * as notesSlice from "../../../store/slice/notesSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import * as userSlice from "../../../store/slice/userSlice";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import * as flightsSlice from "../../../store/slice/flightsSlice";

import axios from "axios";

const ShowFiles = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.notesSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
  const token = sessionStorage.getItem("token")
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [files, setFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(notesSlice.updateFormField({ field: name, value }));
    dispatch(notesSlice.updateFormField({ field: "family_id", value: userForm.family_id }))
    dispatch(notesSlice.updateFormField({ field: "user_id", value: userForm.user_id }))

  };

  const handleCloseClicked = () => {
     dispatch(dialogSlice.resetState())
  }

  const getFamilyFiles =  async () => {
    const lowercaseValue = userForm?.english_last_name?.toLowerCase();
    try {
      const response = await axios.get(`http://localhost:5000/uploads/files/${lowercaseValue}`, {
        headers: {
          Authorization: token,
        },
      });
      setFiles(response.data)
    } catch (error) {
      console.log(error)
    }
  }

const handleDownload = async (file) => {
  const lowercaseValue = userForm?.english_last_name?.toLowerCase();
  try {
    const fileUrl = `http://localhost:5000/uploads/${lowercaseValue}/${file}`; // Update the URL as per your backend setup
     // Replace with how you store your token
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        Authorization: token, // Add the token here
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch the file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file; // Use the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL to free up memory
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.log(error)
  }
}
  useEffect(() => {
    getFamilyFiles()
  }, [])
  
  return <ShowFilesView
    handleInputChange={handleInputChange}
    handleCloseClicked={handleCloseClicked}
    setFile={setFile}
    files={files}
    handleDownload={handleDownload}
  />;
};

export default ShowFiles;
