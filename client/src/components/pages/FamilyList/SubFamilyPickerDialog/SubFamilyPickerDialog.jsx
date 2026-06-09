import React from "react";
import SubFamilyPickerDialogView from "./SubFamilyPickerDialog.view";

// Pure pass-through: the picker has no state of its own — the options are
// computed at the button click in FamilyList and the choice is handed back via
// onPick. Kept as a container/view pair for layout consistency.
const SubFamilyPickerDialog = (props) => <SubFamilyPickerDialogView {...props} />;

export default SubFamilyPickerDialog;
