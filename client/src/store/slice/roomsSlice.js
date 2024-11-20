import { createSlice } from "@reduxjs/toolkit";

export const roomsSlice = createSlice({
  name: "roomsSlice",
  initialState: {
    selectedRooms:[],
    rooms:[]
  },
  reducers: {
    addRoomToForm: (state, action) => {
      const roomExists = state.selectedRooms.some(
        (room) => room.roomId === action.payload.roomId
      );
      if (!roomExists) {
        state.selectedRooms.push(action.payload);
      }
    },
  
    updateRoomsList: (state, action) => {
      state.rooms = action.payload;
    },
    updateSelectedRoomsList: (state, action) => {
      state.selectedRooms = action.payload;
    },
    removeRoomFromForm: (state, action) => {
      state.selectedRooms = state.selectedRooms.filter(
        (room) => room.roomId !== action.payload.roomId
      );
    },
    resetForm: (state) => {
      state.selectedRooms = []; // Clear all rooms from the form
    },
  },
  

});

export const { addRoomToForm,removeRoomFromForm,resetForm,updateRoomsList,updateSelectedRoomsList } = roomsSlice.actions;

export default roomsSlice.reducer;
