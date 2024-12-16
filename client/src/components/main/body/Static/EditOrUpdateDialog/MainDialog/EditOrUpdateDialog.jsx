import React from "react";
import EditOrUpdateDialogView from "./EditOrUpdateDialog.view";
import { useDispatch, useSelector } from "react-redux";
import Vacation from "../Vacation/Vacation";
import Room from "../Room/Room"
import Payment from "../Payment/Payment"

const EditOrUpdateDialog = (props) => {
  const form = useSelector((state) => state.userSlice.form)
  const activeButton = useSelector((state) => state.staticSlice.activeButton)
  const dialogType = useSelector((state) => state.staticSlice.detailsModalType);

  const dispatch = useDispatch()
  const {
    detailsDialogOpen,
       closeDetailsModal
  } = props;

  
  const handleButtonClick = async (buttonName) => {
    
    // dispatch(dialogSlice.updateActiveButton(buttonName))
  }
  
  const handleDataView = () => {
    if(dialogType === "editVacation" || dialogType === "addVacation"){
      return <Vacation />
    }else if(dialogType === "editRoom" || dialogType === "addRoom" ){
       return <Room />
    }else if(dialogType === "editPayments"){
      return <Payment />
   }

  }

  const handleButtonHeader = () => {
   
  }

  return (
       <EditOrUpdateDialogView
       detailsDialogOpen={detailsDialogOpen}
       closeDetailsModal={closeDetailsModal}
       handleDataView={handleDataView}
       handleButtonHeader={handleButtonHeader}
      />
  );
};

export default EditOrUpdateDialog;
