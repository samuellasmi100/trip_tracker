import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainDialog from "../../shared/MainDialog/MainDialog";
import PaymentDialog from "../../shared/Payments/Payments";
import SendRegistrationDialog from "./SendRegistrationDialog/SendRegistrationDialog";
import { useDispatch, useSelector } from "react-redux";
import ApiUser from "../../../apis/userRequest"
import ApiVacations from "../../../apis/vacationRequest"
import ApiDocuments from "../../../apis/documentsRequest"
import ApiSignatures from "../../../apis/signaturesRequest"
import ApiBookings from "../../../apis/bookingsRequest"
import ApiRegistrations from "../../../apis/registrationsRequest"
import { connectSocket, getSocket } from "../../../utils/socketService";
import FamilyListView from "./FamilyList.view";
import * as userSlice from "../../../store/slices/userSlice";
import * as dialogSlice from "../../../store/slices/dialogSlice";
import * as flightsSlice from "../../../store/slices/flightsSlice";
import * as roomsSlice from "../../../store/slices/roomsSlice";
import * as notesSlice from "../../../store/slices/notesSlice";
import * as paymentsSlice from "../../../store/slices/paymentsSlice";
import * as staticSlice from "../../../store/slices/staticSlice";
import * as vacationSlice from "../../../store/slices/vacationSlice";
import * as snackBarSlice from "../../../store/slices/snackbarSlice";
import { isoToDisplay } from "../../../utils/helpers/formatDate";
import { v4 as uuidv4 } from "uuid";

const PAGE_SIZE = 30;

