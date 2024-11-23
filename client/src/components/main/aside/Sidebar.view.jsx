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
import { ReactComponent as MakorIcon } from "../../../assets/icons/sidebar-makor.svg";
import { ReactComponent as Database } from "../../../assets/icons/database.svg";
import { ReactComponent as Reports } from "../../../assets/icons/reports.svg";
import { ReactComponent as ClientInfo } from "../../../assets/icons/client-info.svg";
import { ReactComponent as Support } from "../../../assets/icons/support.svg";

import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";

function SidebarView({
  logoutButtonFunction,
  handleMenuOpen,
  handleMenuClose,
  menuOpen,
  handleButtonClick,
}) {
  const permission = useSelector((state) => +state.userSlice.permission);
  const privileges = useSelector((state) => state.userSlice.privileges);
  // const { viewAsClientUser } = useSelector((state) => state.impersonationSlice);
  const viewAsClientUser = []
  const iconRef = React.useRef(null);
  const classes = useStyles();
  const { pathname } = useLocation();

  const handleUserPrivileges = () => {

      return (
        <>
          <Grid item className={classes.sideBarIcons}>
            <Link to="workspace">
              <StyledTooltip title="Workspace" placement="bottom-end" arrow>
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
            <Link to="reports">
              <StyledTooltip title="Reports" placement="bottom-end" arrow>
                <Reports
                  fill={clsx({
                    ["#ffffff"]: pathname.includes("/reports"),
                    ["#828282"]: !pathname.includes("/reports"),
                  })}
                />
              </StyledTooltip>
            </Link>
          </Grid>
        </>
      );
    }
   

  return (
    <AppBar className={classes.sideBarSx}>
      <MakorIcon style={{ margin: "10 auto" }} />
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
          {handleUserPrivileges()}

            <Grid item className={classes.sideBarIcons}>
              <Link to="client_info">
                <StyledTooltip title="Static" placement="bottom-end" arrow>
                  <ClientInfo
                    fill={clsx({
                      ["#ffffff"]: pathname.includes("/client_info"),
                      ["#828282"]: !pathname.includes("/client_info"),
                    })}
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
          {/* <Link onClick={handleButtonClick}> */}


          <StyledTooltip title="Support" placement="bottom-end" arrow>
            <IconButton onClick={handleButtonClick}>
              <Support />
            </IconButton>
          </StyledTooltip>
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
                <MenuItem onClick={logoutButtonFunction}>Logout</MenuItem>
              </Menu>
            </div>
          </ClickAwayListener>
        </Grid>
      </Grid>
    </AppBar>
  );
}

export default SidebarView;