import React, { useState } from "react";
import LoginView from "./Login.view";
import ApiUser from "../../../../apis/userRequest";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as authSlice from "../../../../store/slice/authSlice";
import * as userSlice from "../../../../store/slice/userSlice";
import * as snackBarSlice from "../../../../store/slice/snackbarSlice";
import axios from "axios";
import { connectSocket } from "../../../../utils/socketService";

const Login = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (event) => {
    event.preventDefault();
    setFormState((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const loginPostRequest = async (event) => {


    let email = formState.email
    let password = formState.password
    try {
      let response = await ApiUser.login(email,password)
      if(response.data.httpCode === 401){
        dispatch(
          snackBarSlice.setSnackBar({
            type: "error",
            message: response.data.message,
            timeout: 3000,
          })
        );
      }else {
        const bearerToken = "Bearer " + response.data;
        dispatch(authSlice.setUserData(bearerToken));
        sessionStorage.setItem("token", bearerToken);
        connectSocket(bearerToken);
        navigate("/workspace");
      }
     
        
    
   
    } catch (error) {
      console.log(error)
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: error.response.data,
          timeout: 3000,
        })
      );
    }
  };

  const handleClickShowPassword = () => {
    setFormState({
      ...formState,
      showPassword: !formState.showPassword,
    });
  };

  const handleClickForgotPassword = async () => {
   
  };

  return (
    <LoginView
      formState={formState}
      handleClickShowPassword={handleClickShowPassword}
      handleClickForgotPassword={handleClickForgotPassword}
      handleChange={handleChange}
      loginPostRequest={loginPostRequest}
    />
  );
};

export default Login;
