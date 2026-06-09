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
  CircularProgress,
  Popover,
} from "@mui/material";
import React from "react";
import { useStyles } from "./FamilyList.style";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useSelector } from "react-redux";
import LinkIcon from "@mui/icons-material/Link";
import CheckIcon from "@mui/icons-material/Check";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import SearchIcon from "@material-ui/icons/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SendIcon from "@mui/icons-material/Send";
import { formatDateInput, isoToDisplay, toLocalYMD } from "../../../utils/helpers/formatDate";
import { getGuestCompleteness } from "../../../utils/helpers/guestCompleteness";
import { formatMoneyInput, stripMoney } from "../../../utils/helpers/formatMoney";

// Mirrors the canonical list in shared/Payments/Payments.view.jsx — kept local
// here to avoid a cross-feature import for a four-item constant.
const PAYMENT_METHODS = ["מזומן", "העברה בנקאית", "כרטיס אשראי", "המחאות"];

// Dropdown label only: append the route's date range so the secretary can pick a
// week by its actual dates. The option VALUE stays the route name (the assignment
// key) — only the displayed text changes. Routes store ISO; isoToDisplay renders
// DD/MM/YYYY. חריגים (and any dateless row) shows the name with no range.
const routeOptionLabel = (route) => {
  const start = isoToDisplay(route.start_date);
  const end = isoToDisplay(route.end_date);
  return start && end ? `${route.name} (${start}–${end})` : route.name;
};

