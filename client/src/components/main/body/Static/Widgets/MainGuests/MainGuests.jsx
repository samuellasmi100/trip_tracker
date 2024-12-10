import React, { useState,useEffect } from "react";
import MainGuestsView from "./MainGuests.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import * as vacationSlice from "../../../../../../store/slice/vacationSlice"
import * as dialogSlice from "../../../../../../store/slice/dialogSlice"
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";


const MainGuests = (props) => {
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
    "מחק"
  ];

  const filteredainGuests = mainGuests?.filter((user) => {
    if (searchTerm !== "") {
      return user.hebrew_first_name.includes(searchTerm) || user.hebrew_last_name.includes(searchTerm) || user.identity_id.includes(searchTerm) ;
    } else {
      return user;
    }
  });




  const getMainGuests = async () => {
    try {
      const response = await ApiStatic.getMainGuests(token,vacationId)
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
  <MainGuestsView
  filteredainGuests={filteredainGuests}
  searchTerm={searchTerm}
  headers={headers}
  setSearchTerm={setSearchTerm}
   />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default MainGuests;
