import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UploadFileView from "./UploadFile.view";
import * as notesSlice from "../../../store/slice/notesSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import * as userSlice from "../../../store/slice/userSlice";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import * as flightsSlice from "../../../store/slice/flightsSlice";
import ApiNotes from "../../../apis/notesRequest"
import axios from "axios";

const UploadFile = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.notesSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
 const token = sessionStorage.getItem("token")
 const [file, setFile] = useState(null);
 const [filePreview, setFilePreview] = useState(null); 
  const [newFileName, setNewFileName] = useState("");


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(notesSlice.updateFormField({ field: name, value }));
    dispatch(notesSlice.updateFormField({ field: "family_id",value:userForm.family_id }))
    dispatch(notesSlice.updateFormField({ field: "user_id",value:userForm.user_id }))
  
  };

  const submit = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    // Create a new file with the renamed name
    const fileExtension = file.name.split('.').pop();
    const renamedFile = new File([file], `${newFileName}.${fileExtension}`, {
      type: file.type,
    });

    // Prepare FormData
    const formData = new FormData();
    formData.append('file', renamedFile);
console.log(formData)
    try {   
      const response = await axios.post('http://localhost:4000/family/upload', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)

      if (response.ok) {
        // setUploadStatus('File uploaded successfully!');
      } else {
        // setUploadStatus('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // setUploadStatus('An error occurred while uploading the file.');
    }
  };
;
const handleCloseClicked = () => {
  dispatch(userSlice.resetForm())
  dispatch(notesSlice.resetForm())
 dispatch(dialogSlice.resetState())
 dispatch(flightsSlice.resetForm())
 }
  return <UploadFileView 
  handleInputChange={handleInputChange} 
  submit={submit}  
  handleCloseClicked={handleCloseClicked} 
  setFile={setFile} 
  file={file}
  filePreview={filePreview}
  setFilePreview={setFilePreview}
  newFileName={newFileName}
  setNewFileName={setNewFileName}
  />;
};

export default UploadFile;
