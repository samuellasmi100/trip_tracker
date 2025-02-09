import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ShowFilesView from "./ShowFiles.view";
import * as notesSlice from "../../../store/slice/notesSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import ApiFile from "../../../apis/uploadFileRequest"
import { END_POINT } from "../../../utils/constants";
import axios from "axios";



const ShowFiles = () => {
  const dispatch = useDispatch();
  const userForm = useSelector((state) => state.userSlice.form);
  const token = sessionStorage.getItem("token")
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
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
    const familyName = userForm?.english_last_name?.toLowerCase();
    try {
      const response = await ApiFile.getFamilyFiles(token,familyName,vacationId)
      if(response.data.message === "No files found in the folder."){
        setFiles([])
      }else {
        setFiles(response.data)
      }
    
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (file) => {

    const lowercaseValue = userForm?.english_last_name?.toLowerCase();
    try {
       ApiFile.deleteFamilyFiles(token,lowercaseValue,vacationId,file)
       dispatch(dialogSlice.resetState())
    } catch (error) {
      console.error(`Error deleting file: ${error.message}`);
    }
  };
  
const handleDownload = async (file) => {
  const lowercaseValue = userForm?.english_last_name?.toLowerCase();
  
  try {
    const fileUrl = `https://api.avimor.online/uploads/${vacationId}/${lowercaseValue}/${file}`
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch the file: ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || (!contentType.includes('application/pdf') && !contentType.includes('image/jpeg'))) {
      throw new Error(`Expected a PDF or JPEG file, but received: ${contentType}`);
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
    handleDelete={handleDelete}
  />;
};

export default ShowFiles;
