import React, { useEffect } from "react";
import RoomsView from "./Rooms.view";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import * as roomsSlice from "../../../../../store/slice/roomsSlice"
import axios from "axios";

const Rooms = () => {
    const dispatch = useDispatch()

    const getAllRooms = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms`)
            dispatch(roomsSlice.updateRoomsList(response.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllRooms()
    }, [])

    return (
        <>
            <RoomsView />;
        </>
    )
};

export default Rooms;
