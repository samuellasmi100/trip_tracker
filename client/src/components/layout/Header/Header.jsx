import React, { useEffect, useState } from "react";
import HeaderView from "./Header.view";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ApiVacations from "../../../apis/vacationRequest";
import ApiUser from "../../../apis/userRequest";
import * as vacationSlice from "../../../store/slices/vacationSlice";
import * as userSlice from "../../../store/slices/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const vacationName = useSelector((state) => state.vacationSlice.vacationName);
  const vacationList = useSelector((state) => state.vacationSlice.vacations);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  const [stats, setStats] = useState({
    family_count: 0,
    total_guests: 0,
    total_missing: 0,
    total_balance: 0,
  });

  const staticDialogType = useSelector((state) => state.staticSlice.type);

  const staticTitles = {
    rooms: "רשימת חדרים",
    roomsStatus: "סטטוס חדרים",
    hotels: "מלונות",
    flights: "טיסות",
    payments: "תשלומים",
    vacations: "חופשות",
    generalInformation: "מידע כולל",
    mainGuests: "נרשמים",
    guests: "כלל האורחים",
  };

  const getPageTitle = () => {
    if (location.pathname.includes("/workspace")) return "דף הבית";
    if (location.pathname.includes("/static")) return staticTitles[staticDialogType] || "";
    if (location.pathname.includes("/budgets")) return "תקציב";
    if (location.pathname.includes("/leads")) return "לידים";
    if (location.pathname.includes("/settings")) return "הגדרות";
    return "";
  };

  // Fetch vacations list for the dropdown
  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await ApiVacations.getVacations(token);
        const list = response?.data?.vacations || [];
        if (list.length > 0) {
          dispatch(vacationSlice.updateVacationList(list));
        }
        // Stale-selection guard: vacations are deleted directly in the DB (there
        // is no in-app delete flow), so a persisted vacId can keep pointing at a
        // dropped tenant schema — every scoped call then floods "Unknown
        // database". If the persisted selection isn't in the freshly fetched
        // list (or the list is empty), clear it so the app falls back to
        // RequireVacation's "no vacation selected" placeholder. Runs only on a
        // successful fetch — a network error hits catch and leaves the selection
        // untouched, so a transient failure can't wipe a still-valid selection.
        if (vacationId && !list.some((v) => v.vacation_id === vacationId)) {
          dispatch(vacationSlice.updateChosenVacation(""));
          dispatch(vacationSlice.updateVacationName(""));
          sessionStorage.removeItem("vacId");
          sessionStorage.removeItem("vacName");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (vacationList?.length === 0) {
      fetchVacations();
    }
  }, []);

  // Fetch aggregated stats (not the full list) so header counters are accurate across all pages
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await ApiUser.getFamilyStats(token, vacationId);
        if (response?.data) setStats(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (vacationId) fetchStats();
  }, [vacationId]);

  const handleVacationChange = (e) => {
    const selected = vacationList?.find((v) => v.name === e.target.value);
    if (!selected) return;
    dispatch(vacationSlice.updateChosenVacation(selected.vacation_id));
    dispatch(vacationSlice.updateVacationName(selected.name));
    sessionStorage.setItem("vacId", selected.vacation_id);
    sessionStorage.setItem("vacName", selected.name);
    dispatch(userSlice.updateFamiliesList([]));
    dispatch(userSlice.updateGuest([]));
    setStats({ family_count: 0, total_guests: 0, total_missing: 0, total_balance: 0 });
  };

  return (
    <HeaderView
      vacationName={vacationName}
      vacationList={vacationList}
      pageTitle={getPageTitle()}
      familyCount={stats.family_count}
      totalGuests={stats.total_guests}
      totalBalance={stats.total_balance}
      totalMissing={stats.total_missing}
      handleVacationChange={handleVacationChange}
    />
  );
};

export default Header;
