import React, { useState,useEffect } from "react";
import MainGuestsView from "./MainGuests.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver"

const MainGuests = (props) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.staticSlice.form);
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const mainGuests = useSelector((state) => state.staticSlice.mainGuests);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "שם פרטי בעברית",
    "שם משפחה בעברית",
    "שם פרטי באנגלית",
    "שם משפחה באנגלית",
    "מספר זהות",
    "מספר טלפון",
    "אימייל",
    "מחק"
  ];

  const filteredainGuests = mainGuests?.filter((user) => {
    if (searchTerm !== "") {
      return user.hebrew_first_name.includes(searchTerm) || user.hebrew_last_name.includes(searchTerm) || user.identity_id.includes(searchTerm) ;
    } else {
      return user;
    }
  });




  const getMainGuests = async () => {
    try {
      const response = await ApiStatic.getMainGuests(token,vacationId)
        dispatch(staticSlice.updateMainGuests(response.data))
    } catch (error) {
      console.log(error)
    }
  }
 

  const handleExportToExcel = () => {
    const transformedData = filteredainGuests.map((row) => {
      return {
        "שם פרטי בעברית": row.hebrew_first_name,
        "שם משפחה בעברית": row.hebrew_last_name,
        "שם פרטי באנגלית": row.english_first_name,
        "שם משפחה באנגלית": row.english_last_name,
        "מספר זהות": row.identity_id,
        "מספר טלפון": row.phone_a !== null && row.phone_b !== null ? row.phone_a + row.phone_b : "",
        "אימייל": row.email
      };
    });
  
    const hebrewHeaders = [
      "שם פרטי בעברית",
      "שם משפחה בעברית",
      "שם פרטי באנגלית",
      "שם משפחה באנגלית",
      "מספר זהות",
      "מספר טלפון",
      "אימייל"
    ];
  
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "נרשמים");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "נרשמים.xlsx");
  };


  useEffect(() => {
    getMainGuests()
  }, [])
  return (
  <>
  <MainGuestsView
  filteredainGuests={filteredainGuests}
  searchTerm={searchTerm}
  headers={headers}
  setSearchTerm={setSearchTerm}
  handleExportToExcel={handleExportToExcel}
   />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default MainGuests;
