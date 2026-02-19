import React from "react";
import UnifiedTableView from "./UnifiedTable.view";

const UnifiedTable = ({ data, type, onEdit, onDelete, onStatusToggle }) => {
  return (
    <UnifiedTableView
      data={data}
      type={type}
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusToggle={onStatusToggle}
    />
  );
};

export default UnifiedTable;
