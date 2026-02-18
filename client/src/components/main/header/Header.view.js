import { Grid, Typography, Avatar } from "@mui/material";
import React from "react";
import { useStyles } from "./Header.style";
import LuggageIcon from "@mui/icons-material/Luggage";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function HeaderView({ vacationName, pageTitle, familyCount }) {
  const classes = useStyles();

  return (
    <Grid className={classes.headerBar}>
      {/* Right side - Page title & breadcrumb */}
      <Grid className={classes.rightSection}>
        <Typography className={classes.pageTitle}>{pageTitle}</Typography>
      </Grid>

      {/* Center - Vacation info chips */}
      <Grid className={classes.centerSection}>
        {vacationName ? (
          <>
            <Grid className={classes.chip}>
              <LuggageIcon className={classes.chipIcon} />
              <Typography className={classes.chipText}>{vacationName}</Typography>
            </Grid>
            {familyCount > 0 && (
              <Grid className={classes.chip}>
                <GroupsIcon className={classes.chipIcon} />
                <Typography className={classes.chipText}>
                  {familyCount} משפחות
                </Typography>
              </Grid>
            )}
          </>
        ) : (
          <Typography className={classes.noVacation}>
            בחר חופשה כדי להתחיל
          </Typography>
        )}
      </Grid>

      {/* Left side - User avatar */}
      <Grid className={classes.leftSection}>
        <Avatar className={classes.avatar}>
          <AccountCircleIcon style={{ fontSize: "32px" }} />
        </Avatar>
      </Grid>
    </Grid>
  );
}

export default HeaderView;
