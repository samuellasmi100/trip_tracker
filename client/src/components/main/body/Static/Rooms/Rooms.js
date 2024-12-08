import React, { useEffect, useState } from "react";
import RoomView from "./Rooms.view"
import ApiRooms from "../../../../../apis/roomsRequest"
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../../../store/slice/roomsSlice"



const Rooms = ({ searchTerm,handleDialogTypeOpen}) => {
    const vacationId =  useSelector((state) => state.vacationSlice.vacationId)
    const dispatch = useDispatch()
    const rooms = useSelector((state) => state.roomsSlice.rooms);
    const token = sessionStorage.getItem("token")

    const getAllRooms = async () => {
        try {
            let response = await ApiRooms.getAll(token,vacationId)
            dispatch(roomsSlice.updateRoomsList(response.data))
        } catch (error) {
            console.log(error)
        }
    }
    const filteredRooms = rooms?.filter((room) => {
        if (searchTerm !== "") {
            return room.rooms_id.includes(searchTerm)
        } else {
            return room
        }
    }
    );
    
    useEffect(() => {
        getAllRooms()
    }, [])

    return (
        <>
            <RoomView filteredRooms={filteredRooms} handleDialogTypeOpen={handleDialogTypeOpen} 
            />;
        </>
    )
};

export default Rooms;
