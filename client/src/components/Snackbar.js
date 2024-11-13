import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as snackbarSlice from "../store/slice/snackbarSlice";

export default function SnackBar() {
  const dispatch = useDispatch();
  const { timeout, message, type, toastId, position } = useSelector(
    (state) => state?.snackBarSlice
  );

  useEffect(() => {
    if (message !== "") {
      toast[type](message, {
        autoClose: timeout,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
        toastId: toastId,
        position: position,
      });
      dispatch(snackbarSlice.disableSnackBar());
    } else {
      return;
    }
  }, [message]);

  return (
    <ToastContainer
      pauseOnFocusLoss={false}
      toastStyle={{ backgroundColor: "#262626" }}
      position={position || "top-right"}
      autoClose={timeout}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      pauseOnHover
      theme="dark"
    />
  );
}
