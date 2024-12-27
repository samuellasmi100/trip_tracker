import React, { useState,useEffect } from "react";
import PaymentsView from "./Payments.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiStatic from "../../../../../../apis/staticRequest";
import ApiUser from "../../../../../../apis/userRequest";
import EditOrUpdateDialog from "../../EditOrUpdateDialog/MainDialog/EditOrUpdateDialog";
import * as snackBarSlice from "../../../../../../store/slice/snackbarSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Payments = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const payments = useSelector((state) => state.staticSlice.mainData);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);
  
  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "",
    "שם",
    "סכום עסקה",
    "נותר לתשלום",
    "נשלחה חשבונית",
    "פרטי תשלום"
  ];

  const filteredPayments = payments?.filter((payment) => {
    if (searchTerm !== "") {
      return payment.hebrew_first_name.includes(searchTerm) || payment.hebrew_last_name.includes(searchTerm) ;
    } else {
      return payment;
    }
  });


  const handleEditClick = (payment) => {
    dispatch(staticSlice.updateDetailsModalType("editPayments"))
    dispatch(staticSlice.openDetailsModal())
    dispatch(staticSlice.updateForm(payment))
  };

  const getPayments = async () => {
    try {
        const response = await ApiStatic.getPaymentsDetails(token,vacationId)
        dispatch(staticSlice.updateMainData(response.data))
    } catch (error) {
      console.log(error)
    }
  }
 
  function exportToCSV() {
    const headers = ["שם", "סכום עסקה","נשלחה חשבונית","נותר לתשלום"];
    const rows = payments.map(item => [
      `"${item?.hebrew_first_name}"`, 
      `"${item?.amount}"`,
      `"${item?.invoice === null || item?.invoice === 0 ? 'לא' : 'כן'}"`,
      `"${item?.remainsToBePaid === null ? item?.default_amount : item?.remainsToBePaid}"`
    ]);
  
    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const csvWithBOM = "\uFEFF" + csvContent;

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "תשלומים.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  
  
  
  
  useEffect(() => {
    getPayments()
  }, [])
  return (
  <>
  <PaymentsView
  filteredPayments={filteredPayments}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  headers={headers}
  handleExportToExcel={exportToCSV}
  handleEditClick={handleEditClick}
  />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default Payments;
