import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useStyles } from "./Static.style";
import { useSelector } from "react-redux";


function StaticView({ handleWidgetClick}) {
  const classes = useStyles();

  const headers = ["חדרים", "מלונות","אורחים","תשלומים","חופשות"];
  const activeButton = useSelector((state) => state.staticSlice.activeButton)

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
        <Button className={classes.button}  onClick={() => handleWidgetClick("vacations")}>
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

  
    </Grid>
   );
}

export default StaticView;
