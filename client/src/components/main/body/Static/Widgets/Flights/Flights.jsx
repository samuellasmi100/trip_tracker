import React, { useState,useEffect } from "react";
import FlightsView from "./Flights.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import * as vacationSlice from "../../../../../../store/slice/vacationSlice"
import * as dialogSlice from "../../../../../../store/slice/dialogSlice"
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Flights = (props) => {

  const dispatch = useDispatch();
  const form = useSelector((state) => state.staticSlice.form);
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const flightDetails = useSelector((state) => state.staticSlice.mainData);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "שם פרטי בעברית",
    "שם משפחה בעברית",
    "שם פרטי באנגלית",
    "שם משפחה באנגלית",
    "קבוצה",
    "תאריך לידה",
    "גיל",
    "תואר",
    "כולל טיסות",
    "טסים איתנו",
    "סוג טיסה",
    "מספר דרכון",
    "תוקף",
    "תאריך טיסה הלוך",
    "תאריך טיסה חזור",
    "מספר טיסה הלוך ",
    "מספר טיסה חזור",
    "חברת תעופה הלוך",
    "חברת תעופה חזור",
  ];

  const filteredFlightDetails = flightDetails?.filter((flight) => {
    if (searchTerm !== "") {
      return flight.hebrew_first_name.includes(searchTerm);
    } else {
      return flight;
    }
  });


  const getFlightsDetails = async () => {
    try {
      const response = await ApiStatic.getFlightsDetails(token,vacationId)
      dispatch(staticSlice.updateMainData(response.data))
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  const handleExportToExcel = () => {
    const transformedData = flightDetails.map((row) => {
      return {
     "שם פרטי בעברית":row.hebrew_first_name,
      "שם משפחה בעברית":row.hebrew_last_name,
      "שם פרטי באנגלית":row.english_first_name,
      "שם משפחה באנגלית":row.english_first_name,
      "קבוצה":row.hebrew_first_name + " " + row.hebrew_last_name,
      "תאריך לידה":row.birth_date,
      "גיל":row.age === null ? row.default_age : row.age,
      "תואר":row.user_classification,
      "כולל טיסות":row.flights === "1" ? 'כן': "לא",
      "טסים איתנו":row.flying_with_us === 1 ? 'כן': "לא",
      "סוג טיסה":row.flights_direction === "round_trip" ? "הלוך חזור":row.flights_direction === "one_way_outbound" ? "הלוך בלבד" : row.flights_direction === "one_way_return" ? "חזור בלבד" : "",
      "מספר דרכון":row.passport_number,
      "תוקף":row.validity_passport,
      "תאריך טיסה הלוך":row.outbound_flight_date,
      "תאריך טיסה חזור":row.return_flight_date,
      "מספר טיסה הלוך ":row.outbound_flight_number,
      "מספר טיסה חזור":row.return_flight_number,
      "חברת תעופה הלוך":row.outbound_airline,
      "חברת תעופה חזור":row.return_airline,
      };
    });
  
    const hebrewHeaders = [
      "שם פרטי בעברית",
      "שם משפחה בעברית",
      "שם פרטי באנגלית",
      "שם משפחה באנגלית",
      "קבוצה",
      "תאריך לידה",
      "גיל",
      "תואר",
      "כולל טיסות",
      "טסים איתנו",
      "סוג טיסה",
      "מספר דרכון",
      "תוקף",
      "תאריך טיסה הלוך",
      "תאריך טיסה חזור",
      "מספר טיסה הלוך ",
      "מספר טיסה חזור",
      "חברת תעופה הלוך",
      "חברת תעופה חזור",
    ];
  
    const ws = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "טיסות");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "טיסות.xlsx");
  };


  useEffect(() => {
    getFlightsDetails()
  }, [])
  return (
  <>
  <FlightsView
  filteredFlightDetails={filteredFlightDetails}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  headers={headers}
  handleExportToExcel={handleExportToExcel}
   />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default Flights;
