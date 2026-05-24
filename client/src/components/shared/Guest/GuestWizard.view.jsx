import React from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useStyles } from "./GuestWizard.style";
import FamilyStep from "./steps/FamilyStep";
import TripOptionsStep from "./steps/TripOptionsStep";

// addFamily stepper view (family details -> trip/order details).
const GuestWizardView = (props) => {
  const classes = useStyles();
  const {
    steps,
    activeStep,
    setActiveStep,
    submit,
    handleInputChange,
    handleCloseClicked,
  } = props;

  const isLastStep = activeStep === steps.length - 1;
  const currentStepKey = steps[activeStep]?.key;

  const renderContent = () => {
    switch (currentStepKey) {
      case "family":
        return <FamilyStep handleInputChange={handleInputChange} />;
      case "trip":
        return <TripOptionsStep handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.wrapper}>
      {steps.length > 1 && (
        <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {/* Content */}
      <div className={classes.stepContent}>
        {renderContent()}
      </div>

      {/* Action buttons */}
      <div className={classes.actions}>
        {isLastStep ? (
          <Button onClick={submit} className={classes.submitButton}>סיום</Button>
        ) : (
          <Button onClick={() => setActiveStep(activeStep + 1)} className={classes.submitButton}>הבא</Button>
        )}

        {activeStep > 0 && (
          <Button onClick={() => setActiveStep(activeStep - 1)} className={classes.backButton}>
            הקודם
          </Button>
        )}

        <Button onClick={handleCloseClicked} className={classes.cancelButton}>
          ביטול
        </Button>
      </div>
    </div>
  );
};

export default GuestWizardView;
