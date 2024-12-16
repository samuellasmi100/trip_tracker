import React, { useState, useEffect } from "react";
import GeneralInfoView from "./GeneralInfo.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import * as vacationSlice from "../../../../../../store/slice/vacationSlice"
import * as dialogSlice from "../../../../../../store/slice/dialogSlice"
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const GeneralInfo = (props) => {
  const vacationName = sessionStorage.getItem("vacName")
  const dispatch = useDispatch();
  const form = useSelector((state) => state.staticSlice.form);
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const vacationDetails = useSelector((state) => state.staticSlice.mainData);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);
  const [selectedFilter, setSelectedFilter] = useState();

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "",
    "חופשה",
    "מסלול",
    "תאריכים",
    "משויך לחדר",
    "קבוצה",
    "משתמש ראשי",
    "שם פרטי בעברית",
    "שם משפחה בעברית",
    "שם פרטי באנגלית",
    "שם משפחה באנגלית",
    "תאריך לידה",
    "מספר זהות",
    "מספר טלפון",
    "אימייל",
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
    "עלות חופשה",
    "סכום הנשאר לתשלום",
    "מטבע תשלום",
    "צורת תשלום",
  ];

  const filteredVacationDetails = vacationDetails?.filter((flight) => {
    const matchesSearchTerm = searchTerm
      ? flight.hebrew_first_name?.includes(searchTerm)
      : true;
    const matchesSelectedFilter = selectedFilter === "טסים איתנו"
      ? flight.flights === "1"
      : selectedFilter === "גיל"
        ? (flight.age ? flight.age > 3 : flight.default_age && flight.default_age > 3)
        : true;

    return matchesSearchTerm && matchesSelectedFilter;
  });

  const getVacationDetails = async () => {
    try {
      const response = await ApiStatic.getVacationDetails(token, vacationId)
      dispatch(staticSlice.updateMainData(response.data))
    } catch (error) {
      console.log(error)
    }
  }

  const sanitizeSheetName = (name) => {
    return name.replace(/[\\/:*?[\\]]/g, "_");
  }

  const handleExportToExcel = () => {
    const transformedData = vacationDetails.map((row) => {
      return {
        "חופשה":vacationName,
        "מסלול": row.week_chosen,
        "תאריכים": row.date_chosen,
        "משויך לחדר": row.room_id,
        "קבוצה": row.hebrew_first_name + " " + row.hebrew_last_name,
        "שם פרטי בעברית": row.hebrew_first_name,
        "שם משפחה בעברית": row.hebrew_last_name,
        "שם פרטי באנגלית": row.english_first_name,
        "שם משפחה באנגלית": row.english_first_name,
        "תאריך לידה": row.birth_date,
        "מספר זהות": row.identity_id,
        "מספר טלפון": row.phone_a !== null && row.phone_b !== null ? row.phone_a + row.phone_b : "",
        "אימייל": row.email,
        "גיל": row.age === null ? row.default_age : row.age,
        "תואר": row.user_classification,
        "כולל טיסות": row.flights === "1" ? 'כן' : "לא",
        "טסים איתנו": row.flying_with_us === 1 ? 'כן' : "לא",
        "סוג טיסה": row.flights_direction === "round_trip" ? "הלוך חזור" : row.flights_direction === "one_way_outbound" ? "הלוך בלבד" : row.flights_direction === "one_way_return" ? "חזור בלבד" : "",
        "מספר דרכון": row.passport_number,
        "תוקף": row.validity_passport,
        "תאריך טיסה הלוך": row.outbound_flight_date,
        "תאריך טיסה חזור": row.return_flight_date,
        "מספר טיסה הלוך ": row.outbound_flight_number,
        "מספר טיסה חזור": row.return_flight_number,
        "חברת תעופה הלוך": row.outbound_airline,
        "חברת תעופה חזור": row.return_airline,
        "עלות חופשה": row.total_amount,
        "סכום הנשאר לתשלום": row.remains_to_be_paid,
        "מטבע תשלום": row.payment_currency,
        "צורת תשלום": row.form_of_payment,
      };
    });

    const hebrewHeaders = [
      "חופשה",
      "מסלול",
      "תאריכים",
      "משויך לחדר",
      "קבוצה",
      "שם פרטי בעברית",
      "שם משפחה בעברית",
      "שם פרטי באנגלית",
      "שם משפחה באנגלית",
      "תאריך לידה",
      "מספר זהות",
      "מספר טלפון",
      "אימייל",
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
      "עלות חופשה",
      "סכום הנשאר לתשלום",
      "מטבע תשלום",
      "צורת תשלום",
    ];

    const ws = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    const sanitizedVacationName = sanitizeSheetName(vacationName);
    XLSX.utils.book_append_sheet(wb, ws, `מידע כולל ${sanitizedVacationName}`);
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `מידע כולל ${sanitizedVacationName}.xlsx`);
  };

  const handleSelectedChange = () => {

  }

  useEffect(() => {
    getVacationDetails()
  }, [])
  return (
    <>
      <GeneralInfoView
        filteredVacationDetails={filteredVacationDetails}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        headers={headers}
        handleExportToExcel={handleExportToExcel}
        handleSelectedChange={handleSelectedChange}
        setSelectedFilter={setSelectedFilter}
        selectedFilter={selectedFilter}

      />
      <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
    </>
  )
};

export default GeneralInfo;
