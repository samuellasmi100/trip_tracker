import React, { useEffect, useState } from "react";
import RoomsView from "./Rooms.view";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../../../store/slice/roomsSlice"
import axios from "axios";

const Rooms = ({ searchTerm }) => {
    const dispatch = useDispatch()
    const rooms = useSelector((state) => state.roomsSlice.rooms);

    const getAllRooms = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/count`)
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
            <RoomsView filteredRooms={filteredRooms}
            />;
        </>
    )
};

export default Rooms;
