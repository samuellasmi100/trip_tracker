import React from "react";
import {
  AppBar,
  ClickAwayListener,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { StyledTooltip, useStyles } from "./Sidebar.style";
import { ReactComponent as Database } from "../../../assets/icons/database.svg";
import { ReactComponent as ClientInfo } from "../../../assets/icons/client-info.svg";
import { ReactComponent as Static } from "../../../assets/icons/static_select.svg";

import { Link, useLocation } from "react-router-dom";

import clsx from "clsx";

import AnalyticsIcon from '@mui/icons-material/Analytics';

function SidebarView({
  logoutButtonFunction,
  handleMenuOpen,
  handleMenuClose,
  menuOpen,
}) {
  const iconRef = React.useRef(null);
  const classes = useStyles();
  const { pathname } = useLocation();

  return (
    <AppBar className={classes.sideBarSx} style={{ width: "3vw", height: "100vh" }}>
      <Grid style={{ margin: "15px auto" }} />
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "100%" }}
      >
        {/* // * top icons */}
        <Grid
          item
          container
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item className={classes.sideBarIcons}>
            <Link to="workspace">
              <StyledTooltip title="סביבת עבודה" placement="bottom-end" arrow>
                <Database
                  fill={clsx({
                    ["#ffffff"]: pathname.includes("/workspace"),
                    ["#828282"]: !pathname.includes("/workspace"),
                  })}
                />
              </StyledTooltip>
            </Link>
          </Grid>
          <Grid item className={classes.sideBarIcons}>
            <Link to="static">
              <StyledTooltip title="מידע כולל" placement="bottom-end" arrow>
                <Static
                  style={{
                    fill: pathname.includes("/static") ? "#ffffff" : "#828282"
                  }}
                />
              </StyledTooltip>
            </Link>
          </Grid>
          <Grid item className={classes.sideBarIcons}>
            <Link to="budgets">
              <StyledTooltip title="תקציב" placement="bottom-end" arrow>
                <AnalyticsIcon
                  style={{
                    fill: pathname.includes("/budgets") ? "#ffffff" : "#828282",width:"28px",height:"30px" 
                  }}
                />
              </StyledTooltip>
            </Link>
          </Grid>
        </Grid>
        {/* // * bottom icons */}
        <Grid
          item
          xs={1}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{ gap: "20px" }}
        >
          {/* </Link> */}

          <ClickAwayListener onClickAway={handleMenuClose}>
            <div style={{ position: "relative" }}>
              <IconButton ref={iconRef} onClick={handleMenuOpen}>
                <ClientInfo
                  fill={clsx({
                    ["#ffffff"]: pathname.includes("/"),
                    ["#828282"]: !pathname.includes("/"),
                  })}
                />
              </IconButton>
              <Menu
                anchorEl={iconRef.current}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                getContentAnchorEl={null}
                open={menuOpen}
                onClose={handleMenuClose}
                style={{ position: "absolute", top: "-30px", left: "25px" }}
              >
                <MenuItem onClick={logoutButtonFunction}>התנתקות</MenuItem>
              </Menu>
            </div>
          </ClickAwayListener>
        </Grid>
      </Grid>
    </AppBar>
  );
}

export default SidebarView;