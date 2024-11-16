import React, { useEffect, useState } from "react";
import MainDialogView from "./MainDialog.view";
import ApiClient from "../../../apis/clientRequest";
import ApiRegion from "../../../apis/regionRequest";
import ApiUser from "../../../apis/userRequest";
import { useSelector } from "react-redux";

const MainDialog = (props) => {

  const {
    dialogType,
    dialogOpen,
    setDialogOpen,
    closeModal,
    userDetails
  } = props;

  return (
       <MainDialogView
       dialogType={dialogType}
       dialogOpen={dialogOpen}
       setDialogOpen={setDialogOpen}
       closeModal={closeModal}
       userDetails={userDetails}
      />
  );
};

export default MainDialog;
