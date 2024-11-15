import React, { useEffect, useState } from "react";
import NewEditClientUserDialogView from "./NewEditClientUserDialog.view";
import ApiClient from "../../../apis/clientRequest";
import ApiRegion from "../../../apis/regionRequest";
import ApiUser from "../../../apis/userRequest";
import { useSelector } from "react-redux";

const Notes = (props) => {
  const regions = useSelector((state) => state.regionSlice.regions);

  const {
    dialogType,
    dialogOpen,
    clientUserId,
    setDialogOpen,
    closeModal,
    updateClientsUsers,
  } = props;

  let [currentClientUserData, setCurrentClientUserData] = useState({});
  let [currentRegionClientUserData, setCurrentRegionClientUserData] = useState(
    []
  );
  const token = sessionStorage.getItem("token");
  const [selectedClientValue, setSelectedClientValue] = useState("");
  const [selectedMakorSalesValue, setSelectedMakorSalesValue] = useState("");
  const [tableData, setTableData] = useState("");
  const clients = useSelector((state) => state.userSlice.clients);
  const traders = useSelector((state) => state.userSlice.traders);

  const apiGetClientUserById = async (clientUserId) => {
    try {
      const result = await ApiClient.getClientUserById(token, clientUserId);
      setCurrentClientUserData(result.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const apiGetRegionByClientUserId = async (clientUserId) => {
    try {
      const result = await ApiRegion.getRegionUserById(token, clientUserId);
      if (result.data === "") {
        setCurrentRegionClientUserData([]);
      } else {
        setCurrentRegionClientUserData(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePreRenderSelectCheckboxChecked = (regionName) => {
    if (
      currentRegionClientUserData !== undefined &&
      currentRegionClientUserData !== ""
    ) {
      if (currentRegionClientUserData?.some((opt) => opt.name === regionName)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleSelectCheckboxChecked = (e, key) => {
    setCurrentRegionClientUserData((prevSelectedOptions) => {
      // if(prevSelectedOptions !== ""){
      if (prevSelectedOptions?.some((opt) => opt.name === key.name)) {
        return prevSelectedOptions.filter((option) => option.name !== key.name);
      } else {
        return [...prevSelectedOptions, key];
      }

      // }
    });
  };

  const handlePreRenderCheckboxChecked = (checkboxName) => {
    if (currentClientUserData !== undefined) {
      if (
        currentClientUserData?.privileges?.split(",").includes(checkboxName)
      ) {
        return true;
      } else if (
        currentClientUserData?.privileges?.split(",").includes(checkboxName)
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleCheckboxChecked = (e, option) => {
    setCurrentClientUserData((prevState) => {
      const updatedPrivileges = prevState.privileges.split(",");

      if (option === "reporting") {
        if (updatedPrivileges.includes("reporting")) {
          updatedPrivileges.splice(updatedPrivileges.indexOf("reporting"), 1);
        } else {
          updatedPrivileges.push("reporting");
        }
      } else if (option === "trading") {
        if (updatedPrivileges.includes("trading")) {
          updatedPrivileges.splice(updatedPrivileges.indexOf("trading"), 1);
        } else {
          updatedPrivileges.push("trading");
        }
      }

      return {
        ...prevState,
        privileges: updatedPrivileges.join(","),
      };
    });
  };

  const handleTraderChange = (e) => {
    const [getTraderId] = traders.filter(
      (key) => key.fullName === e.target.value
    );
    setCurrentClientUserData((prevState) => ({
      ...prevState,
      traderId: getTraderId.id,
      traderName: getTraderId.fullName,
    }));
    setSelectedMakorSalesValue(e.target.value);
  };

  const handleClientsChange = (e) => {
    const [getClientId] = clients.filter(
      (key) => key.client_name === e.target.value
    );
    setCurrentClientUserData((prevState) => ({
      ...prevState,
      clientId: getClientId.client_id,
      clientName: getClientId.client_name,
    }));
    setSelectedClientValue(e.target.value);
  };

  const changeCurrentClientUserData = (e, key) => {
    if (key === "areaCode") {
      setCurrentClientUserData((prevState) => ({
        ...prevState,
        phone: {
          ...prevState.phone,
          code: e,
        },
      }));
    } else if (key === "phone") {
      setCurrentClientUserData((prevState) => ({
        ...prevState,
        phone: {
          ...prevState.phone,
          number: e.target.value,
        },
      }));
      currentClientUserData.phone.number = { ...currentClientUserData };
    } else {
      setCurrentClientUserData((prevState) => ({
        ...prevState,
        [key]: e.target.value,
      }));
    }
  };

  const apiEditClientUser = async () => {
    const [getClientId] = clients.filter(
      (key) => key.client_name === currentClientUserData.clientName
    );

    const [getTraderId] = traders.filter(
      (key) => key.fullName === currentClientUserData.traderName
    );
    currentClientUserData = {
      ...currentClientUserData,
      regions: currentRegionClientUserData,
      clientId: getClientId.client_id,
      traderId: getTraderId.id,
    };
    try {
      const response = await ApiClient.updateClientUser(
        token,
        currentClientUserData
      );
      updateClientsUsers(currentClientUserData);
    } catch (error) {
      console.log(error);
    }
  };

  const apiSaveNewClientUser = async (e, actionType) => {
    currentClientUserData = {
      ...currentClientUserData,
      regions: currentRegionClientUserData,
    };
    try {
      await ApiUser.createClientUser(token, currentClientUserData);
      updateClientsUsers(currentClientUserData);
      setDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (dialogOpen) {
  //     if (clientUserId) {
  //       //! here we'll have an axios request
  //       apiGetClientUserById(clientUserId);
  //       apiGetRegionByClientUserId(clientUserId);
  //     } else {
  //       setCurrentRegionClientUserData([]);
  //       setCurrentClientUserData({});
  //       setCurrentClientUserData({
  //         firstName: "",
  //         lastName: "",
  //         clientName: "",
  //         email: "",
  //         dailyLimit: "",
  //         traderName: "",
  //         regionSelect: "",
  //         privileges: "",
  //         phone: { code: "", number: "" },
  //       });
  //     }
  //   }
  // }, [dialogOpen]);
  return (
    currentClientUserData && (
      <NewEditClientUserDialogView
        closeModal={closeModal}
        dialogOpen={dialogOpen}
        currentClientUserData={currentClientUserData}
        changeCurrentClientUserData={changeCurrentClientUserData}
        handleSelectCheckboxChecked={handleSelectCheckboxChecked}
        handlePreRenderSelectCheckboxChecked={
          handlePreRenderSelectCheckboxChecked
        }
        handlePreRenderCheckboxChecked={handlePreRenderCheckboxChecked}
        apiEditClientUser={apiEditClientUser}
        handleCheckboxChecked={handleCheckboxChecked}
        apiSaveNewClientUser={apiSaveNewClientUser}
        selectedClientValue={selectedClientValue}
        selectedMakorSalesValue={selectedMakorSalesValue}
        handleTraderChange={handleTraderChange}
        handleClientsChange={handleClientsChange}
        dialogType={dialogType}
        currentRegionClientUserData={currentRegionClientUserData}
      />
    )
  );
};

export default Notes;
