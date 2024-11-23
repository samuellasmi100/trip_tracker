import React from "react";
import FamilyMemberView from "./FamilyMember.view";

const FamilyMember = ({handleDialogTypeOpen}) => {


  return(
  <>
  <FamilyMemberView handleDialogTypeOpen={handleDialogTypeOpen}/>;

  </>
  )
};

export default FamilyMember;
