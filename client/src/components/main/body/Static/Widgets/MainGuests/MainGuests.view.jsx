import {
  Grid, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, FormControl, InputAdornment, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Button, CircularProgress, Box, Typography,
} from "@mui/material";
import { useStyles } from "./MainGuests.style";
import React from "react";
import "./MainGuests.css";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";

function MainGuestsView({
  rows, search, setSearch, headers,
  handleExportToExcel, handleDeleteButtonClick,
  selectedUser, handleClose, open, handleDeleteClick,
  loading, hasMore, sentinelRef,
}) {
  const classes = useStyles();

  const displayName = (user) =>
    user?.hebrew_first_name
      ? `${user.hebrew_first_name} ${user.hebrew_last_name || ""}`.trim()
      : user?.family_name || "";

  const handleMessageString = () =>
    `הנך עומד למחוק את ${displayName(selectedUser)} ואת כל האורחים הקשורים. האם הנך בטוח?`;

  return (
    <Grid style={{ width: "100%" }}>
      {/* ── Sticky toolbar ── */}
      <Box sx={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        padding: "8px 12px", gap: "8px",
      }}>
        <FormControl>
          <TextField
            size="small"
            placeholder="חיפוש..."
            className={classes.textField}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon style={{ color: "#0d9488", fontSize: "18px" }} />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <IconButton size="small" onClick={handleExportToExcel} style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px" }}>
          <DownloadIcon style={{ color: "#0d9488", width: "18px", height: "18px" }} />
        </IconButton>
      </Box>

      {/* ── Table ── */}
      <TableContainer style={{ overflow: "visible" }}>
        <Table stickyHeader style={{ width: "inherit" }} size="small">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} className={classes.headerTableRow} style={{ textAlign: "center" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={classes.dataTableBody}>
            {loading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} sx={{ border: "none", py: 6 }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={28} sx={{ color: "#0d9488" }} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.map((user, index) => (
              <TableRow key={user.family_id || index}>
                <TableCell className={classes.dataTableCell}>{index + 1}</TableCell>
                <TableCell className={classes.dataTableCell}>{user?.family_name}</TableCell>
                <TableCell className={classes.dataTableCell}>{user?.number_of_guests}</TableCell>
                <TableCell className={classes.dataTableCell}>{user?.user_in_system_count}</TableCell>
                <TableCell className={`${classes.dataTableCell} ${classes.redText}`}>
                  {Number(user?.number_of_guests) - Number(user?.user_in_system_count) > 0
                    ? Number(user?.number_of_guests) - Number(user?.user_in_system_count)
                    : ""}
                </TableCell>
                <TableCell className={classes.dataTableCell}>{user?.phone_a || ""}</TableCell>
                <TableCell className={classes.dataTableCell}>{user?.email || ""}</TableCell>
                <TableCell className={classes.dataTableCell}>{user?.identity_id || ""}</TableCell>
                <TableCell className={classes.dataTableCell} style={{ maxWidth: "1px" }}>
                  <IconButton size="small">
                    <DeleteIcon className={classes.delete} onClick={() => handleDeleteButtonClick(user)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Infinite scroll sentinel ── */}
      <Box ref={sentinelRef} sx={{ height: "1px" }} />
      {loading && rows.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={22} sx={{ color: "#0d9488" }} />
        </Box>
      )}
      {!hasMore && rows.length > 0 && (
        <Box sx={{ textAlign: "center", py: 1.5 }}>
          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>סוף הרשימה — {rows.length} רשומות</Typography>
        </Box>
      )}

      {/* ── Delete dialog ── */}
      <Dialog open={open} onClose={handleClose} classes={{ paper: classes.dialog }}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "#1e293b" }}>
            {handleMessageString()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "#1e293b", padding: "2px", border: "1px solid #e2e8f0", marginLeft: "3px", background: "#e2e8f0" }}>
            ביטול
          </Button>
          <Button onClick={handleDeleteClick} autoFocus style={{ color: "#1e293b", padding: "2px", border: "1px solid #e2e8f0", background: "red" }}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default MainGuestsView;
