import React, { useState,useEffect } from "react";
import GuestsView from "./Guests.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import ApiUser from "../../../../../../apis/userRequest";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as snackBarSlice from "../../../../../../store/slice/snackbarSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Guests = (props) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.staticSlice.form);
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const mainGuests = useSelector((state) => state.staticSlice.mainGuests);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const handleClose = () => {
    setOpen(false); 
  };

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "שם פרטי בעברית",
    "שם משפחה בעברית",
    "שם פרטי באנגלית",
    "שם משפחה באנגלית",
    "מספר זהות",
    "מספר טלפון",
    "אימייל",
    "משתמש ראשי",
    "מחק"
  ];

  const filteredainGuests = mainGuests?.filter((user) => {
    if (searchTerm !== "") {
      return user.hebrew_first_name.includes(searchTerm) || user.hebrew_last_name.includes(searchTerm) || user.identity_id.includes(searchTerm) ;
    } else {
      return user;
    }
  });


const handleDeleteClick = async () => {

  try {
  if(selectedUser.is_main_user === 1){
    const response = await ApiUser.deleteGuests(token,selectedUser.family_id,vacationId,true)
    // dispatch(staticSlice.updateMainGuests(response.data))
    setOpen(false); 
  }else {
    const response = await ApiUser.deleteGuests(token,selectedUser.user_id,vacationId,false)
    dispatch(staticSlice.updateMainGuests(response.data))
    setOpen(false); 
  }


  // dispatch(
  //   snackBarSlice.setSnackBar({
  //     type: "success",
  //     message: `${user.hebrew_first_name + " " + user.hebrew_last_name} נמחק בהצלחה`,
  //     timeout: 3000,
  //   })
  // )
  } catch (error) {
    console.log(error)
  }
}

  const getMainGuests = async () => {

    try {
        const response = await ApiStatic.getGuests(token,vacationId)
        dispatch(staticSlice.updateMainGuests(response.data))
    } catch (error) {
      console.log(error)
    }
  }
 
  const handleExportToExcel = () => {
    const transformedData = filteredainGuests.map((row) => {
      return {
        "שם פרטי בעברית": row.hebrew_first_name,
        "שם משפחה בעברית": row.hebrew_last_name,
        "שם פרטי באנגלית": row.english_first_name,
        "שם משפחה באנגלית": row.english_last_name,
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
      "מספר זהות",
      "מספר טלפון",
      "אימייל"
    ];
  
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "כלל האורחים");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "כלל האורחים.xlsx");
  };

  const handleDeleteButtonClick = (user) => {
    setSelectedUser(user);
    setOpen(true); 
  };
  useEffect(() => {
    getMainGuests()
  }, [])
  return (
  <>
  <GuestsView
  filteredainGuests={filteredainGuests}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  headers={headers}
  handleDeleteButtonClick={handleDeleteButtonClick}
  handleExportToExcel={handleExportToExcel}
  selectedUser={selectedUser}
  handleClose={handleClose}
  open={open}
  handleDeleteClick={handleDeleteClick}
  />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default Guests;
