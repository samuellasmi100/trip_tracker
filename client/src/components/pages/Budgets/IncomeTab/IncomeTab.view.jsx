import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useStyles } from "./IncomeTab.style";
import SummaryCard from "../shared/SummaryCard";
import SearchBar from "../shared/SearchBar";
import StatusFilter from "../shared/StatusFilter";
import UnifiedTable from "../shared/UnifiedTable";

function IncomeTabView({
  income,
  handleOpenEdit,
  handleDelete,
  handleStatusToggle,
  confirmOpen,
  selectedRow,
  handleConfirmStatus,
  handleCancelStatus,
}) {
  const classes = useStyles();
  const totalReceived = useSelector((state) => state.budgetSlice.incomeTotalReceived);
  const totalPlanned = useSelector((state) => state.budgetSlice.incomeTotalPlanned);

  return (
    <div className={classes.root}>
      {/* Summary Cards */}
      <div className={classes.cardsRow}>
        <SummaryCard title="סה״כ מתוכנן" value={totalPlanned} color="#64748b" />
        <SummaryCard title="סה״כ התקבל" value={totalReceived} color="#0d9488" />
        <SummaryCard
          title="נותר לקבל"
          value={totalPlanned - totalReceived}
          color="#f59e0b"
        />
      </div>

      {/* Search + Filter */}
      <div className={classes.filtersRow}>
        <SearchBar />
        <StatusFilter />
      </div>

      {/* Table */}
      <UnifiedTable
        data={income}
        type="income"
        onEdit={(row) => handleOpenEdit(row, "editIncome")}
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
            ? "האם הנך בטוח שברצונך לשנות סטטוס הכנסה זו להכנסה שלא התקבלה?"
            : "האם הנך בטוח שברצונך לשנות סטטוס הכנסה זו להכנסה שהתקבלה?"}
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

export default IncomeTabView;
