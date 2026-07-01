import React from "react";
import GuestImportDialogView from "./GuestImportDialog.view";

// Thin wrapper around the presentational dialog. All state (open / importing /
// result / error) is owned by the Guests container; this keeps the triad
// intact, mirroring FamilyImportDialog.
function GuestImportDialog({ open, onClose, importing, error, result }) {
  return (
    <GuestImportDialogView
      open={open}
      onClose={onClose}
      importing={importing}
      error={error}
      result={result}
    />
  );
}

export default GuestImportDialog;
