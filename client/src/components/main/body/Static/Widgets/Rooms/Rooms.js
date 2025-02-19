import React, { useEffect, useState } from "react";
import RoomView from "./Rooms.view";
import ApiRooms from "../../../../../../apis/roomsRequest";
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../../../../store/slice/roomsSlice";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";


const Rooms = ({ handleDialogTypeOpen }) => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.roomsSlice.rooms);
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "מספר חדר",
    "סוג חדר",
    "קומה",
    "כיוון",
    "גודל",
    "קיבולת החדר",
    "תפוסה מקסימלית",
    "משויך",
    "מספר אנשים בחדר ",
    "ערוך",
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

  const handleEditClick = (index,room) => {
  dispatch(staticSlice.updateDetailsModalType("editRoom"))
   dispatch(staticSlice.openDetailsModal())
   dispatch(staticSlice.updateForm(room))
  };


  const handleExportToExcel = () => {
    const transformedData = filteredRooms.map((row) => {
      return {
        "מספר חדר": row.rooms_id,
        "סוג חדר": row.type,
        "קומה": row.floor,
        "כיוון": row.direction,
        "גודל": row.size,
        "קיבולת החדר": row.base_occupancy,
        "תפוסה מקסימלית": row.max_occupancy,
        "משויך":row.family_name
      };
    });
  
    const hebrewHeaders = [
      "מספר חדר",
      "סוג חדר",
      "קומה",
      "כיוון",
      "גודל",
      "קיבולת החדר",
      "תפוסה מקסימלית",
      "משויך"
    ];

    const ws = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "חדרים");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "חדרים.xlsx");
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
        handleEditClick={handleEditClick}
        headers={headers}
        handleExportToExcel={handleExportToExcel}

      />
       <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
    </>
  );
};

export default Rooms;
