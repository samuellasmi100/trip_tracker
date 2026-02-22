import React, { useState, useEffect, useRef, useCallback } from "react";
import GuestsView from "./Guests.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import ApiUser from "../../../../../../apis/userRequest";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as snackBarSlice from "../../../../../../store/slice/snackbarSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LIMIT = 50;

const Guests = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

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
      const res = await ApiStatic.getGuests(token, vacationId, searchTerm, LIMIT, currentOffset);
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
  const handleClose = () => setOpen(false);
  const handleDeleteButtonClick = (user) => { setSelectedUser(user); setOpen(true); };

  const headers = [
    "", "שם פרטי בעברית", "שם משפחה בעברית", "שם פרטי באנגלית", "שם משפחה באנגלית",
    "גיל", "מספר זהות", "מספר טלפון", "אימייל", "משתמש ראשי", "משויך לחדר", "מחק",
  ];

  const handleDeleteClick = async () => {
    try {
      if (selectedUser.is_main_user === 1) {
        await ApiUser.deleteMainGuests(token, selectedUser.family_id, vacationId);
      } else {
        await ApiUser.deleteGuests(token, selectedUser.user_id, vacationId);
      }
      setOpen(false);
      dispatch(snackBarSlice.setSnackBar({
        type: "success",
        message: `${selectedUser.hebrew_first_name} ${selectedUser.hebrew_last_name} נמחק בהצלחה`,
        timeout: 3000,
      }));
      offsetRef.current = 0;
      hasMoreRef.current = true;
      setRows([]);
      setHasMore(true);
      fetchData(searchRef.current, 0, false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportToExcel = () => {
    const transformedData = rows.map((row) => ({
      "שם פרטי בעברית": row.hebrew_first_name,
      "שם משפחה בעברית": row.hebrew_last_name,
      "שם פרטי באנגלית": row.english_first_name,
      "שם משפחה באנגלית": row.english_last_name,
      "גיל": row.age !== null ? row.age : "",
      "מספר זהות": row.identity_id,
      "מספר טלפון": row.phone_a || "",
      "אימייל": row.email,
      "משויך לחדר": row.room_id,
    }));
    const hebrewHeaders = ["שם פרטי בעברית","שם משפחה בעברית","שם פרטי באנגלית","שם משפחה באנגלית","גיל","מספר זהות","מספר טלפון","אימייל","משויך לחדר"];
    const ws = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "כלל האורחים");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "כלל האורחים.xlsx");
  };

  return (
    <>
      <GuestsView
        rows={rows}
        search={search}
        setSearch={setSearch}
        headers={headers}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleExportToExcel={handleExportToExcel}
        selectedUser={selectedUser}
        handleClose={handleClose}
        open={open}
        handleDeleteClick={handleDeleteClick}
        loading={loading}
        hasMore={hasMore}
        sentinelRef={sentinelRef}
      />
      <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
    </>
  );
};

export default Guests;
