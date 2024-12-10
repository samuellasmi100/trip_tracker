import React, { useState, useEffect } from "react";
import StaticView from "./Static.view";
import { Button, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as staticSlice from "../../../../store/slice/staticSlice";
import * as vacationSlice from "../../../../store/slice/vacationSlice";
import Rooms from "./Rooms/Rooms";
import MainDialog from "./MainDialog/MainDialog";
import ApiVacations from "../../../../apis/vacationRequest";
import "./Static.css";
import { useStyles } from "./Static.style";
import PaymentIcon from '@mui/icons-material/Payment';
const Static = () => {


  const [searchTerm, setSearchTerm] = useState("");
  const dialogOpen = useSelector((state) => state.staticSlice.open);
  const dispatch = useDispatch();
  const activeButton = useSelector((state) => state.staticSlice.activeButton);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const token = sessionStorage.getItem("token");
  const classes = useStyles();

  const handleButtonClick = async (buttonName) => {
    dispatch(staticSlice.updateActiveButton(buttonName));
  };

  const closeModal = () => {
    dispatch(staticSlice.closeModal());
  };

  const handleDialogTypeOpen = (type, room) => {
    dispatch(staticSlice.updateDialogType(type));
    if (type === "editRoom") {
      dispatch(staticSlice.updateForm(room));
      dispatch(staticSlice.openModal());
    } else if (type === "showAvailableDates") {
      dispatch(staticSlice.updateForm(room));
      dispatch(staticSlice.openModal());
    }
  };


  const getVacations = async () => {
    try {
      const response = await ApiVacations.getVacations(token, vacationId);
      if (response?.data?.vacationsDate?.length > 0) {
        dispatch(
          vacationSlice.updateVacationDatesList(response?.data?.vacationsDate)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVacations();
  }, []);

 const handleWidgetClick = (name) => {
  dispatch(staticSlice.openModal());
  dispatch(staticSlice.updateDialogType(name));
 }
  return (
    <Grid
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        margin: "0 auto",
        gap: "10px",
        border: "1px solid transparent",
        maxWidth: "100vw"
      }}
    >
      <Grid className={classes.containerGrid}>
        <Button className={classes.button}onClick={() => handleWidgetClick("rooms")}>
          <Grid className={classes.dataGrid}>
          <Grid className={classes.headerBox}>
              <Typography className={classes.header}>רשימת חדרים</Typography>
              </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid className={classes.containerGrid}>
        <Button className={classes.button}  onClick={() => handleWidgetClick("roomsStatus")}>
          <Grid className={classes.dataGrid}>
          <Grid className={classes.headerBox}>
              <Typography className={classes.header}>סטטוס חדרים</Typography>
              </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid className={classes.containerGrid}>
        <Button className={classes.button}onClick={() => handleWidgetClick("payments")}>
          <Grid className={classes.dataGrid}>
            <Grid className={classes.headerBox}>
              <Typography className={classes.header}>תשלומים</Typography>
              </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid className={classes.containerGrid}>
        <Button className={classes.button}  onClick={() => handleWidgetClick("registers")}>
          <Grid className={classes.dataGrid}>
          <Grid className={classes.headerBox}>
              <Typography className={classes.header}>נרשמים</Typography>
              </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid className={classes.containerGrid}>
        <Button className={classes.button}  onClick={() => handleWidgetClick("allGuests")}>
          <Grid className={classes.dataGrid}>
          <Grid className={classes.headerBox}>
              <Typography className={classes.header}>כלל האורחים</Typography>
              </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid className={classes.containerGrid}>
        <Button className={classes.button}  onClick={() => handleWidgetClick("hotels")}>
          <Grid className={classes.dataGrid}>
          <Grid className={classes.headerBox}>
              <Typography className={classes.header}>מלונות</Typography>
              </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid className={classes.containerGrid}>
        <Button className={classes.button}  onClick={() => handleWidgetClick("payments")}>
          <Grid className={classes.dataGrid}>
          <Grid className={classes.headerBox}>
              <Typography className={classes.header}>חופשות</Typography>
              </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid className={classes.containerGrid}>
        <Button className={classes.button} onClick={() => handleWidgetClick("flights")}>
          <Grid className={classes.dataGrid}>
          <Grid className={classes.headerBox}>
              <Typography className={classes.header}>טיסות</Typography>
              </Grid>
          </Grid>
        </Button>
      </Grid>

      {/* <StaticView
        handleButtonClick={handleButtonClick}
        handleNavButtonClicked={handleNavButtonClicked}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}

      />; */}
      <MainDialog dialogOpen={dialogOpen} closeModal={closeModal} />
    </Grid>
  );
};

export default Static;
