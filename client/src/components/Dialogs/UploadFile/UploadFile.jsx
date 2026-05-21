import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UploadFileView from "./UploadFile.view";
import * as notesSlice from "../../../store/slices/notesSlice";
import * as dialogSlice from "../../../store/slices/dialogSlice";
import * as snackBarSlice from "../../../store/slices/snackbarSlice";
import ApiFile from "../../../apis/uploadFileRequest"


const UploadFile = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.notesSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
  const familyName = userForm?.english_last_name?.toLowerCase();
  const token = sessionStorage.getItem("token")
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [newFileName, setNewFileName] = useState(familyName + "_");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(notesSlice.updateFormField({ field: name, value }));
    dispatch(notesSlice.updateFormField({ field: "family_id", value: userForm.family_id }))
    dispatch(notesSlice.updateFormField({ field: "user_id", value: userForm.user_id }))

  };
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFilePreview(URL.createObjectURL(uploadedFile));
    }
  };


  const handleNameChange = (event) => {
    setNewFileName(event.target.value);
  };

  const submit = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }
    const fileExtension = file.name.split('.').pop();
    const renamedFile = new File([file], `${newFileName}.${fileExtension}`, {
      type: file.type,
    });

    const formData = new FormData();
    formData.append('file', renamedFile);
    try {
      await ApiFile.addFile(token,vacationId,formData)

      dispatch(
        snackBarSlice.setSnackBar({
          type: "success",
          message: "הקובץ נוסף בהצלחה",
          timeout: 3000,
        })
      )
       dispatch(dialogSlice.resetState())
    } catch (error) {
      console.error('Error uploading file:', error);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "העלאת הקובץ נכשלה, נסה שוב", timeout: 4000 }));
    }
  };
  
  const handleCloseClicked = () => {
     dispatch(dialogSlice.resetState())
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
    handleFileChange={handleFileChange}
    handleNameChange={handleNameChange}  />;
};

export default UploadFile;
