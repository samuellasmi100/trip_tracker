import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainDialog from "../../../../../Dialogs/MainDialog/MainDialog";
import PaymentDialog from "../../../../../Dialogs/Payments/Payments";
import { useDispatch, useSelector } from "react-redux";
import ApiUser from "../../../../../../apis/userRequest"
import ApiVacations from "../../../../../../apis/vacationRequest"
import ApiDocuments from "../../../../../../apis/documentsRequest"
import ApiSignatures from "../../../../../../apis/signaturesRequest"
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

const FamilyList = () => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId)
  const [usersData, setUsersData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dialogOpen = useSelector((state) => state.dialogSlice.open)
  const dialogType = useSelector((state) => state.dialogSlice.type)
  const [searchTerm, setSearchTerm] = useState("");
  const token = sessionStorage.getItem('token')
  const chosenFamily = useSelector((state) => state.userSlice.family)
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates)
  const [docStatusMap, setDocStatusMap] = useState({}); // familyId → { uploaded, total }
  const [copiedFamilyId, setCopiedFamilyId] = useState(null);
  const [sigStatusMap, setSigStatusMap] = useState({}); // familyId → { signature_sent_at, signer_name, signed_at, doc_token, sig_id }
  const [sigCopiedId, setSigCopiedId] = useState(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    }else if (type === "uploadFile") {
      dispatch(dialogSlice.updateActiveButton("העלה קובץ"))
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    }

  };

  const getFamilies = async () => {
    try {
      if (vacationId !== "") {
        let response = await ApiUser.getFamilyList(token, vacationId)
        dispatch(userSlice.updateFamiliesList(response.data))
        setUsersData(response.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleNameClick = async (user) => {
    dispatch(userSlice.updateFamily(user))
    let family_id = user.family_id
    try {
      let response = await ApiUser.getUserFamilyList(token, family_id, vacationId)
      if (response.data.length > 0) {
        dispatch(userSlice.updateGuest(response.data))
      } else {
        dispatch(userSlice.updateGuest([]))

      }
    } catch (error) {
      console.log(error)
    }
    // Open drawer when family is clicked
    setDrawerOpen(true);
  }

  const getChosenFamily = async () => {
    dispatch(userSlice.updateFamily(chosenFamily))
    let family_id = chosenFamily.family_id
    try {
      let response = await ApiUser.getUserFamilyList(token, family_id, vacationId)
      if (response.data.length > 0) {
        dispatch(userSlice.updateGuest(response.data))
      } else {
        dispatch(userSlice.updateGuest([]))

      }
    } catch (error) {
      console.log(error)
    }
  }

  // Edit family dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFamilyData, setEditFamilyData] = useState({});

  const openEditFamily = useCallback((e, user) => {
    e.stopPropagation();
    // Find matching week from vacation dates
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
      await getFamilies();
    } catch (error) {
      console.log(error);
    }
  }, [token, editFamilyData, vacationId]);

  const [paymentDialogOpen, setPaymentDialogOpen]     = useState(false);
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
    } catch (e) {
      // non-fatal
    }
  }, [vacationId, token]);

  const fetchSigStatus = useCallback(async () => {
    if (!vacationId) return;
    try {
      const res = await ApiSignatures.getAllStatus(token, vacationId);
      const map = {};
      (res.data || []).forEach((row) => {
        map[row.family_id] = row;
      });
      setSigStatusMap(map);
    } catch (e) {
      // non-fatal
    }
  }, [vacationId, token]);

  const handleSendSignatureLink = useCallback(async (e, user) => {
    e.stopPropagation();
    if (!vacationId) return;
    try {
      await ApiSignatures.markSent(token, vacationId, user.family_id);
      // Update local state to reflect sent status
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
      // Build and copy the public signature URL
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

  const filteredFamilyList = usersData?.filter((user) => {
    if (searchTerm !== "") {
      return user.family_name.includes(searchTerm)
    } else {
      return user
    }
  }
  );

  // Close drawer and modals when vacation changes (dropdown is in Header now)
  useEffect(() => {
    setDrawerOpen(false);
    closeModal();
    clearModalForms();
  }, [vacationId])

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

  useEffect(() => {
    getFamilies()
    getChosenFamily()
    fetchDocStatus()
    fetchSigStatus()
  }, [dialogOpen, vacationId])

  return (
    <>
      <FamilyListView
        handleDialogTypeOpen={handleDialogTypeOpen}
        handleNameClick={handleNameClick}
        handlePaymentClick={handlePaymentClick}
        filteredFamilyList={filteredFamilyList}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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
      />
      <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        closeModal={closeModal}
      />
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => { setPaymentDialogOpen(false); getFamilies(); }}
        family={paymentDialogFamily}
        vacationId={vacationId}
      />
    </>
  )
};

export default FamilyList;
