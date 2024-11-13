import React, { useEffect, useState } from "react";
import NewEditClientDialogView from "./NewEditClientDialog.view";
import * as snackBarSlice from "../../../../../store/slice/snackbarSlice";
import { useDispatch } from "react-redux";
import Api from "../../../../../apis/clientRequest";

const NewEditClientDialog = (props) => {
  const { dialogType, clientId, dialogOpen, closeModal, updateClients } = props;
  const dispatch = useDispatch();
  const [currentClientData, setCurrentClientData] = useState();
  const token = sessionStorage.getItem("token");

  const getClientById = async (clientId) => {
    if (currentClientData) {
      setCurrentClientData();
    }
    try {
      const result = await Api.getClientById(token, clientId);
      setCurrentClientData(result.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const editClient = async () => {
    if (currentClientData.lei.length === 20) {
      try {
        await Api.updateClient(token, currentClientData);
        updateClients(currentClientData);
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: `LEI must contain 20 characters. currently contain ${currentClientData.lei.length}`,
          timeout: 3000,
        })
      );
    }
  };
  const saveNewClient = async () => {
    if (currentClientData.lei.length === 20) {
      try {
        let result = await Api.createClient(token, currentClientData);
        updateClients(result.data[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: `LEI must contain 20 characters. currently contain ${currentClientData.lei.length}`,
          timeout: 3000,
        })
      );
    }
  };

  const changeCurrentClientData = (e, key) => {
    if (key === "lei") {
      const re = /^[a-zA-Z0-9]+$/;
      if (e.target.value === "" || re.test(e.target.value)) {
        setCurrentClientData({ ...currentClientData, [key]: e.target.value });
      }
    } else if (key !== "is_active" && key !== "lei") {
      setCurrentClientData({ ...currentClientData, [key]: e.target.value });
    } else {
      setCurrentClientData({ ...currentClientData, [key]: e.target.checked });
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      if (clientId) {
        getClientById(clientId);
      } else {
        setCurrentClientData();
        setCurrentClientData({ client_name: "", lei: "", is_active: true });
      }
    }
  }, [dialogOpen]);

  return (
    currentClientData && (
      <NewEditClientDialogView
        clientId={clientId}
        saveNewClient={saveNewClient}
        closeModal={closeModal}
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        editClient={editClient}
        currentClientData={currentClientData}
        changeCurrentClientData={changeCurrentClientData}
      />
    )
  );
};

export default NewEditClientDialog;
