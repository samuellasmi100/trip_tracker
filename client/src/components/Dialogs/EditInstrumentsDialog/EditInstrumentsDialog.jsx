import React, { useEffect, useState } from "react";
import EditInstrumentsDialogView from "./EditInstrumentsDialog.view";
import * as snackBarSlice from "../../../../../store/slice/snackbarSlice";
import { useDispatch } from "react-redux";
import ApiBondRequest from "../../../../../apis/bondRequest";
import axios from "axios";
import ApiRegion from "../../../../../apis/regionRequest";
import { useSelector } from "react-redux";
import Papa from "papaparse";

const EditInstrumentsDialog = (props) => {
  const { dialogOpen, closeModal, updateBonds } = props;
  const tableHeaders = ["ISIN", "Bond Name", "Currency", "Is Active"];
  const [newInputValue, setNewInputValue] = useState("");
  const [bondsByRegion, setBondsByRegion] = useState([]);
  const [selectedRegionValue, setSelectedRegionValue] = useState("");
  const regions = useSelector((state) => state.regionSlice.regions);
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();

  const handleAddRow = () => {
    const newRow = { id: bondsByRegion.length + 1, value: newInputValue };
    setBondsByRegion((prevData) => [...prevData, newRow]);
    setNewInputValue("");
  };

  const handleRegionChange = async (e) => {
    setBondsByRegion();
    setSelectedRegionValue(e.target.value);
    const [regionId] = regions.filter((key) => key.name === e.target.value);
    try {
      const result = await ApiRegion.getBondByRegionId(token, regionId.id);
      let tempResult = result.data;
      // tempResult = await Promise.all(
      //   tempResult.map(async (bond) => {
      //     let bbgBondData = await axios.get(
      //       `${process.env.REACT_APP_ISIN_PRICER}${bond.isin}`
      //     );
      //     bond = {
      //       ...bond,
      //       last_price: bbgBondData.data.last_price,
      //       currency: bbgBondData.data.currency,
      //     };
      //     return bond;
      //   })
      // );
      setBondsByRegion(tempResult);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e, row) => {
    const updatedRow = { ...row, input: e.target.value };
    const updatedRows = bondsByRegion.map((r) =>
      r.id === row.id ? updatedRow : r
    );
    setBondsByRegion(updatedRows);
  };

  const handleInputKeyDown = async (e, row) => {
    const [regionId] = regions.filter(
      (key) => key.name === selectedRegionValue
    );
    if (e.key === "Enter") {
      if (row.input.length === 12) {
        let response = await axios.get(
          `${process.env.REACT_APP_ISIN_PRICER}${row.input}`
        );
        const updatedRow = {
          ...row,
          isin: response.data.isin,
          bond_name: response.data.name,
          currency: response.data.currency,
          is_active: "1",
          region_id: regionId.id,
          new: true,
        };
        const updatedRows = bondsByRegion.map((r) =>
          r.id === row.id ? updatedRow : r
        );

        setBondsByRegion(updatedRows);
      } else {
        dispatch(
          snackBarSlice.setSnackBar({
            type: "error",
            message: `ISIN must contain 12 characters. currently contain ${row.input.length}`,
            timeout: 3000,
          })
        );
      }
    }
  };

  const handleTrashIconClick = (bondId) => {
    setBondsByRegion((prevTableData) =>
      prevTableData.map((row) =>
        row.bondId === bondId ? { ...row, is_active: !row.is_active } : row
      )
    );
  };

  const handleSubmit = async () => {
    try {
      await ApiBondRequest.update(token, bondsByRegion);
      updateBonds(bondsByRegion);
      closeModal();
      setBondsByRegion([]);
      setSelectedRegionValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = async () => {
    closeModal();
    setBondsByRegion([]);
    setSelectedRegionValue("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const isinColumnValues = results.data.map((row) => row.isin);
        validateLeiValues(isinColumnValues);
      },
    });
  };

  const validateLeiValues = (isinValues) => {
    isinValues.forEach((isin) => {
      if (isin.length === 12) {
        getBondData(isin);
      } else {
        dispatch(
          snackBarSlice.setSnackBar({
            type: "error",
            message: `LEI must contain 12 characters`,
            timeout: 3000,
          })
        );
      }
    });
  };
  const handleButtonClick = () => {
    if (selectedRegionValue === "") {
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: `Please chose Region`,
          timeout: 3000,
        })
      );
    } else {
      document.getElementById("fileInput").click();
    }
  };

  const getBondData = async (isin) => {
    const [regionId] = regions.filter(
      (key) => key.name === selectedRegionValue
    );
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_ISIN_PRICER}${isin}`
      );
      const updatedRow = {
        isin: response.data.isin,
        bond_name: response.data.name,
        currency: response.data.currency,
        is_active: "1",
        region_id: regionId.id,
        new: true,
      };
      setBondsByRegion((prevState) => [...prevState, updatedRow]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {}, [dialogOpen]);

  return (
    <EditInstrumentsDialogView
      closeModal={closeModal}
      dialogOpen={dialogOpen}
      tableHeaders={tableHeaders}
      newInputValue={newInputValue}
      setNewInputValue={setNewInputValue}
      handleAddRow={handleAddRow}
      handleInputChange={handleInputChange}
      handleInputKeyDown={handleInputKeyDown}
      selectedRegionValue={selectedRegionValue}
      setSelectedRegionValue={setSelectedRegionValue}
      handleRegionChange={handleRegionChange}
      bondsByRegion={bondsByRegion}
      setBondsByRegion={setBondsByRegion}
      handleTrashIconClick={handleTrashIconClick}
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      handleFileUpload={handleFileUpload}
      validateLeiValues={validateLeiValues}
      handleButtonClick={handleButtonClick}
    />
  );
};

export default EditInstrumentsDialog;
