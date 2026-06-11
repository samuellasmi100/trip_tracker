import React from "react";
import FamilyImportDialogView from "./FamilyImportDialog.view";

// Thin wrapper around the presentational dialog. All state (open / importing /
// result) is owned by the FamilyList container; this keeps the triad intact.
function FamilyImportDialog({ open, onClose, importing, error, result }) {
  return (
    <FamilyImportDialogView
      open={open}
      onClose={onClose}
      importing={importing}
      error={error}
      result={result}
    />
  );
}

export default FamilyImportDialog;
