import React from "react";
import { useParams } from "react-router-dom";
import PublicLinkShell from "./PublicLinkShell";
import RegistrationScreen from "./RegistrationScreen";

// Page-level container: reads :vacationId / :token from the URL and wires
// the verify-shell to the registration content.
const PublicRegistration = () => {
  const { vacationId, token } = useParams();

  return (
    <PublicLinkShell vacationId={vacationId} token={token}>
      {({ pageData, verifyToken, formData }) => (
        <RegistrationScreen
          vacationId={vacationId}
          token={token}
          pageData={pageData}
          verifyToken={verifyToken}
          formData={formData}
        />
      )}
    </PublicLinkShell>
  );
};

export default PublicRegistration;
