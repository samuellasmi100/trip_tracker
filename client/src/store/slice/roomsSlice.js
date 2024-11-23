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
      state.selectedRooms = []; 
    },
    updateChossenRoom: (state, action) => {
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
  updateRoomsList,updateSelectedRoomsList,updateChossenRoom,
  toggleExpandRoom ,resetChildRoom
} = roomsSlice.actions;

export default roomsSlice.reducer;
