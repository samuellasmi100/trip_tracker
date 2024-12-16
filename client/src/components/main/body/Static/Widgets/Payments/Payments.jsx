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
  const form = useSelector((state) => state.staticSlice.form);
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const payments = useSelector((state) => state.staticSlice.mainData);
  const detailsDialogOpen = useSelector((state) => state.staticSlice.detailsModalOpen);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const handleClose = () => {
    setOpen(false); 
  };

  const closeDetailsModal = () => {
    dispatch(staticSlice.closeDetailsModal());
  };

  const headers = [
    "",
    "שם",
    "סכום עסקה",
    "נותר לתשלום",
    "פרטי תשלום"
  ];

  const filteredPayments = payments?.filter((payment) => {
    if (searchTerm !== "") {
      return payment.hebrew_first_name.includes(searchTerm) || payment.hebrew_last_name.includes(searchTerm) ;
    } else {
      return payment;
    }
  });


  const handleEditClick = () => {
    dispatch(staticSlice.updateDetailsModalType("editPayments"))
    dispatch(staticSlice.openDetailsModal())
  };

  const getPayments = async () => {
    try {
        const response = await ApiStatic.getPaymentsDetails(token,vacationId)
        console.log(response)
        dispatch(staticSlice.updateMainData(response.data))
    } catch (error) {
      console.log(error)
    }
  }
 
  const handleExportToExcel = () => {
    const transformedData = payments.map((row) => {
      return {
        "שם": row.hebrew_first_name + " " + row.hebrew_last_name,
        "סכום עסקה": row.amount,
        "נותר לתשלום": row.remainsToBePaid,
      };
    });
  
    const hebrewHeaders = [
      "שם",
      "סכום עסקה",
      "נותר לתשלום",
    ];
  
    const ws = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.sheet_add_aoa(ws, [hebrewHeaders], { origin: "A1" });
    ws["!dir"] = "rtl";
    ws["!cols"] = hebrewHeaders.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "כלל האורחים");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "כלל האורחים.xlsx");
  };
  
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
  handleExportToExcel={handleExportToExcel}
  handleEditClick={handleEditClick}
  />
  <EditOrUpdateDialog detailsDialogOpen={detailsDialogOpen} closeDetailsModal={closeDetailsModal} />
   </>
  )
};

export default Payments;
