import React, { useState,useEffect } from "react";
import VacationView from "./Vacation.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiVacations from "../../../../../../apis/vacationRequest";
import * as vacationSlice from "../../../../../../store/slice/vacationSlice"
import * as dialogSlice from "../../../../../../store/slice/dialogSlice"
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";


const Vacation = (props) => {

  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const vacationDetails = useSelector((state) => state.vacationSlice.vacationDetails);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "",
    "שם חופשה",
    "מספר מסלולים",
    "מסלולים",
    "ערוך" 
  ];

  const filteredVacations = vacationDetails?.filter((vac) => {
    if (searchTerm !== "") {
      return vac.name.includes(searchTerm);
    } else {
      return vac;
    }
  });

  const handleEditClick = (index, vac) => {
    dispatch(staticSlice.updateForm({
      vacation_name: vac.name,
      vacation_id: vac.vacation_id,
      vacation_routes: vac.details.length,
      ...vac.details.reduce((acc, detail, i) => {
        acc[`start_date_${i}`] = detail.start_date || "";
        acc[`end_date_${i}`] = detail.end_date || "";
        return acc;
      }, {}),
      exceptions: vac.details.some((d) => d.name === "חריגים"),
    }));
    dispatch(staticSlice.updateDetailsModalType("editVacation"));
    dispatch(staticSlice.openDetailsModal());
  };



  const handleAddRow = () => {
    dispatch(staticSlice.updateDetailsModalType("addVacation"))
    dispatch(staticSlice.openDetailsModal())
  };




  const getVacations = async () => {
    try {
      const response = await ApiVacations.getVacations(token,vacationId)
      const arrangeVacation = response?.data?.vacations?.map(vacation => {
        const details = response?.data?.allVacationDates?.filter(detail => detail.vacation_id === vacation.vacation_id);
        return {
          ...vacation,
          details
        };
      });
        dispatch(vacationSlice.updateVacationDetails(arrangeVacation))
    } catch (error) {
      console.log(error)
    }
  }
 

;
  useEffect(() => {
    getVacations()
  }, [])
  return (
  <>
  <VacationView
  filteredVacations={filteredVacations}
  searchTerm={searchTerm}
  headers={headers}
  handleEditClick={handleEditClick}
  handleAddRow={handleAddRow}
   />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default Vacation;
