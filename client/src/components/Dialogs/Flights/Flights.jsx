import React, { useEffect, useState } from "react";
import FlightsView from "./Flights.view";


const Flights = (props) => {

  const {
    dialogType,
    dialogOpen,
    clientUserId,
    setDialogOpen,
    closeModal,
    updateClientsUsers,
  } = props;

  

  return (
    <FlightsView />
  );
};

export default Flights;
