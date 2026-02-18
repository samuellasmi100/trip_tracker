import React from "react";
import HeaderView from "./Header.view";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Header = () => {
  const vacationName = useSelector((state) => state.vacationSlice.vacationName);
  const families = useSelector((state) => state.userSlice.families);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes("/workspace")) return "סביבת עבודה";
    if (location.pathname.includes("/static")) return "מידע כולל";
    if (location.pathname.includes("/budgets")) return "תקציב";
    return "";
  };

  const familyCount = families?.length || 0;

  return (
    <HeaderView
      vacationName={vacationName}
      pageTitle={getPageTitle()}
      familyCount={familyCount}
    />
  );
};

export default Header;
