import React, { useState,useEffect } from "react";
import MainGuestsView from "./MainGuests.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver"
import ApiUser from "../../../../../../apis/userRequest"
import * as snackBarSlice from "../../../../../../store/slice/snackbarSlice"

const MainGuests = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const mainGuests = useSelector((state) => state.staticSlice.mainData);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "",
    "שם פרטי בעברית",
    "שם משפחה בעברית",
    "שם פרטי באנגלית",
    "שם משפחה באנגלית",
    "גיל",
    "מספר זהות",
    "מספר טלפון",
    "אימייל",
    "כמות נרשמים",
    "חסרים במערכת",
    "מחק"
  ];

  const filteredGuests = mainGuests?.filter((user) => {
    if (searchTerm !== "") {
      return user.hebrew_first_name?.includes(searchTerm) || user.hebrew_last_name?.includes(searchTerm) || user.identity_id?.includes(searchTerm) ;
    } else {
      return user;
    }
  });
  const getMainGuests = async () => {
    try {
      const response = await ApiStatic.getMainGuests(token,vacationId)
        dispatch(staticSlice.updateMainData(response.data))
    } catch (error) {
      console.log(error)
    }
  }
 
  const handleExportToExcel = () => {
    const transformedData = filteredGuests.map((row) => {
     
      return {
        "שם פרטי בעברית": row.hebrew_first_name,
        "שם משפחה בעברית": row.hebrew_last_name,
        "שם פרטי באנגלית": row.english_first_name,
        "שם משפחה באנגלית": row.english_last_name,
        "גיל": row.age,
        "מספר זהות": row.identity_id,
        "מספר טלפון": row.phone_a !== null && row.phone_b !== null ? row.phone_a + row.phone_b : "",
        "אימייל": row.email
      };
    });
  
    const hebrewHeaders = [
      "שם פרטי בעברית",
      "שם משפחה בעברית",
      "שם פרטי באנגלית",
      "שם משפחה באנגלית",
      "גיל",
      "מספר זהות",
      "מספר טלפון",
      "אימייל"
    ];
    const ws = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "נרשמים");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "נרשמים.xlsx");
  };

 const handleClose = () => {
    setOpen(false); 
  }

const handleDeleteClick = async () => {

  try {
    const response = await ApiUser.deleteMainGuests(token,selectedUser.family_id,vacationId)
    dispatch(staticSlice.updateMainData(response.data.mainGuests))
    dispatch(staticSlice.updateMainData(response.data.allGuests))
    setOpen(false); 

  dispatch(
    snackBarSlice.setSnackBar({
      type: "success",
      message: `${selectedUser.hebrew_first_name + " " + selectedUser.hebrew_last_name} נמחק בהצלחה`,
      timeout: 3000,
    })
  )
  } catch (error) {
    console.log(error)
  }
}

 const handleDeleteButtonClick = (user) => {
    setSelectedUser(user);
    setOpen(true); 
};

  useEffect(() => {
    getMainGuests()
  }, [])
  return (
  <>
  <MainGuestsView
  filteredGuests={filteredGuests}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  headers={headers}
  handleExportToExcel={handleExportToExcel}
  handleDeleteButtonClick={handleDeleteButtonClick}
  selectedUser={selectedUser}
  handleClose={handleClose}
  open={open}
  handleDeleteClick={handleDeleteClick}
   />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default MainGuests;
