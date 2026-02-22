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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import React from "react";
import { useStyles } from "./FamilyList.style";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useSelector } from "react-redux";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import LinkIcon from "@mui/icons-material/Link";
import CheckIcon from "@mui/icons-material/Check";
import GestureIcon from "@mui/icons-material/Gesture";
import SearchIcon from "@material-ui/icons/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as EditIcon } from "../../../../../../assets/icons/edit.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { formatDateInput, isoToDisplay } from "../../../../../../utils/HelperFunction/formatDate";

function FamilyListView(props) {
  const classes = useStyles();
  const {
    handleDialogTypeOpen,
    handleNameClick,
    handlePaymentClick,
    filteredFamilyList,
    searchTerm,
    setSearchTerm,
    drawerOpen,
    closeDrawer,
    openEditFamily,
    editDialogOpen,
    editFamilyData,
    handleEditFamilyChange,
    handleEditFamilySubmit,
    handleEditWeekChange,
    closeEditDialog,
    docStatusMap = {},
    copiedFamilyId,
    handleCopyDocLink,
    sigStatusMap = {},
    sigCopiedId,
    handleSendSignatureLink,
  } = props;

  const headers = ["", "שם משפחה / קבוצה", "קבצים", "מסמכים", "חתימה", "תשלום", "חדרים", "נרשמים", "חסרים", "סטטוס", ""];
  const guests = useSelector((state) => state.userSlice.guests);
  const family = useSelector((state) => state.userSlice.family);
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates);

  const handleDateFieldChange = (e) => {
    handleEditFamilyChange({
      target: { name: e.target.name, value: formatDateInput(e.target.value) },
    });
  };

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
                        {(() => {
                          const ds = docStatusMap[user.family_id];
                          if (!ds) return null;
                          const { uploaded, total } = ds;
                          const dotColor = total === 0 ? "#94a3b8" : uploaded >= total ? "#22c55e" : uploaded > 0 ? "#f59e0b" : "#ef4444";
                          return (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dotColor, display: "inline-block", flexShrink: 0 }} />
                              <span style={{ fontSize: "12px", color: "#475569" }}>{uploaded}/{total}</span>
                              <Tooltip title={copiedFamilyId === user.family_id ? "הועתק!" : "העתק קישור"}>
                                <IconButton size="small" onClick={(e) => handleCopyDocLink(e, user.family_id)} style={{ padding: "2px" }}>
                                  {copiedFamilyId === user.family_id
                                    ? <CheckIcon style={{ fontSize: "14px", color: "#22c55e" }} />
                                    : <LinkIcon style={{ fontSize: "14px", color: "#64748b" }} />}
                                </IconButton>
                              </Tooltip>
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {(() => {
                          const sig = sigStatusMap[user.family_id];
                          const isSent = sig?.signature_sent_at;
                          const isSigned = sig?.sig_id;
                          const copied = sigCopiedId === user.family_id;

                          if (isSigned) {
                            // GREEN — signed
                            return (
                              <span className={`${classes.statusBadge} ${classes.statusOk}`}>
                                נחתם ✓
                              </span>
                            );
                          } else if (isSent) {
                            // ORANGE — sent, awaiting signature
                            return (
                              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <span className={`${classes.statusBadge} ${classes.statusWarning}`}>
                                  ממתין
                                </span>
                                <Tooltip title={copied ? "הועתק!" : "שלח שוב"}>
                                  <IconButton size="small" onClick={(e) => handleSendSignatureLink(e, user)} style={{ padding: "2px" }}>
                                    {copied
                                      ? <CheckIcon style={{ fontSize: "14px", color: "#22c55e" }} />
                                      : <LinkIcon style={{ fontSize: "14px", color: "#64748b" }} />}
                                  </IconButton>
                                </Tooltip>
                              </div>
                            );
                          } else {
                            // GRAY — not sent yet
                            return (
                              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <span style={{ fontSize: "11px", color: "#94a3b8" }}>טרם נשלח</span>
                                <Tooltip title={copied ? "הועתק!" : "שלח קישור חתימה"}>
                                  <IconButton size="small" onClick={(e) => handleSendSignatureLink(e, user)} style={{ padding: "2px" }}>
                                    {copied
                                      ? <CheckIcon style={{ fontSize: "14px", color: "#22c55e" }} />
                                      : <GestureIcon style={{ fontSize: "14px", color: "#64748b" }} />}
                                  </IconButton>
                                </Tooltip>
                              </div>
                            );
                          }
                        })()}
                      </TableCell>
                      <TableCell
                        className={`${classes.dataTableCell} ${classes.paymentCell}`}
                        onClick={(e) => { e.stopPropagation(); handlePaymentClick(user); }}
                      >
                        {user.total_amount == null || user.total_amount === "" ? (
                          <span className={classes.paymentNone}>ממתין להגדרת מחיר</span>
                        ) : (() => {
                          const paid = Number(user.total_paid_amount || 0);
                          const total = Number(user.total_amount);
                          const label = `₪${paid.toLocaleString()} / ₪${total.toLocaleString()}`;
                          const badgeClass = paid === 0
                            ? classes.paymentUnpaid
                            : paid < total
                              ? classes.paymentPartial
                              : classes.paymentPaid;
                          return <span className={`${classes.statusBadge} ${badgeClass}`}>{label}</span>;
                        })()}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {(() => {
                          if (!user.room_ids) return <span className={classes.paymentNone}>לא הוקצו חדרים</span>;
                          const rooms = user.room_ids.split(",");
                          const allRooms = rooms.join(", ");
                          const display = rooms.length > 3
                            ? rooms.slice(0, 3).join(", ") + "..."
                            : allRooms;
                          return (
                            <Tooltip title={allRooms} arrow placement="top" enterDelay={200}>
                              <span className={`${classes.roomsBadge} ${rooms.length >= 3 ? classes.roomsBadgeHighlight : ""}`}>
                                {display}
                              </span>
                            </Tooltip>
                          );
                        })()}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>{user.number_of_guests || "—"}</TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {missing > 0 && <span className={`${classes.statusBadge} ${classes.statusWarning}`}>{missing}</span>}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.number_of_guests == null
                          ? <span className={`${classes.statusBadge} ${classes.statusWarning}`}>חדש</span>
                          : missing > 0
                            ? <span className={`${classes.statusBadge} ${classes.statusWarning}`}>חסרים</span>
                            : <span className={`${classes.statusBadge} ${classes.statusOk}`}>תקין</span>}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        <IconButton size="small" onClick={(e) => openEditFamily(e, user)}>
                          <EditOutlinedIcon style={{ color: "#64748b", fontSize: "18px" }} />
                        </IconButton>
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
              (!family?.number_of_guests || Number(family?.user_in_system_count) < Number(family?.number_of_guests)) && (
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

      {/* ===== EDIT FAMILY DIALOG ===== */}
      <Dialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        PaperProps={{ className: classes.editFamilyDialogPaper }}
        style={{ zIndex: 1600 }}
      >
        <DialogTitle className={classes.editFamilyTitle}>עריכת משפחה / קבוצה</DialogTitle>
        <DialogContent className={classes.editFamilyContent}>
          <div className={classes.editFamilyFieldGroup}>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>שם משפחה / קבוצה</InputLabel>
              <TextField
                name="family_name"
                value={editFamilyData.family_name || ""}
                onChange={handleEditFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>כמות נופשים</InputLabel>
              <TextField
                name="number_of_guests"
                value={editFamilyData.number_of_guests || ""}
                onChange={handleEditFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>כמות חדרים</InputLabel>
              <TextField
                name="number_of_rooms"
                value={editFamilyData.number_of_rooms || ""}
                onChange={handleEditFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>סכום עסקה</InputLabel>
              <TextField
                name="total_amount"
                value={editFamilyData.total_amount || ""}
                onChange={handleEditFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>בחירת מסלול</InputLabel>
              <Select
                name="week_chosen"
                value={editFamilyData.week_chosen || ""}
                onChange={handleEditWeekChange}
                input={<OutlinedInput className={classes.editFamilyField} />}
                displayEmpty
                renderValue={(value) => value || "בחר..."}
                size="small"
                fullWidth
                MenuProps={{
                  style: { zIndex: 1700 },
                  PaperProps: {
                    sx: {
                      bgcolor: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      border: "1px solid #e2e8f0",
                    },
                  },
                }}
              >
                {vacationsDates?.map((type) => (
                  <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                ))}
              </Select>
            </div>
            <div className={classes.editFamilyDateRow}>
              <div className={classes.editFamilyFieldItem}>
                <InputLabel className={classes.editFamilyLabel}>תאריך התחלה</InputLabel>
                <TextField
                  name="start_date"
                  value={isoToDisplay(editFamilyData.start_date) || ""}
                  onChange={handleDateFieldChange}
                  size="small"
                  fullWidth
                  disabled={editFamilyData.week_chosen !== "חריגים"}
                  className={classes.editFamilyField}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div className={classes.editFamilyFieldItem}>
                <InputLabel className={classes.editFamilyLabel}>תאריך סיום</InputLabel>
                <TextField
                  name="end_date"
                  value={isoToDisplay(editFamilyData.end_date) || ""}
                  onChange={handleDateFieldChange}
                  size="small"
                  fullWidth
                  disabled={editFamilyData.week_chosen !== "חריגים"}
                  className={classes.editFamilyField}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className={classes.editFamilyActions}>
          <Button className={classes.editFamilySaveBtn} onClick={handleEditFamilySubmit}>
            שמור
          </Button>
          <Button className={classes.editFamilyCancelBtn} onClick={closeEditDialog}>
            ביטול
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default FamilyListView;
