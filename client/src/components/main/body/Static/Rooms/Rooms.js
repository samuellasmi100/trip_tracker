import React, { useEffect, useState } from "react";
import RoomsView from "./Rooms.view";
import ApiRooms from "../../../../../apis/roomsRequest"
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../../../store/slice/roomsSlice"
import axios from "axios";

const Rooms = ({ searchTerm }) => {
    const dispatch = useDispatch()
    const rooms = useSelector((state) => state.roomsSlice.rooms);
    const token = sessionStorage.getItem("token")

    const getAllRooms = async () => {
        try {
            let response = await ApiRooms.getAllWithCount(token)
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