function FamilyListView(props) {
  const classes = useStyles();
  const {
    handleDialogTypeOpen,
    handleNameClick,
    handlePaymentClick,
    families = [],
    searchTerm,
    handleSearchChange,
    loading = false,
    loadingMore = false,
    guestsLoading = false,
    tableWrapRef,
    drawerOpen,
    closeDrawer,
    openEditFamily,
    editDialogOpen,
    editFamilyData,
    handleEditFamilyChange,
    handleEditFamilySubmit,
    handleEditWeekChange,
    closeEditDialog,
    openAddFamily,
    addDialogOpen,
    addFamilyData = {},
    handleAddFamilyChange,
    handleAddFamilySubmit,
    handleAddWeekChange,
    closeAddDialog,
    docStatusMap = {},
    copiedFamilyId,
    handleCopyDocLink,
    handleSendRegistrationLink,
    handleSendDocLink,
  } = props;

  const headers = ["", "שם משפחה / קבוצה", "מסמכים", "טופס רישום", "תשלום", "חדרים", "נרשמים", "חסרים", "סטטוס", "תאריך רישום", ""];
  // UI-only state for the documents "what's missing" popup (anchor + the family
  // whose breakdown is shown). Presentational, so it stays in the view.
  const [missingAnchor, setMissingAnchor] = React.useState(null);
  const [missingData, setMissingData] = React.useState(null);
  const openMissing = (e, ds) => {
    e.stopPropagation();
    setMissingData(ds);
    setMissingAnchor(e.currentTarget);
  };
  const closeMissing = () => { setMissingAnchor(null); setMissingData(null); };

  const guests = useSelector((state) => state.userSlice.guests);
  const family = useSelector((state) => state.userSlice.family);
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates);

  const handleDateFieldChange = (e) => {
    handleEditFamilyChange({
      target: { name: e.target.name, value: formatDateInput(e.target.value) },
    });
  };

  const handleAddDateFieldChange = (e) => {
    handleAddFamilyChange({
      target: { name: e.target.name, value: formatDateInput(e.target.value) },
    });
  };

  // Money fields: show grouped digits, store a clean number.
  const handleEditMoneyChange = (e) => {
    handleEditFamilyChange({ target: { name: e.target.name, value: stripMoney(e.target.value) } });
  };

  const handleAddMoneyChange = (e) => {
    handleAddFamilyChange({ target: { name: e.target.name, value: stripMoney(e.target.value) } });
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
                onChange={(e) => handleSearchChange(e.target.value)}
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
            <IconButton size="small" onClick={openAddFamily}>
              <AddBoxIcon style={{ color: "#0d9488", fontSize: "24px" }} />
            </IconButton>
          </div>
        </div>

        {/* Scrollable table */}
        <div className={classes.tableWrap} ref={tableWrapRef}>
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
                {loading && (
                  <TableRow>
                    <TableCell colSpan={11} style={{ textAlign: "center", padding: "32px 0", border: "none" }}>
                      <CircularProgress size={28} style={{ color: "#0d9488" }} />
                    </TableCell>
                  </TableRow>
                )}
                {!loading && families?.map((user, index) => {
                  const missing = Number(user?.number_of_guests) - Number(user?.user_in_system_count);
                  return (
                    <TableRow key={index} onClick={() => handleNameClick(user)}>
                      <TableCell className={classes.dataTableCell}>{index + 1}</TableCell>
                      <TableCell className={classes.familyNameCell}>{user.family_name}</TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {(() => {
                          const ds = docStatusMap[user.family_id];
                          const uploaded = Number(ds?.uploaded) || 0;
                          const total = Number(ds?.total) || 0;
                          const dotColor = total === 0 ? "#94a3b8" : uploaded >= total ? "#22c55e" : uploaded > 0 ? "#f59e0b" : "#ef4444";
                          const hasMissing = total > 0 && uploaded < total;
                          return (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dotColor, display: "inline-block", flexShrink: 0 }} />
                              <span style={{ fontSize: "12px", color: "#475569" }}>{uploaded}/{total}</span>
                              {hasMissing && (
                                <Tooltip title="מה חסר">
                                  <IconButton size="small" onClick={(e) => openMissing(e, ds)} style={{ padding: "2px" }}>
                                    <ErrorOutlineIcon style={{ fontSize: "14px", color: "#f59e0b" }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title={copiedFamilyId === user.family_id ? "הועתק!" : "העתק קישור"}>
                                <IconButton size="small" onClick={(e) => handleCopyDocLink(e, user.family_id)} style={{ padding: "2px" }}>
                                  {copiedFamilyId === user.family_id
                                    ? <CheckIcon style={{ fontSize: "14px", color: "#22c55e" }} />
                                    : <LinkIcon style={{ fontSize: "14px", color: "#64748b" }} />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="שליחת קישור להעלאת מסמכים">
                                <IconButton size="small" onClick={(e) => handleSendDocLink(e, user)} style={{ padding: "2px" }}>
                                  <SendIcon style={{ fontSize: "15px", color: "#64748b" }} />
                                </IconButton>
                              </Tooltip>
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {(() => {
                          const status = user.registration_status; // 'signed' | 'pending' | null
                          // signed → terminal green badge, no send button.
                          if (status === "signed") {
                            const signedAt = user.registration_signed_at;
                            const tip = signedAt
                              ? `נחתם ב-${new Date(signedAt).toLocaleString("he-IL")}`
                              : "נחתם";
                            return (
                              <Tooltip title={tip}>
                                <span className={`${classes.statusBadge} ${classes.statusOk}`}>
                                  נחתם ✓
                                </span>
                              </Tooltip>
                            );
                          }
                          // pending (non-expired) → amber badge + resend icon
                          // (opens the channel-picker dialog with the still-valid token).
                          if (status === "pending") {
                            return (
                              <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                                <span className={`${classes.statusBadge} ${classes.statusWarning}`}>
                                  ממתין
                                </span>
                                <Tooltip title="שלח שוב — בחר ערוץ">
                                  <IconButton size="small" onClick={(e) => handleSendRegistrationLink(e, user)} style={{ padding: "2px" }}>
                                    <LinkIcon style={{ fontSize: "14px", color: "#64748b" }} />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            );
                          }
                          // No row yet → original send icon (opens the dialog).
                          return (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                              <Tooltip title="שליחת קישור לטופס רישום">
                                <IconButton size="small" onClick={(e) => handleSendRegistrationLink(e, user)} style={{ padding: "2px" }}>
                                  <HowToRegOutlinedIcon style={{ fontSize: "16px", color: "#64748b" }} />
                                </IconButton>
                              </Tooltip>
                            </div>
                          );
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
                        {/* created_at is a timestamp → comes over as a UTC ISO string;
                            toLocalYMD reads local components (avoids the Israel day-shift),
                            isoToDisplay renders DD/MM/YYYY like the other date columns. */}
                        {isoToDisplay(toLocalYMD(user.created_at)) || "—"}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        <IconButton size="small" onClick={(e) => openEditFamily(e, user)}>
                          <EditOutlinedIcon style={{ color: "#64748b", fontSize: "18px" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {loadingMore && (
                  <TableRow>
                    <TableCell colSpan={11} style={{ textAlign: "center", padding: "16px 0", border: "none" }}>
                      <CircularProgress size={22} style={{ color: "#0d9488" }} />
                    </TableCell>
                  </TableRow>
                )}
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
          {guestsLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 0" }}>
              <CircularProgress size={28} style={{ color: "#0d9488" }} />
            </div>
          ) : family.family_id !== undefined && guests?.length > 0 ? (
            <div className={classes.drawerTableCard}>
            <div className={classes.drawerTableScroll}>
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
                        <Tooltip title="ערוך">
                          <IconButton size="small" onClick={() => handleDialogTypeOpen(user.is_main_user ? "editParent" : "editChild", user)}>
                            <EditOutlinedIcon style={{ color: "#64748b", fontSize: "18px" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        <Tooltip title="פרטים">
                          <IconButton size="small" onClick={() => handleDialogTypeOpen(user.is_main_user ? "parentDetails" : "childDetails", user)}>
                            <DescriptionOutlinedIcon style={{ color: "#64748b", fontSize: "18px" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {(() => {
                          const { status, missing } = getGuestCompleteness(user);
                          const color = status === "complete" ? "#22c55e" : status === "partial" ? "#f59e0b" : "#ef4444";
                          const tooltip = status === "complete" ? (
                            "כל הפרטים הנדרשים מולאו"
                          ) : (
                            <div style={{ direction: "rtl", textAlign: "right" }}>
                              <div style={{ fontWeight: 700, marginBottom: 4 }}>חסר למילוי:</div>
                              {missing.map((m) => (
                                <div key={m}>• {m}</div>
                              ))}
                            </div>
                          );
                          return (
                            <Tooltip title={tooltip} arrow placement="top">
                              <IconButton size="small" onClick={() => handleDialogTypeOpen(user.is_main_user ? "parentDetails" : "childDetails", user)}>
                                <CheckCircleIcon style={{ color, fontSize: "22px" }} />
                              </IconButton>
                            </Tooltip>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </div>
            </div>
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

      {/* ===== "WHAT'S MISSING" DOCUMENTS POPOVER ===== */}
      <Popover
        open={Boolean(missingAnchor)}
        anchorEl={missingAnchor}
        onClose={closeMissing}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <div style={{ direction: "rtl", padding: "12px 16px", maxWidth: 280 }}>
          <Typography style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#0f172a" }}>
            מסמכים חסרים
          </Typography>
          {(missingData?.missingFamily || []).length > 0 && (
            <div style={{ marginBottom: 8 }}>
              {missingData.missingFamily.map((label) => (
                <div key={`fam-${label}`} style={{ fontSize: 13, color: "#b45309" }}>• {label}</div>
              ))}
            </div>
          )}
          {(missingData?.missingByGuest || []).map((g) => (
            <div key={g.user_id} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{g.name}</div>
              {(g.missing || []).map((label) => (
                <div key={`${g.user_id}-${label}`} style={{ fontSize: 12, color: "#64748b", marginRight: 8 }}>
                  • {label}
                </div>
              ))}
            </div>
          ))}
          {(missingData?.missingFamily || []).length === 0 &&
            (missingData?.missingByGuest || []).length === 0 && (
              <Typography style={{ fontSize: 13, color: "#15803d" }}>הכל הושלם</Typography>
            )}
        </div>
      </Popover>

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
                value={formatMoneyInput(editFamilyData.total_amount)}
                onChange={handleEditMoneyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
                inputProps={{ inputMode: "decimal" }}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>צורת תשלום</InputLabel>
              <Select
                name="payment_method"
                value={editFamilyData.payment_method || ""}
                onChange={handleEditFamilyChange}
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
                {PAYMENT_METHODS.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>מספר תשלומים</InputLabel>
              <TextField
                name="num_payments"
                value={editFamilyData.num_payments || ""}
                onChange={handleEditFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
                inputProps={{ inputMode: "numeric", min: 1 }}
                type="number"
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
                  <MenuItem key={type.name} value={type.name} sx={{ fontSize: "13px" }}>{routeOptionLabel(type)}</MenuItem>
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

      {/* ===== ADD FAMILY DIALOG (same layout as edit) ===== */}
      <Dialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        PaperProps={{ className: classes.editFamilyDialogPaper }}
        style={{ zIndex: 1600 }}
      >
        <DialogTitle className={classes.editFamilyTitle}>הוספת משפחה / קבוצה</DialogTitle>
        <DialogContent className={classes.editFamilyContent}>
          <div className={classes.editFamilyFieldGroup}>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>שם משפחה / קבוצה</InputLabel>
              <TextField
                name="family_name"
                value={addFamilyData.family_name || ""}
                onChange={handleAddFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>כמות נופשים</InputLabel>
              <TextField
                name="number_of_guests"
                value={addFamilyData.number_of_guests || ""}
                onChange={handleAddFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>כמות חדרים</InputLabel>
              <TextField
                name="number_of_rooms"
                value={addFamilyData.number_of_rooms || ""}
                onChange={handleAddFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>סכום עסקה</InputLabel>
              <TextField
                name="total_amount"
                value={formatMoneyInput(addFamilyData.total_amount)}
                onChange={handleAddMoneyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
                inputProps={{ inputMode: "decimal" }}
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>צורת תשלום</InputLabel>
              <Select
                name="payment_method"
                value={addFamilyData.payment_method || ""}
                onChange={handleAddFamilyChange}
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
                {PAYMENT_METHODS.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>מספר תשלומים</InputLabel>
              <TextField
                name="num_payments"
                value={addFamilyData.num_payments || ""}
                onChange={handleAddFamilyChange}
                size="small"
                fullWidth
                className={classes.editFamilyField}
                inputProps={{ inputMode: "numeric", min: 1 }}
                type="number"
              />
            </div>
            <div className={classes.editFamilyFieldItem}>
              <InputLabel className={classes.editFamilyLabel}>בחירת מסלול</InputLabel>
              <Select
                name="week_chosen"
                value={addFamilyData.week_chosen || ""}
                onChange={handleAddWeekChange}
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
                  <MenuItem key={type.name} value={type.name} sx={{ fontSize: "13px" }}>{routeOptionLabel(type)}</MenuItem>
                ))}
              </Select>
            </div>
            <div className={classes.editFamilyDateRow}>
              <div className={classes.editFamilyFieldItem}>
                <InputLabel className={classes.editFamilyLabel}>תאריך התחלה</InputLabel>
                <TextField
                  name="start_date"
                  value={isoToDisplay(addFamilyData.start_date) || ""}
                  onChange={handleAddDateFieldChange}
                  size="small"
                  fullWidth
                  disabled={addFamilyData.week_chosen !== "חריגים"}
                  className={classes.editFamilyField}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div className={classes.editFamilyFieldItem}>
                <InputLabel className={classes.editFamilyLabel}>תאריך סיום</InputLabel>
                <TextField
                  name="end_date"
                  value={isoToDisplay(addFamilyData.end_date) || ""}
                  onChange={handleAddDateFieldChange}
                  size="small"
                  fullWidth
                  disabled={addFamilyData.week_chosen !== "חריגים"}
                  className={classes.editFamilyField}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className={classes.editFamilyActions}>
          <Button className={classes.editFamilySaveBtn} onClick={handleAddFamilySubmit}>
            הוסף
          </Button>
          <Button className={classes.editFamilyCancelBtn} onClick={closeAddDialog}>
            ביטול
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default FamilyListView;
