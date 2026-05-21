import { Grid, Typography, Avatar, Select, MenuItem, OutlinedInput } from "@mui/material";
import React from "react";
import { useStyles } from "./Header.style";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationBell from "./NotificationBell/NotificationBell";

function HeaderView({ vacationName, vacationList, pageTitle, familyCount, totalGuests, totalBalance, totalMissing, handleVacationChange }) {
  const classes = useStyles();

  return (
    <Grid className={classes.headerBar}>
      {/* Right side - Vacation selector + family count */}
      <Grid className={classes.rightSection}>
        <Select
          value={vacationName || ""}
          onChange={handleVacationChange}
          displayEmpty
          input={<OutlinedInput className={classes.vacationSelect} />}
          renderValue={(val) => val || "בחר חופשה"}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
              },
            },
          }}
        >
          {vacationList?.map((vacation) => (
            <MenuItem key={vacation.name} value={vacation.name} className={classes.selectedMenuItem}>
              {vacation.name}
            </MenuItem>
          ))}
        </Select>
        {familyCount > 0 && (
          <Grid className={classes.statsChips}>
            <Grid className={classes.chip}>
              <GroupsIcon className={classes.chipIcon} />
              <Typography className={classes.chipText}>{familyCount} משפחות</Typography>
            </Grid>
            <Grid className={classes.chip}>
              <Typography className={classes.chipText}>{totalGuests} אורחים</Typography>
            </Grid>
            <Grid className={classes.chipHideMobile}>
              <Typography className={classes.chipText}>₪{totalBalance.toLocaleString()}</Typography>
            </Grid>
            {totalMissing > 0 && (
              <Grid className={classes.chipWarning}>
                <Typography className={classes.chipTextWarning}>{totalMissing} חסרים</Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>

      {/* Center - Page title */}
      <Typography className={classes.pageTitle}>{pageTitle}</Typography>

      {/* Left side - Notification bell + User avatar */}
      <Grid className={classes.leftSection} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <NotificationBell />
        <Avatar className={classes.avatar}>
          <AccountCircleIcon style={{ fontSize: "30px" }} />
        </Avatar>
      </Grid>
    </Grid>
  );
}

export default HeaderView;
