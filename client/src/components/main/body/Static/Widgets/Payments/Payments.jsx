import React, { useState, useEffect } from "react";
import PaymentsView from "./Payments.view";
import { useSelector, useDispatch } from "react-redux";
import ApiPayments from "../../../../../../apis/paymentsRequest";
import * as paymentsSlice from "../../../../../../store/slice/paymentsSlice";
import PaymentDialog from "../../../../../Dialogs/Payments/Payments";

const Payments = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const summary = useSelector((state) => state.paymentsSlice.summary);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);

  const getSummary = async () => {
    try {
      dispatch(paymentsSlice.setLoading(true));
      const res = await ApiPayments.getSummary(token, vacationId);
      dispatch(paymentsSlice.setSummary(res.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(paymentsSlice.setLoading(false));
    }
  };

  const handleFamilyClick = (item) => {
    setSelectedFamily({
      family_id:    item.familyId,
      family_name:  item.familyName,
      total_amount: item.totalAmount || "0",
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFamily(null);
    getSummary(); // refresh totals after dialog closes
  };

  const filteredSummary = summary?.filter((item) => {
    if (!searchTerm) return true;
    return (item.familyName || "").includes(searchTerm);
  });

  const exportToCSV = () => {
    const headers = ["שם משפחה", "סכום עסקה", "שולם", "נותר"];
    const rows = summary.map((item) => {
      const total     = Number(item.totalAmount || 0);
      const paid      = Number(item.paidAmount  || 0);
      const remaining = total - paid;
      return [
        `"${item.familyName}"`,
        `"${total.toLocaleString()}"`,
        `"${paid.toLocaleString()}"`,
        `"${remaining.toLocaleString()}"`,
      ];
    });
    const csv  = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href  = url;
    link.setAttribute("download", "תשלומים.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacationId]);

  return (
    <>
      <PaymentsView
        filteredSummary={filteredSummary}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onFamilyClick={handleFamilyClick}
        handleExportToExcel={exportToCSV}
      />
      <PaymentDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        family={selectedFamily}
        vacationId={vacationId}
      />
    </>
  );
};

export default Payments;
