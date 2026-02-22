import React from "react";
import { Button, Typography } from "@mui/material";
import { useStyles } from "../Guest/GuestWizard.style";
import Flights from "./Flights/Flights";

const ReservationView = (props) => {
  const classes = useStyles();
  const { handleInputChange, submit, handleCloseClicked } = props;

  return (
    <div className={classes.wrapper}>
      {/* Flights Section */}
      <div className={classes.sectionCard}>
        <Typography className={classes.sectionTitle}>
          טיסות ואפשרויות
        </Typography>
        <Flights handleInputChange={handleInputChange} />
      </div>

      {/* Action buttons */}
      <div className={classes.actions}>
        <Button onClick={submit} className={classes.submitButton}>
          עדכן
        </Button>
        <Button onClick={handleCloseClicked} className={classes.cancelButton}>
          סגור
        </Button>
      </div>
    </div>
  );
};

export default ReservationView;
