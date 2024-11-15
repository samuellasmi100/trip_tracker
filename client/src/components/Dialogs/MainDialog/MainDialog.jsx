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
    clientUserId,
    setDialogOpen,
    closeModal,
    updateClientsUsers,
  } = props;

  return (
       <MainDialogView
        closeModal={closeModal}
        dialogOpen={dialogOpen}
      />
  );
};

export default MainDialog;