const FamilyList = () => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId)
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dialogOpen = useSelector((state) => state.dialogSlice.open)
  const dialogType = useSelector((state) => state.dialogSlice.type)
  const token = sessionStorage.getItem('token')
  const chosenFamily = useSelector((state) => state.userSlice.family)
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates)
  const [docStatusMap, setDocStatusMap] = useState({});
  const [copiedFamilyId, setCopiedFamilyId] = useState(null);
  const [sigStatusMap, setSigStatusMap] = useState({});
  const [sigCopiedId, setSigCopiedId] = useState(null);
  const [bookingStatusMap, setBookingStatusMap] = useState({});
  const [bookingCopiedId, setBookingCopiedId] = useState(null);
  // Dialog state for the new send-registration-link modal. Opens on a
  // successful POST /registrations/:vacationId; closed by the user.
  const [registrationDialog, setRegistrationDialog] = useState({ open: false, data: null });
  const [selectedBooking, setSelectedBooking] = useState({ open: false, familyId: null, data: null });

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Refs used by the scroll handler to avoid stale closures
  const tableWrapRef = useRef(null);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const pageRef = useRef(1);
  const searchTermRef = useRef("");
  const debouncedSearchTimer = useRef(null);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);
  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { searchTermRef.current = searchTerm; }, [searchTerm]);

  // ── Core paginated loader ─────────────────────────────────────────────────
  const loadPage = useCallback(async (pageNum, search) => {
    if (!vacationId) return;
    const isFirst = pageNum === 1;
    isFirst ? setLoading(true) : setLoadingMore(true);
    try {
      const response = await ApiUser.getFamilyList(token, vacationId, { page: pageNum, search });
      const { rows = [], total = 0 } = response.data;
      const more = pageNum * PAGE_SIZE < total;
      setHasMore(more);
      setPage(pageNum);
      setUsersData(prev => isFirst ? rows : [...prev, ...rows]);
      if (isFirst) dispatch(userSlice.updateFamiliesList(rows));
    } catch (error) {
      console.log(error);
    } finally {
      isFirst ? setLoading(false) : setLoadingMore(false);
    }
  }, [vacationId, token]);

  // Re-fetch the guests array for a given family and push it into Redux.
  // Single source of truth for "load this family's guests" — used by:
  //   - handleNameClick (drawer open)
  //   - getChosenFamily (deep-link landing)
  //   - closeModal (defensive: every editor close, so the drawer's toggle
  //     visuals always reflect fresh DB state — covers the race where
  //     GuestEditor's internal post-save refreshGuests fails silently)
  // Quiet by design: no spinner, no toast. Callers wrap with their own
  // loading UI when they want one (the drawer-open path does).
  const reloadFamilyGuests = useCallback(async (familyId) => {
    if (!familyId || !vacationId) return;
    try {
      const response = await ApiUser.getUserFamilyList(token, familyId, vacationId);
      dispatch(userSlice.updateGuest(response.data?.length > 0 ? response.data : []));
    } catch (error) {
      console.log(error);
    }
  }, [token, vacationId, dispatch]);

  // Background refresh after a dialog closes: swap fresh page-1 rows in place
  // WITHOUT blanking the table or flipping the loading spinner, so the main page
  // doesn't flash/jump. React reconciles by key, so unchanged rows stay put and
  // only changed values (e.g. a family's guest count) update quietly.
  const silentRefresh = useCallback(async () => {
    if (!vacationId) return;
    try {
      const response = await ApiUser.getFamilyList(token, vacationId, { page: 1, search: searchTermRef.current });
      const { rows = [], total = 0 } = response.data;
      setHasMore(PAGE_SIZE < total);
      setPage(1);
      setUsersData(rows);
      dispatch(userSlice.updateFamiliesList(rows));
    } catch (error) {
      console.log(error);
    }
  }, [vacationId, token, dispatch]);

  // ── Real-time refresh on new_registration ────────────────────────────────
  // When a family submits the public registration form, the server emits
  // new_registration to the 'coordinators' room. Refresh the visible row so
  // the "ממתין" badge flips to "נחתם" without a manual reload.
  //
  // We call `connectSocket(token)` here (not `getSocket()`) because of the
  // React effect order: child effects run BEFORE parent effects on initial
  // mount, so when this useEffect runs, App.jsx hasn't called connectSocket
  // yet and `getSocket()` would return null. `connectSocket` is idempotent
  // (returns the existing connected socket, or creates one), so it's safe to
  // call from both places — App.jsx and here will end up with the same
  // socket singleton, both subscribing handlers to it.
  useEffect(() => {
    if (!vacationId || !token) return;
    const socket = connectSocket(token);
    if (!socket) return;
    const handler = (notification) => {
      if (String(notification?.vacation_id) === String(vacationId)) {
        silentRefresh();
      }
    };
    socket.on("new_registration", handler);
    return () => socket.off("new_registration", handler);
  }, [vacationId, token, silentRefresh]);

  // ── Infinite scroll — attach once, use refs for live values ──────────────
  useEffect(() => {
    const el = tableWrapRef.current;
    if (!el) return;
    const onScroll = () => {
      if (
        el.scrollHeight - el.scrollTop - el.clientHeight < 150 &&
        hasMoreRef.current &&
        !loadingMoreRef.current
      ) {
        loadPage(pageRef.current + 1, searchTermRef.current);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [loadPage]);

  // ── Debounced server-side search ──────────────────────────────────────────
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    clearTimeout(debouncedSearchTimer.current);
    debouncedSearchTimer.current = setTimeout(() => {
      setUsersData([]);
      setPage(1);
      setHasMore(false);
      loadPage(1, value);
    }, 300);
  }, [loadPage]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const closeModal = () => {
    dispatch(dialogSlice.initialActiveButton())
    dispatch(dialogSlice.initialDialogType())
    dispatch(dialogSlice.closeModal())
    clearModalForms()
    dispatch(roomsSlice.resetChildRoom())
    // Defensive re-fetch of the drawer's guests so any DB change made via
    // the just-closed editor (incl. our atomic clearOtherMainUsers) is
    // reflected in Redux before the user can trigger another action
    // (e.g. "send registration link") that relies on this state.
    if (chosenFamily?.family_id) reloadFamilyGuests(chosenFamily.family_id);
  };

  const clearModalForms = () => {
    dispatch(userSlice.resetForm())
    dispatch(flightsSlice.resetForm())
    dispatch(roomsSlice.resetForm())
    dispatch(notesSlice.resetForm())
    dispatch(paymentsSlice.resetForm())
  }

  const handleDialogTypeOpen = (type, userData) => {
    dispatch(dialogSlice.updateDialogType(type))
    if (type === "addParent") {
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateParent([]))
    } else if (type === "editParent") {
      if (userData !== undefined) {
        dispatch(userSlice.updateForm(userData))
        dispatch(userSlice.updateParent(userData))
        dispatch(userSlice.updateUserType("parent"))
      }
      dispatch(dialogSlice.openModal())
    } else if (type === "addChild") {
      dispatch(userSlice.updateParent(userData))
      dispatch(userSlice.updateUserType("parent"))
      dispatch(dialogSlice.openModal())
    } else if (type === "editChild") {
      dispatch(userSlice.updateUserType("child"))
      dispatch(userSlice.updateForm(userData))
      dispatch(userSlice.updateChild(userData))
      dispatch(dialogSlice.openModal())
    } else if (type === "childDetails") {
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    } else if (type === "parentDetails") {
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    } else if (type === "uploadFile") {
      dispatch(dialogSlice.updateActiveButton("העלה קובץ"))
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    }
  };

  const handleNameClick = async (user) => {
    dispatch(userSlice.updateFamily(user))
    dispatch(userSlice.updateGuest([]))  // clear stale guests immediately
    setDrawerOpen(true);                 // open drawer instantly, don't wait for API
    setGuestsLoading(true);
    await reloadFamilyGuests(user.family_id);
    setGuestsLoading(false);
  }

  const getChosenFamily = async () => {
    if (!chosenFamily?.family_id) return;
    dispatch(userSlice.updateFamily(chosenFamily))
    await reloadFamilyGuests(chosenFamily.family_id);
  }

  // Edit family dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFamilyData, setEditFamilyData] = useState({});

  const openEditFamily = useCallback((e, user) => {
    e.stopPropagation();
    const matchedWeek = vacationsDates?.find(
      (d) => d.start_date === user.start_date && d.end_date === user.end_date
    );
    setEditFamilyData({
      family_id: user.family_id,
      family_name: user.family_name || "",
      number_of_guests: user.number_of_guests || "",
      number_of_rooms: user.number_of_rooms || "",
      total_amount: user.total_amount || "",
      payment_method: user.payment_method || "",
      num_payments: user.num_payments != null ? String(user.num_payments) : "",
      start_date: isoToDisplay(user.start_date) || "",
      end_date: isoToDisplay(user.end_date) || "",
      week_chosen: matchedWeek?.name || "",
    });
    setEditDialogOpen(true);
  }, [vacationsDates]);

  const closeEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditFamilyData({});
  }, []);

  const handleEditFamilyChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditFamilyData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleEditWeekChange = useCallback((e) => {
    const value = e.target.value;
    const found = vacationsDates?.find((d) => d.name === value);
    if (found && found.name !== "חריגים") {
      setEditFamilyData((prev) => ({
        ...prev,
        week_chosen: value,
        start_date: isoToDisplay(found.start_date) || "",
        end_date: isoToDisplay(found.end_date) || "",
      }));
    } else {
      setEditFamilyData((prev) => ({
        ...prev,
        week_chosen: value,
        start_date: "",
        end_date: "",
      }));
    }
  }, [vacationsDates]);

  const handleEditFamilySubmit = useCallback(async () => {
    try {
      await ApiUser.updateFamily(token, editFamilyData, vacationId);
      setEditDialogOpen(false);
      setEditFamilyData({});
      silentRefresh();
    } catch (error) {
      console.log(error);
      // 409 HAS_ROOM_ASSIGNMENTS = server refused because the family still
      // holds rooms and dates would change. Surface the server's precise
      // Hebrew message so the user knows what to do (remove rooms first).
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;
      let message;
      if (status === 409) {
        message = serverMessage || "לא ניתן לשנות תאריכים כל עוד המשפחה משובצת לחדרים. יש לבטל את השיבוץ תחילה.";
      } else if (status === 400) {
        message = serverMessage || "תאריכי שהייה לא תקינים";
      } else {
        message = "עדכון פרטי המשפחה נכשל, נסה שוב";
      }
      dispatch(snackBarSlice.setSnackBar({ type: "error", message, timeout: 5000 }));
    }
  }, [token, editFamilyData, vacationId, silentRefresh, dispatch]);

  // Add family dialog state — reuses the edit-family dialog layout.
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addFamilyData, setAddFamilyData] = useState({});

  const openAddFamily = useCallback(() => {
    setAddFamilyData({});
    setAddDialogOpen(true);
  }, []);

  const closeAddDialog = useCallback(() => {
    setAddDialogOpen(false);
    setAddFamilyData({});
  }, []);

  const handleAddFamilyChange = useCallback((e) => {
    const { name, value } = e.target;
    setAddFamilyData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAddWeekChange = useCallback((e) => {
    const value = e.target.value;
    const found = vacationsDates?.find((d) => d.name === value);
    if (found && found.name !== "חריגים") {
      setAddFamilyData((prev) => ({
        ...prev,
        week_chosen: value,
        start_date: isoToDisplay(found.start_date) || "",
        end_date: isoToDisplay(found.end_date) || "",
      }));
    } else {
      setAddFamilyData((prev) => ({
        ...prev,
        week_chosen: value,
        start_date: "",
        end_date: "",
      }));
    }
  }, [vacationsDates]);

  const handleAddFamilySubmit = useCallback(async () => {
    if (!addFamilyData.family_name || addFamilyData.family_name.trim() === "") {
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "שם משפחה / קבוצה הוא חובה", timeout: 3000 }));
      return;
    }
    try {
      const newFamilyId = uuidv4();
      // The add (POST) endpoint reads dates from arrival_date/departure_date and
      // converts them to start_date/end_date server-side, so map the dialog's
      // start_date/end_date back to those keys before sending.
      const form = {
        family_name: addFamilyData.family_name,
        number_of_guests: addFamilyData.number_of_guests || "",
        number_of_rooms: addFamilyData.number_of_rooms || "",
        total_amount: addFamilyData.total_amount || "",
        payment_method: addFamilyData.payment_method || "",
        num_payments: addFamilyData.num_payments || "",
        week_chosen: addFamilyData.week_chosen || "",
        arrival_date: addFamilyData.start_date || "",
        departure_date: addFamilyData.end_date || "",
      };
      await ApiUser.addFamily(token, form, newFamilyId, vacationId);
      setAddDialogOpen(false);
      setAddFamilyData({});
      silentRefresh();
      dispatch(snackBarSlice.setSnackBar({ type: "success", message: "משפחה נוספה בהצלחה", timeout: 3000 }));
    } catch (error) {
      console.log(error);
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;
      const message = status === 400
        ? (serverMessage || "תאריכי שהייה לא תקינים")
        : "הוספת המשפחה נכשלה, נסה שוב";
      dispatch(snackBarSlice.setSnackBar({ type: "error", message, timeout: 5000 }));
    }
  }, [token, addFamilyData, vacationId, silentRefresh, dispatch]);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDialogFamily, setPaymentDialogFamily] = useState(null);

  const handlePaymentClick = useCallback((user) => {
    setPaymentDialogFamily({
      family_id:    user.family_id,
      family_name:  user.family_name,
      total_amount: user.total_amount || "0",
    });
    setPaymentDialogOpen(true);
  }, []);

  const fetchDocStatus = useCallback(async () => {
    if (!vacationId) return;
    try {
      const res = await ApiDocuments.getAllFamiliesStatus(token, vacationId);
      const map = {};
      (res.data || []).forEach((row) => {
        map[row.family_id] = {
          uploaded: Number(row.uploaded_count) || 0,
          total: Number(row.total_required) || 0,
        };
      });
      setDocStatusMap(map);
    } catch (e) { /* non-fatal */ }
  }, [vacationId, token]);

  const fetchSigStatus = useCallback(async () => {
    if (!vacationId) return;
    try {
      const res = await ApiSignatures.getAllStatus(token, vacationId);
      const map = {};
      (res.data || []).forEach((row) => { map[row.family_id] = row; });
      setSigStatusMap(map);
    } catch (e) { /* non-fatal */ }
  }, [vacationId, token]);

  const handleSendSignatureLink = useCallback(async (e, user) => {
    e.stopPropagation();
    if (!vacationId) return;
    try {
      await ApiSignatures.markSent(token, vacationId, user.family_id);
      setSigStatusMap((prev) => ({
        ...prev,
        [user.family_id]: {
          ...(prev[user.family_id] || {}),
          family_id: user.family_id,
          family_name: user.family_name,
          signature_sent_at: new Date().toISOString(),
          doc_token: prev[user.family_id]?.doc_token || null,
        },
      }));
      const docToken = sigStatusMap[user.family_id]?.doc_token;
      if (docToken) {
        const url = `${window.location.origin}/public/sign/${vacationId}/${docToken}`;
        await navigator.clipboard.writeText(url);
        setSigCopiedId(user.family_id);
        setTimeout(() => setSigCopiedId(null), 2500);
      }
    } catch (e) {
      console.error(e);
      dispatch(snackBarSlice.setSnackBar({ type: "error", message: "שליחת קישור החתימה נכשלה, נסה שוב", timeout: 4000 }));
    }
  }, [token, vacationId, sigStatusMap, dispatch]);

  // Registration link — calls authenticated POST /registrations/:vacationId
  // and opens the SendRegistrationDialog so the coordinator can pick a channel
  // (WhatsApp / Email / Copy). Idempotent on the server: a second click within
  // 1 day returns reused:true with the same token (we just relabel the toast).
  // Errors stay as toasts and never open the dialog.
  const handleSendRegistrationLink = useCallback(async (e, user) => {
    e.stopPropagation();
    if (!vacationId) return;
    try {
      const res = await ApiRegistrations.create(token, vacationId, user.family_id);
      const data = res.data || {};
      if (!data.path) {
        dispatch(snackBarSlice.setSnackBar({ type: "error", message: "יצירת הקישור נכשלה", timeout: 4000 }));
        return;
      }
      const url = `${window.location.origin}${data.path}`;
      setRegistrationDialog({
        open: true,
        data: {
          link:          url,
          expiresAt:     data.expiresAt,
          headFirstName: data.headFirstName,
          headPhone:     data.headPhone,
          headEmail:     data.headEmail,
          vacationName:  data.vacationName,
        },
      });
      // Quiet "link is ready" toast so the user knows the link was created
      // (the dialog opening is also a visual signal, but the reused-flag
      // distinction is worth surfacing on the resend path).
      dispatch(snackBarSlice.setSnackBar({
        type: "success",
        message: data.reused ? "קישור קיים בתוקף — בחר ערוץ שליחה" : "קישור הרשמה נוצר — בחר ערוץ שליחה",
        timeout: 3000,
      }));
    } catch (err) {
      console.error(err);
      const code = err?.response?.data?.code;
      const serverMsg = err?.response?.data?.message;
      let message = serverMsg || "יצירת הקישור נכשלה, נסה שוב";
      if (code === "NO_MAIN_GUEST") {
        message = serverMsg || 'הוסף נופש וסמן אותו כ"משתמש ראשי" לפני יצירת קישור הרשמה';
      } else if (code === "HEAD_GUEST_NO_PHONE") {
        message = serverMsg || "ראש המשפחה ללא טלפון — הוסף טלפון לפני יצירת קישור";
      } else if (code === "NO_FAMILY") {
        message = serverMsg || "המשפחה לא נמצאה";
      } else if (code === "ALREADY_SIGNED") {
        message = serverMsg || "המשפחה כבר חתמה על הטופס — לא ניתן לשלוח קישור חדש";
      }
      dispatch(snackBarSlice.setSnackBar({ type: "error", message, timeout: 5000 }));
    }
  }, [token, vacationId, dispatch]);

  const handleCopyDocLink = useCallback(async (e, familyId) => {
    e.stopPropagation();
    try {
      const res = await ApiDocuments.getFamilyLink(token, vacationId, familyId);
      const docToken = res.data?.docToken;
      if (!docToken) return;
      const url = `${window.location.origin}/public/documents/${vacationId}/${docToken}`;
      await navigator.clipboard.writeText(url);
      setCopiedFamilyId(familyId);
      setTimeout(() => setCopiedFamilyId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  }, [token, vacationId]);

  const fetchBookingStatus = useCallback(async () => {
    if (!vacationId) return;
    try {
      const res = await ApiBookings.getAllStatus(token, vacationId);
      const map = {};
      (res.data || []).forEach((row) => {
        if (row.submission_id) {
          map[row.family_id] = {
            submission_id: row.submission_id,
            contact_name: row.contact_name,
            submitted_at: row.submitted_at,
          };
        }
      });
      setBookingStatusMap(map);
    } catch (e) { /* non-fatal */ }
  }, [vacationId, token]);

  const handleCopyBookingLink = useCallback(async (e, user) => {
    e.stopPropagation();
    const docToken = user.doc_token;
    if (!docToken) return;
    try {
      const url = `${window.location.origin}/public/booking/${vacationId}/${docToken}`;
      await navigator.clipboard.writeText(url);
      setBookingCopiedId(user.family_id);
      setTimeout(() => setBookingCopiedId(null), 2500);
    } catch (err) {
      console.error(err);
    }
  }, [vacationId]);

  const handleViewBooking = useCallback(async (e, user) => {
    e.stopPropagation();
    setSelectedBooking({ open: true, familyId: user.family_id, data: null });
    try {
      const res = await ApiBookings.getByFamily(token, vacationId, user.family_id);
      setSelectedBooking((prev) => ({ ...prev, data: res.data }));
    } catch (err) {
      console.error(err);
    }
  }, [token, vacationId]);

  const closeBookingDialog = useCallback(() => {
    setSelectedBooking({ open: false, familyId: null, data: null });
  }, []);

  // ── Vacation change: reset everything and reload ──────────────────────────
  useEffect(() => {
    if (!vacationId) return;
    setSearchTerm("");
    setUsersData([]);
    setPage(1);
    setHasMore(false);
    setDrawerOpen(false);
    closeModal();
    clearModalForms();
    loadPage(1, "");
    getChosenFamily();
    fetchDocStatus();
    fetchSigStatus();
    fetchBookingStatus();
  }, [vacationId]);

  // Load vacation dates for route dropdown
  useEffect(() => {
    const loadVacationDates = async () => {
      try {
        if (vacationId) {
          const response = await ApiVacations.getVacations(token, vacationId);
          if (response?.data?.vacationsDate?.length > 0) {
            dispatch(vacationSlice.updateVacationDatesList(response.data.vacationsDate));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadVacationDates();
  }, [vacationId]);

  // When a dialog closes (true → false): reset to page 1 and refresh
  const prevDialogOpen = useRef(dialogOpen);
  useEffect(() => {
    if (prevDialogOpen.current === true && dialogOpen === false) {
      silentRefresh();
      getChosenFamily();
    }
    prevDialogOpen.current = dialogOpen;
  }, [dialogOpen]);

  return (
    <>
      <FamilyListView
        handleDialogTypeOpen={handleDialogTypeOpen}
        handleNameClick={handleNameClick}
        handlePaymentClick={handlePaymentClick}
        families={usersData}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        loading={loading}
        loadingMore={loadingMore}
        guestsLoading={guestsLoading}
        tableWrapRef={tableWrapRef}
        drawerOpen={drawerOpen}
        closeDrawer={closeDrawer}
        openEditFamily={openEditFamily}
        editDialogOpen={editDialogOpen}
        editFamilyData={editFamilyData}
        handleEditFamilyChange={handleEditFamilyChange}
        handleEditFamilySubmit={handleEditFamilySubmit}
        handleEditWeekChange={handleEditWeekChange}
        closeEditDialog={closeEditDialog}
        openAddFamily={openAddFamily}
        addDialogOpen={addDialogOpen}
        addFamilyData={addFamilyData}
        handleAddFamilyChange={handleAddFamilyChange}
        handleAddFamilySubmit={handleAddFamilySubmit}
        handleAddWeekChange={handleAddWeekChange}
        closeAddDialog={closeAddDialog}
        docStatusMap={docStatusMap}
        copiedFamilyId={copiedFamilyId}
        handleCopyDocLink={handleCopyDocLink}
        sigStatusMap={sigStatusMap}
        sigCopiedId={sigCopiedId}
        handleSendSignatureLink={handleSendSignatureLink}
        handleSendRegistrationLink={handleSendRegistrationLink}
        bookingStatusMap={bookingStatusMap}
        bookingCopiedId={bookingCopiedId}
        handleCopyBookingLink={handleCopyBookingLink}
        handleViewBooking={handleViewBooking}
        selectedBooking={selectedBooking}
        closeBookingDialog={closeBookingDialog}
      />
      <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        closeModal={closeModal}
      />
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => {
          setPaymentDialogOpen(false);
          silentRefresh();
        }}
        family={paymentDialogFamily}
        vacationId={vacationId}
      />
      <SendRegistrationDialog
        open={registrationDialog.open}
        onClose={() => setRegistrationDialog({ open: false, data: null })}
        link={registrationDialog.data?.link}
        expiresAt={registrationDialog.data?.expiresAt}
        headFirstName={registrationDialog.data?.headFirstName}
        headPhone={registrationDialog.data?.headPhone}
        headEmail={registrationDialog.data?.headEmail}
        vacationName={registrationDialog.data?.vacationName}
      />
    </>
  )
};

export default FamilyList;
