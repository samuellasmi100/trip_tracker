import React, { useState, useEffect, useRef, useCallback } from "react";
import GeneralInfoView from "./GeneralInfo.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LIMIT = 50;

const GeneralInfo = () => {
  const vacationName = sessionStorage.getItem("vacName");
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState();

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const offsetRef = useRef(0);
  const searchRef = useRef("");
  const sentinelRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async (searchTerm, currentOffset, append) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await ApiStatic.getVacationDetails(token, vacationId, searchTerm, LIMIT, currentOffset);
      const { data, hasMore: more } = res.data;
      setRows(prev => append ? [...prev, ...data] : data);
      hasMoreRef.current = more;
      setHasMore(more);
      offsetRef.current = currentOffset + data.length;
    } catch (e) {
      console.log(e);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [token, vacationId]);

  useEffect(() => {
    searchRef.current = debouncedSearch;
    offsetRef.current = 0;
    hasMoreRef.current = true;
    setRows([]);
    setHasMore(true);
    fetchData(debouncedSearch, 0, false);
  }, [vacationId, debouncedSearch, fetchData]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
        fetchData(searchRef.current, offsetRef.current, true);
      }
    }, { threshold: 0.1, rootMargin: "100px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchData]);

  const closeDetailsModal = () => dispatch(staticSlice.closeDetailsModal());

  const filteredRows = rows.filter((user) => {
    if (selectedFilter === "טסים איתנו") return user.flights === "1";
    if (selectedFilter === "גיל") return user.age ? user.age > 3 : user.default_age && user.default_age > 3;
    return true;
  });

  const headers = [
    "", "חופשה", "מסלול", "תאריכים", "משויך לחדר", "קבוצה", "משתמש ראשי",
    "שם פרטי בעברית", "שם משפחה בעברית", "שם פרטי באנגלית", "שם משפחה באנגלית",
    "תאריך לידה", "מספר זהות", "מספר טלפון", "אימייל", "גיל", "תואר",
    "כולל טיסות", "טסים איתנו", "סוג טיסה", "מספר דרכון", "תוקף",
    "תאריך טיסה הלוך", "תאריך טיסה חזור", "מספר טיסה הלוך", "מספר טיסה חזור",
    "חברת תעופה הלוך", "חברת תעופה חזור", "עלות חופשה", "סכום הנשאר לתשלום",
    "מטבע תשלום", "צורת תשלום",
  ];

  const sanitizeSheetName = (name) => name.replace(/[\\/:*?[\]]/g, "_");

  const handleExportToExcel = () => {
    const transformedData = rows.map((row) => ({
      "חופשה": vacationName,
      "מסלול": row.week_chosen,
      "תאריכים": row.date_chosen,
      "משויך לחדר": row.room_id,
      "קבוצה": row.hebrew_first_name + " " + row.hebrew_last_name,
      "שם פרטי בעברית": row.hebrew_first_name,
      "שם משפחה בעברית": row.hebrew_last_name,
      "שם פרטי באנגלית": row.english_first_name,
      "שם משפחה באנגלית": row.english_last_name,
      "תאריך לידה": row.birth_date === null ? row.defaule_birth_date : row.birth_date,
      "מספר זהות": row.identity_id,
      "מספר טלפון": row.phone_a || "",
      "אימייל": row.email,
      "גיל": row.age === null ? row.default_age : row.age,
      "תואר": row.user_classification,
      "כולל טיסות": row.flights === "1" ? "כן" : "לא",
      "טסים איתנו": row.flying_with_us === 1 ? "כן" : "לא",
      "סוג טיסה": row.flights_direction === "round_trip" ? "הלוך חזור" : row.flights_direction === "one_way_outbound" ? "הלוך בלבד" : row.flights_direction === "one_way_return" ? "חזור בלבד" : "",
      "מספר דרכון": row.passport_number,
      "תוקף": row.validity_passport,
      "תאריך טיסה הלוך": row.outbound_flight_date,
      "תאריך טיסה חזור": row.return_flight_date,
      "מספר טיסה הלוך": row.outbound_flight_number,
      "מספר טיסה חזור": row.return_flight_number,
      "חברת תעופה הלוך": row.outbound_airline,
      "חברת תעופה חזור": row.return_airline,
      "עלות חופשה": row.total_amount,
      "סכום הנשאר לתשלום": row.remains_to_be_paid,
      "מטבע תשלום": row.payment_currency,
      "צורת תשלום": row.form_of_payment,
    }));
    const ws = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.sheet_add_aoa(ws, [headers.slice(1)], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = headers.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    const sanitizedVacationName = sanitizeSheetName(vacationName || "");
    XLSX.utils.book_append_sheet(wb, ws, `מידע כולל ${sanitizedVacationName}`.slice(0, 31));
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), `מידע כולל ${sanitizedVacationName}.xlsx`);
  };

  return (
    <>
      <GeneralInfoView
        rows={filteredRows}
        search={search}
        setSearch={setSearch}
        headers={headers}
        handleExportToExcel={handleExportToExcel}
        setSelectedFilter={setSelectedFilter}
        selectedFilter={selectedFilter}
        loading={loading}
        hasMore={hasMore}
        sentinelRef={sentinelRef}
      />
      <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
    </>
  );
};

export default GeneralInfo;
