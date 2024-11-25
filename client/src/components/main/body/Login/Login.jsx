import React, { useState } from "react";
import LoginView from "./Login.view";
import Api from "../../../../apis/userRequest";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as authSlice from "../../../../store/slice/authSlice";
import * as userSlice from "../../../../store/slice/userSlice";
import * as snackBarSlice from "../../../../store/slice/snackbarSlice";

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

    event.preventDefault();
    try {
      let response = await Api.login({
        email: formState.email,
        password: formState.password,
      });
      if(response.data.httpCode === 401){
        dispatch(
          snackBarSlice.setSnackBar({
            type: "error",
            message: response.data.message,
            timeout: 3000,
          })
        );
      }else {
        navigate("/workspace");
        dispatch(authSlice.setUserData("Bearer " + response.data))
        sessionStorage.setItem("token", "Bearer " + response.data);
      }
   
    } catch (error) {
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
    if (formState.email !== "") {
      try {
        let response = await Api.forgotPassword({
          email: formState.email,
        });
        if (response.data.type === "fp") {
          dispatch(authSlice.setUserData(response.data));
          navigate("/forgot_password");
        }
      } catch (error) {
        dispatch(
          snackBarSlice.setSnackBar({
            type: "error",
            message: error.response.data,
            timeout: 3000,
          })
        );
      }
    } else {
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: "Please enter your email address",
          timeout: 3000,
        })
      );
    }
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
