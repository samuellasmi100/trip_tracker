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
import FlightDetailsStep from "./steps/FlightDetailsStep";
import NotesStep from "./steps/NotesStep";

const GuestWizardView = (props) => {
  const classes = useStyles();
  const {
    steps,
    activeStep,
    setActiveStep,
    submit,
    submitAndClose,
    submitAndContinue,
    handleInputChange,
    handleCloseClicked,
    isAddFlow,
    isAddGuest,
    isEditFlow,
    dialogType,
  } = props;

  const isAddFamily = dialogType === "addFamily";
  const isLastStep = activeStep === steps.length - 1;
  const currentStepKey = steps[activeStep]?.key;

  const renderContent = () => {
    switch (currentStepKey) {
      case "family":
        return <FamilyStep handleInputChange={handleInputChange} />;
      case "personal":
        return <PersonalDetailsStep handleInputChange={handleInputChange} />;
      case "trip":
        return <TripOptionsStep handleInputChange={handleInputChange} />;
      case "flights":
        return <FlightDetailsStep />;
      case "notes":
        return <NotesStep />;
      default:
        return null;
    }
  };

  // Side nav layout for addParent / addChild
  if (isAddGuest) {
    return (
      <div className={classes.sideNavWrapper}>
        {/* Side nav */}
        <div className={classes.sideNav}>
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`${classes.navItem} ${activeStep === index ? classes.navItemActive : ""}`}
              onClick={() => setActiveStep(index)}
            >
              <span>{step.label}</span>
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className={classes.sideNavContentArea}>
          <div className={classes.sideNavContentScroll}>
            {renderContent()}
          </div>

          {/* Action buttons */}
          <div className={classes.sideNavActions}>
            <Button onClick={submitAndClose} className={classes.submitButton}>
              שמור וסגור
            </Button>
            <Button onClick={submitAndContinue} className={classes.continueButton}>
              שמור והמשך
            </Button>
            <Button onClick={handleCloseClicked} className={classes.cancelButton}>
              ביטול
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Stepper layout for addFamily
  return (
    <div className={classes.wrapper}>
      {isAddFamily && steps.length > 1 && (
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
        {isAddFamily && (
          isLastStep ? (
            <Button onClick={submit} className={classes.submitButton}>סיום</Button>
          ) : (
            <Button onClick={() => setActiveStep(activeStep + 1)} className={classes.submitButton}>הבא</Button>
          )
        )}

        {isEditFlow && (
          <Button onClick={submit} className={classes.submitButton}>עדכן</Button>
        )}

        {isAddFamily && activeStep > 0 && (
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
