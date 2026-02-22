import React, { useState, useEffect, useRef, useCallback } from "react";
import MainGuestsView from "./MainGuests.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ApiUser from "../../../../../../apis/userRequest";
import * as snackBarSlice from "../../../../../../store/slice/snackbarSlice";

const LIMIT = 50;

const MainGuests = () => {
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async (searchTerm, currentOffset, append) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await ApiStatic.getMainGuests(token, vacationId, searchTerm, LIMIT, currentOffset);
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

  // Reset + refetch on vacation change or search change
  useEffect(() => {
    searchRef.current = debouncedSearch;
    offsetRef.current = 0;
    hasMoreRef.current = true;
    setRows([]);
    setHasMore(true);
    fetchData(debouncedSearch, 0, false);
  }, [vacationId, debouncedSearch, fetchData]);

  // Infinite scroll sentinel
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
    "", "שם משפחה", "כמות נרשמים", "נמצאים במערכת", "חסרים", "מספר טלפון", "אימייל", "מספר זהות", "מחק",
  ];

  const handleDeleteClick = async () => {
    try {
      await ApiUser.deleteMainGuests(token, selectedUser.family_id, vacationId);
      setOpen(false);
      dispatch(snackBarSlice.setSnackBar({
        type: "success",
        message: `${selectedUser.hebrew_first_name} ${selectedUser.hebrew_last_name} נמחק בהצלחה`,
        timeout: 3000,
      }));
      // Refetch from scratch
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
      "שם משפחה": row.family_name,
      "כמות נרשמים": row.number_of_guests,
      "נמצאים במערכת": row.user_in_system_count,
      "חסרים": Math.max(Number(row.number_of_guests) - Number(row.user_in_system_count), 0) || "",
      "מספר טלפון": row.phone_a || "",
      "אימייל": row.email || "",
      "מספר זהות": row.identity_id || "",
    }));
    const hebrewHeaders = ["שם משפחה","כמות נרשמים","נמצאים במערכת","חסרים","מספר טלפון","אימייל","מספר זהות"];
    const ws = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "נרשמים");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "נרשמים.xlsx");
  };

  return (
    <>
      <MainGuestsView
        rows={rows}
        search={search}
        setSearch={setSearch}
        headers={headers}
        handleExportToExcel={handleExportToExcel}
        handleDeleteButtonClick={handleDeleteButtonClick}
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

export default MainGuests;
