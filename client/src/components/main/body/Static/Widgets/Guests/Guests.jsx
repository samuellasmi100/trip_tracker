import React, { useState,useEffect } from "react";
import GuestsView from "./Guests.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import ApiUser from "../../../../../../apis/userRequest";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as snackBarSlice from "../../../../../../store/slice/snackbarSlice";


const Guests = (props) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.staticSlice.form);
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const mainGuests = useSelector((state) => state.staticSlice.mainGuests);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

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


const handleDeleteClick = async (user) => {
  try {
    if(user.is_main_user === 1){
      dispatch(
        snackBarSlice.setSnackBar({
          type: "warn",
          message: "אם ברצונך למחוק משתמש ראשי אנא גש למסך נרשמים",
          timeout: 3000,
        })
      )
      return 
    }else {
      

    const response = await ApiUser.deleteGuests(token,user.user_id,vacationId)
    dispatch(
      snackBarSlice.setSnackBar({
        type: "success",
        message: `${user.hebrew_first_name + " " + user.hebrew_last_name} נמחק בהצלחה`,
        timeout: 3000,
      })
    )
    dispatch(staticSlice.updateMainGuests(response.data))
    }
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
 

;
  useEffect(() => {
    getMainGuests()
  }, [])
  return (
  <>
  <GuestsView
  filteredainGuests={filteredainGuests}
  searchTerm={searchTerm}
  headers={headers}
  handleDeleteClick={handleDeleteClick}
  setSearchTerm={setSearchTerm}
   />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default Guests;
