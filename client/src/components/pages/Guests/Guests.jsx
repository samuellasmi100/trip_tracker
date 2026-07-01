import React, { useState, useEffect, useRef, useCallback } from "react";
import GuestsView from "./Guests.view";
import * as staticSlice from "../../../store/slices/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../apis/staticRequest";
import ApiUser from "../../../apis/userRequest";
import ApiGuestImport from "../../../apis/guestImportRequest";
import GuestImportDialog from "./GuestImportDialog/GuestImportDialog";
import EditOrUpdateDialog from "../../shared/EditDialog/EditOrUpdateDialog";
import * as snackBarSlice from "../../../store/slices/snackbarSlice";
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

  // Guest Excel import (raw .xlsx → server parses borders) + its report dialog.
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const importFileInputRef = useRef(null);

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
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "מחיקת האורח נכשלה, נסה שוב", timeout: 4000 }));
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
      "מספר טלפון": row.phone || row.phone_a || "",
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

  // Open the OS file picker (guarding against a missing vacation / a run already
  // in progress), then upload the chosen workbook to the server.
  const handleImportClick = () => {
    if (importing) return;
    if (!vacationId) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "בחר חופשה לפני ייבוא", timeout: 3000 }));
      return;
    }
    importFileInputRef.current?.click();
  };

  const handleImportFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so re-picking the same file fires onChange again
    if (!file) return;
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "יש להעלות קובץ אקסל (xlsx)", timeout: 4000 }));
      return;
    }
    setImportError(null);
    setImportResult(null);
    setImporting(true);
    setImportDialogOpen(true);
    try {
      const res = await ApiGuestImport.importGuests(token, vacationId, file);
      setImportResult(res.data);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "הייבוא נכשל. ודא שהקובץ בפורמט הנכון ונסה שוב.";
      setImportError(msg);
    } finally {
      setImporting(false);
    }
  };

  const closeImportDialog = () => {
    setImportDialogOpen(false);
    setImportResult(null);
    setImportError(null);
    // Surface the newly-imported guests by refetching the list from scratch.
    offsetRef.current = 0;
    hasMoreRef.current = true;
    setRows([]);
    setHasMore(true);
    fetchData(searchRef.current, 0, false);
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
        handleImportClick={handleImportClick}
        importFileInputRef={importFileInputRef}
        handleImportFileChange={handleImportFileChange}
        importing={importing}
        selectedUser={selectedUser}
        handleClose={handleClose}
        open={open}
        handleDeleteClick={handleDeleteClick}
        loading={loading}
        hasMore={hasMore}
        sentinelRef={sentinelRef}
      />
      <GuestImportDialog
        open={importDialogOpen}
        onClose={closeImportDialog}
        importing={importing}
        error={importError}
        result={importResult}
      />
      <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
    </>
  );
};

export default Guests;
