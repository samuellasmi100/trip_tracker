import React, { } from "react";
import RoomsView from "./Rooms.view"


const Rooms = ({closeModal,roomType,form,setForm,filteredOptions,userDetails,submit,rooms}) => {
 
  return (
   <RoomsView closeModal={closeModal} roomType={roomType} form={form} setForm={setForm} filteredOptions={filteredOptions} 
   userDetails={userDetails} submit={submit} rooms={rooms}/>
  );
};

export default Rooms;
