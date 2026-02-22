import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainDialog from "../../../../../Dialogs/MainDialog/MainDialog";
import PaymentDialog from "../../../../../Dialogs/Payments/Payments";
import { useDispatch, useSelector } from "react-redux";
import ApiUser from "../../../../../../apis/userRequest"
import ApiVacations from "../../../../../../apis/vacationRequest"
import ApiDocuments from "../../../../../../apis/documentsRequest"
import ApiSignatures from "../../../../../../apis/signaturesRequest"
import ApiBookings from "../../../../../../apis/bookingsRequest"
import FamilyListView from "./FamilyList.view";
import * as userSlice from "../../../../../../store/slice/userSlice";
import * as dialogSlice from "../../../../../../store/slice/dialogSlice";
import * as flightsSlice from "../../../../../../store/slice/flightsSlice";
import * as roomsSlice from "../../../../../../store/slice/roomsSlice";
import * as notesSlice from "../../../../../../store/slice/notesSlice";
import * as paymentsSlice from "../../../../../../store/slice/paymentsSlice";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import * as vacationSlice from "../../../../../../store/slice/vacationSlice";
import { isoToDisplay } from "../../../../../../utils/HelperFunction/formatDate";

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
    } else if (type === "addFamily") {
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
    try {
      const response = await ApiUser.getUserFamilyList(token, user.family_id, vacationId)
      dispatch(userSlice.updateGuest(response.data.length > 0 ? response.data : []))
    } catch (error) {
      console.log(error)
    } finally {
      setGuestsLoading(false)
    }
  }

  const getChosenFamily = async () => {
    if (!chosenFamily?.family_id) return;
    dispatch(userSlice.updateFamily(chosenFamily))
    try {
      const response = await ApiUser.getUserFamilyList(token, chosenFamily.family_id, vacationId)
      dispatch(userSlice.updateGuest(response.data.length > 0 ? response.data : []))
    } catch (error) {
      console.log(error)
    }
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
      setUsersData([]);
      loadPage(1, searchTermRef.current);
    } catch (error) {
      console.log(error);
    }
  }, [token, editFamilyData, vacationId, loadPage]);

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
    }
  }, [token, vacationId, sigStatusMap]);

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
      setUsersData([]);
      setPage(1);
      setHasMore(false);
      loadPage(1, searchTermRef.current);
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
        docStatusMap={docStatusMap}
        copiedFamilyId={copiedFamilyId}
        handleCopyDocLink={handleCopyDocLink}
        sigStatusMap={sigStatusMap}
        sigCopiedId={sigCopiedId}
        handleSendSignatureLink={handleSendSignatureLink}
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
          setUsersData([]);
          loadPage(1, searchTermRef.current);
        }}
        family={paymentDialogFamily}
        vacationId={vacationId}
      />
    </>
  )
};

export default FamilyList;
