import React, { useEffect } from "react";
import HeaderView from "./Header.view";
import ApiVacations from "../../../apis/vacationRequest"
import * as vacationSlice from "../../../store/slice/vacationSlice"
import { useDispatch, useSelector } from "react-redux";


const Header = () => {

  return <HeaderView  />;
};

export default Header;
