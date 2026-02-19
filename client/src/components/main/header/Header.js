import React, { useEffect } from "react";
import HeaderView from "./Header.view";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ApiVacations from "../../../apis/vacationRequest";
import * as vacationSlice from "../../../store/slice/vacationSlice";
import * as userSlice from "../../../store/slice/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const vacationName = useSelector((state) => state.vacationSlice.vacationName);
  const vacationList = useSelector((state) => state.vacationSlice.vacations);
  const families = useSelector((state) => state.userSlice.families);
  const location = useLocation();
  const token = sessionStorage.getItem("token");

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
    return "";
  };

  const familyCount = families?.length || 0;
  const totalGuests = families?.reduce((sum, f) => sum + Number(f.number_of_guests || 0), 0) || 0;
  const totalBalance = families?.reduce((sum, f) => {
    if (f.total_amount === "" || f.total_amount === null) return sum;
    return sum + (Number(f.total_amount) - Number(f.total_paid_amount || 0));
  }, 0) || 0;
  const totalMissing = families?.reduce((sum, f) => {
    const m = Number(f.number_of_guests || 0) - Number(f.user_in_system_count || 0);
    return sum + (m > 0 ? m : 0);
  }, 0) || 0;

  // Fetch vacations list for the dropdown
  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await ApiVacations.getVacations(token);
        if (response?.data?.vacations?.length > 0) {
          dispatch(vacationSlice.updateVacationList(response.data.vacations));
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (vacationList?.length === 0) {
      fetchVacations();
    }
  }, []);

  const handleVacationChange = (e) => {
    const selected = vacationList?.find((v) => v.name === e.target.value);
    if (!selected) return;
    // Update Redux and sessionStorage
    dispatch(vacationSlice.updateChosenVacation(selected.vacation_id));
    dispatch(vacationSlice.updateVacationName(selected.name));
    sessionStorage.setItem("vacId", selected.vacation_id);
    sessionStorage.setItem("vacName", selected.name);
    // Clear workspace data so pages re-fetch
    dispatch(userSlice.updateFamiliesList([]));
    dispatch(userSlice.updateGuest([]));
  };

  return (
    <HeaderView
      vacationName={vacationName}
      vacationList={vacationList}
      pageTitle={getPageTitle()}
      familyCount={familyCount}
      totalGuests={totalGuests}
      totalBalance={totalBalance}
      totalMissing={totalMissing}
      handleVacationChange={handleVacationChange}
    />
  );
};

export default Header;
