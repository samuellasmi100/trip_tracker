import React from "react";
import {
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { useStyles } from "./CategoryManager.style";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const CategoryManagerView = ({
  categoryTab,
  setCategoryTab,
  currentCategories,
  currentSubCategories,
  selectedCategory,
  setSelectedCategory,
  newCategoryName,
  setNewCategoryName,
  newSubCategoryName,
  setNewSubCategoryName,
  editingCategoryId,
  editingSubCategoryId,
  editName,
  setEditName,
  handleAddCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  handleAddSubCategory,
  handleUpdateSubCategory,
  handleDeleteSubCategory,
  startEditCategory,
  startEditSubCategory,
  setEditingCategoryId,
  setEditingSubCategoryId,
  closeModal,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>ניהול קטגוריות</Typography>

      {/* Expense / Income toggle */}
      <div className={classes.tabsContainer}>
        <Button
          className={categoryTab === 0 ? classes.tabButtonActive : classes.tabButton}
          onClick={() => setCategoryTab(0)}
        >
          קטגוריות הוצאות
        </Button>
        <Button
          className={categoryTab === 1 ? classes.tabButtonActive : classes.tabButton}
          onClick={() => setCategoryTab(1)}
        >
          קטגוריות הכנסות
        </Button>
      </div>

      {/* Two-panel layout */}
      <div className={classes.panelContainer}>
        {/* Categories Panel */}
        <div className={classes.panel}>
          <div className={classes.panelHeader}>
            <Typography className={classes.panelTitle}>קטגוריות</Typography>
          </div>
          <div className={classes.panelList}>
            {(currentCategories || []).map((cat) => (
              <div
                key={cat.id}
                className={`${classes.listItem} ${selectedCategory?.id === cat.id ? classes.listItemSelected : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setEditingCategoryId(null);
                }}
              >
                {editingCategoryId === cat.id ? (
                  <div style={{ display: "flex", gap: "4px", alignItems: "center", flex: 1 }}>
                    <TextField
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={classes.addInput}
                      size="small"
                      autoFocus
                      sx={{ flex: 1 }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateCategory(cat.id);
                        if (e.key === "Escape") setEditingCategoryId(null);
                      }}
                    />
                    <IconButton size="small" onClick={() => handleUpdateCategory(cat.id)}>
                      <CheckIcon sx={{ fontSize: 16, color: "#0d9488" }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => setEditingCategoryId(null)}>
                      <CloseIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <Typography className={classes.listItemText}>{cat.name}</Typography>
                    <div style={{ display: "flex", gap: "2px" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditCategory(cat);
                        }}
                      >
                        <EditIcon sx={{ fontSize: 15, color: "#64748b" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 15, color: "#ef4444" }} />
                      </IconButton>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className={classes.addRow}>
            <TextField
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="קטגוריה חדשה..."
              className={classes.addInput}
              size="small"
              sx={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory();
              }}
            />
            <IconButton onClick={handleAddCategory} size="small">
              <AddCircleOutlineIcon sx={{ color: "#0d9488" }} />
            </IconButton>
          </div>
        </div>

        {/* SubCategories Panel */}
        <div className={classes.panel}>
          <div className={classes.panelHeader}>
            <Typography className={classes.panelTitle}>
              {selectedCategory
                ? `תת קטגוריות - ${selectedCategory.name}`
                : "בחר קטגוריה"}
            </Typography>
          </div>
          <div className={classes.panelList}>
            {!selectedCategory ? (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#94a3b8",
                  padding: "40px 0",
                  fontSize: "13px",
                }}
              >
                בחר קטגוריה כדי לראות תת קטגוריות
              </Typography>
            ) : (
              (currentSubCategories || []).map((sub) => (
                <div key={sub.id} className={classes.listItem}>
                  {editingSubCategoryId === sub.id ? (
                    <div style={{ display: "flex", gap: "4px", alignItems: "center", flex: 1 }}>
                      <TextField
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={classes.addInput}
                        size="small"
                        autoFocus
                        sx={{ flex: 1 }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateSubCategory(sub.id);
                          if (e.key === "Escape") setEditingSubCategoryId(null);
                        }}
                      />
                      <IconButton size="small" onClick={() => handleUpdateSubCategory(sub.id)}>
                        <CheckIcon sx={{ fontSize: 16, color: "#0d9488" }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => setEditingSubCategoryId(null)}>
                        <CloseIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                      </IconButton>
                    </div>
                  ) : (
                    <>
                      <Typography className={classes.listItemText}>{sub.name}</Typography>
                      <div style={{ display: "flex", gap: "2px" }}>
                        <IconButton
                          size="small"
                          onClick={() => startEditSubCategory(sub)}
                        >
                          <EditIcon sx={{ fontSize: 15, color: "#64748b" }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSubCategory(sub.id)}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 15, color: "#ef4444" }} />
                        </IconButton>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
          {selectedCategory && (
            <div className={classes.addRow}>
              <TextField
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                placeholder="תת קטגוריה חדשה..."
                className={classes.addInput}
                size="small"
                sx={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddSubCategory();
                }}
              />
              <IconButton onClick={handleAddSubCategory} size="small">
                <AddCircleOutlineIcon sx={{ color: "#0d9488" }} />
              </IconButton>
            </div>
          )}
        </div>
      </div>

      {/* Close button */}
      <div className={classes.closeButton}>
        <Button
          onClick={closeModal}
          sx={{
            color: "#64748b",
            textTransform: "none",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "6px 28px",
            "&:hover": { backgroundColor: "#f8fafc" },
          }}
        >
          סגור
        </Button>
      </div>
    </div>
  );
};

export default CategoryManagerView;
