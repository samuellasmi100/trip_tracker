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
      width:"99.9%",  maxHeight: "80vh",
     }}>
      <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
        <Grid style={{ marginTop: "5px" }}>
          <FormControl>
            <TextField
              size="small"
              className={classes.textField}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: "rgb(84, 169, 255)" }} />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <IconButton onClick={handleExportToExcel}>
          <DownloadIcon style={{ color: "#54A9FF", fontSize: "30px",border:'1px solid #494C55',padding:"10px",marginTop:"-7",borderRadius:"4px" }} />
        </IconButton>
        </Grid>
      </Grid>
      <TableContainer
      
      >
        <Table stickyHeader style={{ width: "inherit" }} size="small">
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
          <DialogContentText style={{color: "#FFFFFF" }}>
            {handleMessageString()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{color:"#FFFFFF",padding:"2px",border:'1px solid black',marginLeft:'3px',background:"#494C55"}}>
            ביטול
          </Button>
          <Button onClick={handleDeleteClick} autoFocus style={{color:"#FFFFFF",padding:"2px",border:'1px solid black',background:"red"}}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default GuestsView;
