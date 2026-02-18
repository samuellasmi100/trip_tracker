import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputAdornment,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useStyles } from "./Guests.style";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from '@mui/icons-material/Delete'
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";

function GuestsView({ 
  filteredGuests,
  searchTerm,
  setSearchTerm,
  headers,
  handleDeleteButtonClick,
  handleExportToExcel,
  selectedUser,
  handleClose,
  open,
  handleDeleteClick
}) {

 const classes = useStyles();
 const handleMessageString = () => {
  if(selectedUser !== null){
  if(selectedUser.is_main_user === 1){
    return `הנך עומד למחוק את ${selectedUser?.hebrew_first_name} ${selectedUser?.hebrew_last_name}, אורח זה הוא אורח ראשי מחיקתו תוביל למחיקת כל האורחים שתחת שם זה האם הנך בטוח?    `
  }else {
   return `האם אתה בטוח שברצונך למחוק את ${selectedUser?.hebrew_first_name} ${selectedUser?.hebrew_last_name}?`
  }
 }
}


  return (
    <Grid style={{
      width: "100%",
     }}>
      <Grid style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "8px 12px", gap: "8px" }}>
          <FormControl>
            <TextField
              size="small"
              placeholder="חיפוש..."
              className={classes.textField}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
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
      </Grid>
      <TableContainer style={{ overflow: "visible" }}>
        <Table style={{ width: "inherit" }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => {
                return (
                  <TableCell
                    key={index}
                    className={classes.headerTableRow}
                    style={{ textAlign: "center" }}
                  >
                    {header}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody className={classes.dataTableBody}>
            {filteredGuests?.map((user, index) => {
              return (
                <TableRow key={index}>
                 
                 <>
                 <TableCell className={classes.dataTableCell}>
                        {index+1}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user?.hebrew_first_name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user?.hebrew_last_name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user?.english_first_name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user?.english_last_name}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user?.age}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user?.identity_id}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.phone_a !== null & user.phone_b  !== null ? user.phone_a + user.phone_b : "" }
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.email}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.is_main_user === 1 ? "כן" : "לא"}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.room_id}
                      </TableCell>
                      <TableCell
                        className={classes.dataTableCell}
                        style={{ maxWidth: "1px" }}
                      >
                        <IconButton size="small">
                          <DeleteIcon className={classes.delete}
                            onClick={() => handleDeleteButtonClick(user)}
                          />
                        </IconButton>
                      </TableCell>
                      
                    </>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialog }}
      >
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <DialogContentText style={{color: "#1e293b" }}>
            {handleMessageString()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{color:"#1e293b",padding:"2px",border:'1px solid #e2e8f0',marginLeft:'3px',background:"#e2e8f0"}}>
            ביטול
          </Button>
          <Button onClick={handleDeleteClick} autoFocus style={{color:"#1e293b",padding:"2px",border:'1px solid #e2e8f0',background:"red"}}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default GuestsView;
