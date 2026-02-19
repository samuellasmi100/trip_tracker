import React from "react";
import { Tabs, Tab, Button, Tooltip } from "@mui/material";
import { useStyles } from "./Budgets.style";
import ExpensesTab from "./ExpensesTab/ExpensesTab";
import IncomeTab from "./IncomeTab/IncomeTab";
import SummaryTab from "./SummaryTab/SummaryTab";
import MainDialog from "./Dialogs/MainDialog/MainDialog";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

function BudgetsView({
  activeTab,
  handleTabChange,
  handleOpenAdd,
  handleOpenEdit,
  handleOpenCategories,
  handleOpenSettings,
  dialogOpen,
  dialogType,
  closeModal,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* Header */}
      <div className={classes.header}>
        <div className={classes.headerActions}>
          {activeTab !== 2 && (
            <>
              <Button
                className={classes.categoryButton}
                onClick={handleOpenCategories}
              >
                ניהול קטגוריות
              </Button>
              <Button
                className={classes.addButton}
                onClick={handleOpenAdd}
                startIcon={<AddIcon />}
              >
                {activeTab === 0 ? "הוסף הוצאה" : "הוסף הכנסה"}
              </Button>
            </>
          )}
        </div>
        <Tooltip title="הגדרות">
          <Button
            className={classes.settingsButton}
            onClick={handleOpenSettings}
          >
            <SettingsIcon fontSize="small" />
          </Button>
        </Tooltip>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        className={classes.tabs}
        sx={{ borderBottom: "1px solid #e2e8f0", marginBottom: "16px" }}
      >
        <Tab label="הוצאות" className={classes.tab} />
        <Tab label="הכנסות" className={classes.tab} />
        <Tab label="סיכום" className={classes.tab} />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && <ExpensesTab handleOpenEdit={handleOpenEdit} />}
      {activeTab === 1 && <IncomeTab handleOpenEdit={handleOpenEdit} />}
      {activeTab === 2 && <SummaryTab />}

      {/* Dialog */}
      <MainDialog
        dialogOpen={dialogOpen}
        dialogType={dialogType}
        closeModal={closeModal}
      />
    </div>
  );
}

export default BudgetsView;
