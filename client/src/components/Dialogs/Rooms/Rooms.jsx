import React, { } from "react";
import RoomsView from "./Rooms.view"


const Rooms = ({closeModal,roomType,form,setForm,filteredOptions}) => {
 
  return (
   <RoomsView closeModal={closeModal} roomType={roomType} form={form} setForm={setForm} filteredOptions={filteredOptions} />
  );
};

export default Rooms;
