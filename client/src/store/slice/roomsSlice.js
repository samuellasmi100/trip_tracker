import { createSlice } from "@reduxjs/toolkit";

export const roomsSlice = createSlice({
  name: "roomsSlice",
  initialState: {
    selectedRooms:[],
    rooms:[],
    selectedChildRoomId: null,
    expandedRoomId: null,
  },
  reducers: {
    addRoomToForm: (state, action) => {
  
      const roomExists = state.selectedRooms.some(
        (room) => room.rooms_id === action.payload.rooms_id
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
        (room) => room.rooms_id !== action.payload.rooms_id
      );
    },
    resetForm: (state) => {
      state.selectedRooms = []; 
    },
    updateChosenRoom: (state, action) => {
      state.selectedChildRoomId = action.payload;
      state.expandedRoomId = action.payload 
    },
    toggleExpandRoom: (state, action) => {
      state.expandedRoomId = state.expandedRoomId === action.payload ? null : action.payload;
    },
    resetChildRoom:(state, action) => {
      state.selectedChildRoomId = null
      state.expandedRoomId = null
    },
  },
  

});

export const { addRoomToForm,removeRoomFromForm,resetForm,
  updateRoomsList,updateSelectedRoomsList,updateChosenRoom,
  toggleExpandRoom ,resetChildRoom
} = roomsSlice.actions;

export default roomsSlice.reducer;
