import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
} from "@mui/material";
import React from "react";
import { useStyles } from "./FamilyList.style";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useSelector } from "react-redux";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import SearchIcon from "@material-ui/icons/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as EditIcon } from "../../../../../../assets/icons/edit.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function FamilyListView(props) {
  const classes = useStyles();
  const {
    handleDialogTypeOpen,
    handleNameClick,
    filteredFamilyList,
    searchTerm,
    setSearchTerm,
    drawerOpen,
    closeDrawer,
  } = props;

  const headers = ["", "שם משפחה / קבוצה", "קבצים", "יתרה", "נרשמים", "חסרים", "סטטוס"];
  const guests = useSelector((state) => state.userSlice.guests);
  const family = useSelector((state) => state.userSlice.family);

  const isParentIdExist = guests.some((key) => key.is_main_user);
  const guestHeaders = ["", "שם", "חדר", "ערוך", "פרטים", "סטטוס"];

  return (
    <Grid className={classes.pageContainer}>

      {/* ===== FULL-WIDTH TABLE CARD ===== */}
      <div className={classes.tableCard}>
        {/* Toolbar: title | search + add */}
        <div className={classes.tableToolbar}>
          <Typography className={classes.tableTitle}>נרשמים</Typography>

          <div className={classes.toolbarActions}>
            <FormControl>
              <TextField
                size="small"
                className={classes.searchField}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                placeholder="חיפוש..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon style={{ color: "#0d9488", fontSize: "18px" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <IconButton size="small" onClick={() => handleDialogTypeOpen("addFamily")}>
              <AddBoxIcon style={{ color: "#0d9488", fontSize: "24px" }} />
            </IconButton>
          </div>
        </div>

        {/* Scrollable table */}
        <div className={classes.tableWrap}>
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableCell key={index} className={classes.headerTableRow}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className={classes.dataTableBody}>
                {filteredFamilyList?.map((user, index) => {
                  const missing = Number(user?.number_of_guests) - Number(user?.user_in_system_count);
                  return (
                    <TableRow key={index} onClick={() => handleNameClick(user)}>
                      <TableCell className={classes.dataTableCell}>{index + 1}</TableCell>
                      <TableCell className={classes.familyNameCell}>{user.family_name}</TableCell>
                      <TableCell className={classes.dataTableCell}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleDialogTypeOpen("uploadFile", user); }}
                        >
                          <DriveFolderUploadIcon style={{ color: "#0d9488", fontSize: "20px" }} />
                        </IconButton>
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.total_amount === "" || user.total_amount === null
                          ? ""
                          : `₪${(user.total_amount - user.total_paid_amount).toLocaleString()}`}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>{user.number_of_guests}</TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {missing > 0 && <span className={`${classes.statusBadge} ${classes.statusWarning}`}>{missing}</span>}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {missing > 0
                          ? <span className={`${classes.statusBadge} ${classes.statusWarning}`}>חסרים</span>
                          : <span className={`${classes.statusBadge} ${classes.statusOk}`}>תקין</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* ===== DRAWER OVERLAY ===== */}
      <div
        className={`${classes.drawerOverlay} ${drawerOpen ? classes.drawerOverlayOpen : ""}`}
        onClick={closeDrawer}
      />

      {/* ===== SLIDE-IN DRAWER ===== */}
      <div className={`${classes.drawer} ${drawerOpen ? classes.drawerOpen : ""}`}>
        <div className={classes.drawerHeader}>
          <div className={classes.drawerActions}>
            <IconButton className={classes.drawerCloseBtn} onClick={closeDrawer}>
              <CloseIcon style={{ fontSize: "18px", color: "#64748b" }} />
            </IconButton>
            {family.family_id !== undefined &&
              Number(family?.user_in_system_count) < Number(family?.number_of_guests) && (
                <IconButton size="small" onClick={() => handleDialogTypeOpen(isParentIdExist ? "addChild" : "addParent")}>
                  <AddBoxIcon style={{ color: "#0d9488", fontSize: "24px" }} />
                </IconButton>
              )}
          </div>
          <div className={classes.drawerTitleArea}>
            <Typography className={classes.drawerTitle}>
              {family.family_id !== undefined ? family.family_name : "בחר משפחה"}
            </Typography>
            <Typography className={classes.drawerSubtitle}>
              {family.family_id !== undefined ? `· ${guests?.length || 0} אורחים` : ""}
            </Typography>
          </div>
        </div>

        <div className={classes.drawerBody}>
          {family.family_id !== undefined && guests?.length > 0 ? (
            <TableContainer>
              <Table size="small" stickyHeader className={classes.drawerGuestTable}>
                <TableHead>
                  <TableRow>
                    {guestHeaders.map((header, index) => (
                      <TableCell key={index} className={classes.headerTableRow}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className={classes.dataTableBody}>
                  {guests?.map((user, index) => (
                    <TableRow
                      key={index}
                      style={user.is_main_user ? { background: "rgba(13, 148, 136, 0.08)" } : {}}
                    >
                      <TableCell className={classes.dataTableCell}>{index + 1}</TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.hebrew_first_name + " " + user.hebrew_last_name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>{user.room_id}</TableCell>
                      <TableCell className={classes.dataTableCell}>
                        <IconButton size="small" onClick={() => handleDialogTypeOpen(user.is_main_user ? "editParent" : "editChild", user)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        <IconButton size="small" onClick={() => handleDialogTypeOpen(user.is_main_user ? "parentDetails" : "childDetails", user)}>
                          <DescriptionIcon style={{ color: "#f59e0b", fontSize: "20px" }} />
                        </IconButton>
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        <IconButton size="small" onClick={() => handleDialogTypeOpen(user.is_main_user ? "parentDetails" : "childDetails", user)}>
                          <CheckCircleIcon
                            style={{
                              color: user.is_main_user ? "#22c55e" : user.address !== null ? "#f59e0b" : "#ef4444",
                              fontSize: "22px",
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.drawerEmpty}>
              <GroupsIcon style={{ fontSize: "40px", color: "#e2e8f0" }} />
              <Typography className={classes.drawerEmptyText}>
                {family.family_id !== undefined ? "אין אורחים רשומים" : "בחר משפחה מהטבלה"}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Grid>
  );
}

export default FamilyListView;
