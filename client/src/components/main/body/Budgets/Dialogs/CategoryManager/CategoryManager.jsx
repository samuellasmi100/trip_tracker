import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../../apis/budgetsRequest";
import CategoryManagerView from "./CategoryManager.view";

const CategoryManager = ({ closeModal }) => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const budgetActiveTab = useSelector((state) => state.budgetSlice.activeTab);
  const categories = useSelector((state) => state.budgetSlice.categories);
  const subCategories = useSelector((state) => state.budgetSlice.subCategories);
  const incomeCategories = useSelector((state) => state.budgetSlice.incomeCategories);
  const incomeSubCategories = useSelector((state) => state.budgetSlice.incomeSubCategories);

  // 0 = expense categories, 1 = income categories
  const [categoryTab, setCategoryTab] = useState(budgetActiveTab === 1 ? 1 : 0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
  const [editName, setEditName] = useState("");

  const isExpenseTab = categoryTab === 0;
  const currentCategories = isExpenseTab ? categories : incomeCategories;
  const currentSubCategories = isExpenseTab ? subCategories : incomeSubCategories;

  const fetchCategories = async () => {
    if (!vacationId) return;
    try {
      if (isExpenseTab) {
        const res = await ApiBudgets.getCategories(token, vacationId);
        dispatch(budgetSlice.setCategories(res.data));
      } else {
        const res = await ApiBudgets.getIncomeCategories(token, vacationId);
        dispatch(budgetSlice.setIncomeCategories(res.data));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (catId) => {
    if (!vacationId || !catId) return;
    try {
      if (isExpenseTab) {
        const res = await ApiBudgets.getSubCategories(token, vacationId, catId);
        dispatch(budgetSlice.setSubCategories(res.data));
      } else {
        const res = await ApiBudgets.getIncomeSubCategories(token, vacationId, catId);
        dispatch(budgetSlice.setIncomeSubCategories(res.data));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    setSelectedCategory(null);
    dispatch(budgetSlice.setSubCategories([]));
    dispatch(budgetSlice.setIncomeSubCategories([]));
  }, [categoryTab, vacationId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory.id);
    }
  }, [selectedCategory]);

  // Category actions
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      if (isExpenseTab) {
        const res = await ApiBudgets.addCategory(token, vacationId, { name: newCategoryName });
        dispatch(budgetSlice.setCategories(res.data));
      } else {
        const res = await ApiBudgets.addIncomeCategory(token, vacationId, { name: newCategoryName });
        dispatch(budgetSlice.setIncomeCategories(res.data));
      }
      setNewCategoryName("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editName.trim()) return;
    try {
      if (isExpenseTab) {
        const res = await ApiBudgets.updateCategory(token, vacationId, { categoryId: id, name: editName });
        dispatch(budgetSlice.setCategories(res.data));
      } else {
        const res = await ApiBudgets.updateIncomeCategory(token, vacationId, { categoryId: id, name: editName });
        dispatch(budgetSlice.setIncomeCategories(res.data));
      }
      setEditingCategoryId(null);
      setEditName("");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      if (isExpenseTab) {
        const res = await ApiBudgets.deleteCategory(token, vacationId, id);
        dispatch(budgetSlice.setCategories(res.data));
      } else {
        const res = await ApiBudgets.deleteIncomeCategory(token, vacationId, id);
        dispatch(budgetSlice.setIncomeCategories(res.data));
      }
      if (selectedCategory?.id === id) {
        setSelectedCategory(null);
        dispatch(budgetSlice.setSubCategories([]));
        dispatch(budgetSlice.setIncomeSubCategories([]));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // SubCategory actions
  const handleAddSubCategory = async () => {
    if (!newSubCategoryName.trim() || !selectedCategory) return;
    try {
      if (isExpenseTab) {
        const res = await ApiBudgets.addSubCategory(token, vacationId, {
          categoryId: selectedCategory.id,
          name: newSubCategoryName,
        });
        dispatch(budgetSlice.setSubCategories(res.data));
      } else {
        const res = await ApiBudgets.addIncomeSubCategory(token, vacationId, {
          categoryId: selectedCategory.id,
          name: newSubCategoryName,
        });
        dispatch(budgetSlice.setIncomeSubCategories(res.data));
      }
      setNewSubCategoryName("");
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleUpdateSubCategory = async (id) => {
    if (!editName.trim() || !selectedCategory) return;
    try {
      if (isExpenseTab) {
        const res = await ApiBudgets.updateSubCategory(token, vacationId, {
          subCategoryId: id,
          name: editName,
          categoryId: selectedCategory.id,
        });
        dispatch(budgetSlice.setSubCategories(res.data));
      } else {
        const res = await ApiBudgets.updateIncomeSubCategory(token, vacationId, {
          subCategoryId: id,
          name: editName,
          categoryId: selectedCategory.id,
        });
        dispatch(budgetSlice.setIncomeSubCategories(res.data));
      }
      setEditingSubCategoryId(null);
      setEditName("");
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (!selectedCategory) return;
    try {
      if (isExpenseTab) {
        const res = await ApiBudgets.deleteSubCategory(token, vacationId, id, selectedCategory.id);
        dispatch(budgetSlice.setSubCategories(res.data));
      } else {
        const res = await ApiBudgets.deleteIncomeSubCategory(token, vacationId, id, selectedCategory.id);
        dispatch(budgetSlice.setIncomeSubCategories(res.data));
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const startEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditName(cat.name);
    setEditingSubCategoryId(null);
  };

  const startEditSubCategory = (sub) => {
    setEditingSubCategoryId(sub.id);
    setEditName(sub.name);
    setEditingCategoryId(null);
  };

  return (
    <CategoryManagerView
      categoryTab={categoryTab}
      setCategoryTab={setCategoryTab}
      currentCategories={currentCategories}
      currentSubCategories={currentSubCategories}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      newCategoryName={newCategoryName}
      setNewCategoryName={setNewCategoryName}
      newSubCategoryName={newSubCategoryName}
      setNewSubCategoryName={setNewSubCategoryName}
      editingCategoryId={editingCategoryId}
      editingSubCategoryId={editingSubCategoryId}
      editName={editName}
      setEditName={setEditName}
      handleAddCategory={handleAddCategory}
      handleUpdateCategory={handleUpdateCategory}
      handleDeleteCategory={handleDeleteCategory}
      handleAddSubCategory={handleAddSubCategory}
      handleUpdateSubCategory={handleUpdateSubCategory}
      handleDeleteSubCategory={handleDeleteSubCategory}
      startEditCategory={startEditCategory}
      startEditSubCategory={startEditSubCategory}
      setEditingCategoryId={setEditingCategoryId}
      setEditingSubCategoryId={setEditingSubCategoryId}
      closeModal={closeModal}
    />
  );
};

export default CategoryManager;
