import React, { useState,useEffect } from "react";
import MainDialog from "../../../Dialogs/MainDialog/MainDialog";
import axios from "axios";
import { useDispatch } from "react-redux";
import ChildDetailsView from "./ChildDetails.view";

const ChildDetails = ({handleDialogTypeOpen}) => {


  return(
  <>
  <ChildDetailsView handleDialogTypeOpen={handleDialogTypeOpen}/>;

  </>
  )
};

export default ChildDetails;
