import React from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useStyles } from "./GuestWizard.style";
import FamilyStep from "./steps/FamilyStep";
import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import TripOptionsStep from "./steps/TripOptionsStep";

const GuestWizardView = (props) => {
  const classes = useStyles();
  const {
    steps,
    activeStep,
    handleNext,
    handleBack,
    submit,
    handleInputChange,
    handleCloseClicked,
    isAddFlow,
    isEditFlow,
  } = props;

  const isLastStep = activeStep === steps.length - 1;
  const currentStepKey = steps[activeStep]?.key;

  const renderStepContent = () => {
    switch (currentStepKey) {
      case "family":
        return <FamilyStep handleInputChange={handleInputChange} />;
      case "personal":
        return <PersonalDetailsStep handleInputChange={handleInputChange} />;
      case "trip":
        return <TripOptionsStep handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.wrapper}>
      {/* Stepper - only show for add flows with multiple steps */}
      {isAddFlow && steps.length > 1 && (
        <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {/* Step content */}
      <div className={classes.stepContent}>
        {renderStepContent()}
      </div>

      {/* Action buttons */}
      <div className={classes.actions}>
        {/* Submit / Next button */}
        {isLastStep || isEditFlow ? (
          <Button onClick={submit} className={classes.submitButton}>
            {isEditFlow ? "עדכן" : "סיום"}
          </Button>
        ) : (
          <Button onClick={handleNext} className={classes.submitButton}>
            הבא
          </Button>
        )}

        {/* Back button - only on step > 0 in add flow */}
        {isAddFlow && activeStep > 0 && (
          <Button onClick={handleBack} className={classes.backButton}>
            הקודם
          </Button>
        )}

        {/* Cancel button */}
        <Button onClick={handleCloseClicked} className={classes.cancelButton}>
          ביטול
        </Button>
      </div>
    </div>
  );
};

export default GuestWizardView;
