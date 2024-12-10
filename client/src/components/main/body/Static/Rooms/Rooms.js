import React, { useEffect, useState } from "react";
import RoomView from "./Rooms.view";
import ApiRooms from "../../../../../apis/roomsRequest";
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../../../store/slice/roomsSlice";
import * as staticSlice from "../../../../../store/slice/staticSlice";

const defaultNewRow = {
  rooms_id: "",
  type: "",
  floor: "",
  direction: "",
  size: "",
  base_occupancy: "",
  max_occupancy: "",
  number_of_people: "",
};
const Rooms = ({ handleDialogTypeOpen }) => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.roomsSlice.rooms);
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRooms2, setFilteredRooms2] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [actionStatus, setActionStatus] = useState("");
  const [editRowData, setEditRowData] = useState(defaultNewRow);
  const headers = [
    "מספר חדר",
    "סוג חדר",
    "קומה",
    "כיוון",
    "גודל",
    "קיבולת החדר",
    "תפוסה מקסימלית",
    "מספר אנשים בחדר ",
    editRowIndex === null ? "ערוך" : "שמור",
    "זמינות",
  ];
  const getAllRooms = async () => {
    try {
      let response = await ApiRooms.getAll(token, vacationId);
      dispatch(roomsSlice.updateRoomsList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredRooms = rooms?.filter((room) => {
    if (searchTerm !== "") {
      return room.rooms_id.includes(searchTerm);
    } else {
      return room;
    }
  });

  const handleEditClick = (index, room) => {
    setActionStatus("edit");
    setEditRowIndex(index);
    setEditRowData(room);
  };

  const handleSaveClick = () => {
    if (actionStatus === "edit") {
      submit(editRowData);
    }
  };

  const handleAddRow = () => {
    setActionStatus("add");
    setFilteredRooms2((prevRooms) => [...prevRooms, { ...defaultNewRow }]);
    setEditRowIndex(filteredRooms2.length);
    setEditRowData({ ...defaultNewRow });
  };

  const handleInputChange = (field, value) => {
    setEditRowData((prevData) => ({ ...prevData, [field]: value }));
  };

  const submit = async (dataToUpdate) => {
    try {
      const response = await ApiRooms.updateRoom(
        token,
        dataToUpdate,
        vacationId
      );
      console.log(response)
      setFilteredRooms2([]);
      setEditRowIndex(null);
      setActionStatus("");
      setEditRowData(defaultNewRow);
      dispatch(roomsSlice.updateRoomsList(response.data));
      // dispatch(staticSlice.resetState());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRooms();
  }, []);

  return (
    <>
      <RoomView
        filteredRooms={filteredRooms}
        handleDialogTypeOpen={handleDialogTypeOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        submit={submit}
        handleEditClick={handleEditClick}
        handleSaveClick={handleSaveClick}
        handleAddRow={handleAddRow}
        handleInputChange={handleInputChange}
        filteredRooms2={filteredRooms2}
        editRowIndex={editRowIndex}
        actionStatus={actionStatus}
        editRowData={editRowData}
        headers={headers}
      />
    </>
  );
};

export default Rooms;
