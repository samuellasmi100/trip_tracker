import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useStyles } from "./ExpensesTab.style";
import SummaryCard from "../shared/SummaryCard";
import SearchBar from "../shared/SearchBar";
import StatusFilter from "../shared/StatusFilter";
import UnifiedTable from "../shared/UnifiedTable";

function ExpensesTabView({
  expenses,
  handleOpenEdit,
  handleDelete,
  handleStatusToggle,
  confirmOpen,
  selectedRow,
  handleConfirmStatus,
  handleCancelStatus,
}) {
  const classes = useStyles();
  const totalPaid = useSelector((state) => state.budgetSlice.expensesTotalPaid);
  const totalPlanned = useSelector((state) => state.budgetSlice.expensesTotalPlanned);

  return (
    <div className={classes.root}>
      {/* Summary Cards */}
      <div className={classes.cardsRow}>
        <SummaryCard title="סה״כ מתוכנן" value={totalPlanned} color="#64748b" />
        <SummaryCard title="סה״כ שולם" value={totalPaid} color="#0d9488" />
        <SummaryCard
          title="נותר לתשלום"
          value={totalPlanned - totalPaid}
          color="#ef4444"
        />
      </div>

      {/* Search + Filter */}
      <div className={classes.filtersRow}>
        <SearchBar />
        <StatusFilter />
      </div>

      {/* Table */}
      <UnifiedTable
        data={expenses}
        type="expense"
        onEdit={(row) => handleOpenEdit(row, "editExpense")}
        onDelete={handleDelete}
        onStatusToggle={handleStatusToggle}
      />

      {/* Confirm Status Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancelStatus}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
            minWidth: "320px",
          },
        }}
      >
        <DialogContent sx={{ color: "#1e293b", fontSize: "14px" }}>
          {selectedRow?.is_paid === 1
            ? "האם הנך בטוח שברצונך לשנות סטטוס הוצאה זו להוצאה שלא שולמה?"
            : "האם הנך בטוח שברצונך לשנות סטטוס הוצאה זו להוצאה ששולמה?"}
        </DialogContent>
        <DialogActions sx={{ gap: "8px", padding: "8px 16px" }}>
          <Button
            onClick={handleCancelStatus}
            sx={{
              color: "#1e293b",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "13px",
              "&:hover": { backgroundColor: "#f1f5f9" },
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleConfirmStatus}
            sx={{
              color: "#ffffff",
              backgroundColor: "#0d9488",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "13px",
              "&:hover": { backgroundColor: "#0f766e" },
            }}
          >
            עדכן
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ExpensesTabView;
