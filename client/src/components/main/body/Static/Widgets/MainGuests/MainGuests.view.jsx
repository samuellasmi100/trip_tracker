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
  Typography,
  InputLabel
} from "@mui/material";

import { useStyles } from "./MainGuests.style";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./MainGuests.css"
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from '@mui/icons-material/Delete'
import { ReactComponent as DownloadIcon } from "../../../../../../assets/icons/download.svg";

function MainGuestsView({ 
  filteredainGuests,
  searchTerm,
  setSearchTerm,
  headers,
  handleDeleteClick,
  handleExportToExcel
}) {

  const dispatch = useDispatch()
  const classes = useStyles();
  const form = useSelector((state) => state.staticSlice.form)
  const userForm = useSelector((state) => state.userSlice.form)
  
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
            {filteredainGuests?.map((user, index) => {
              return (
                <TableRow key={index}>
                 
                 <>
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
                        {user?.identity_id}
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.phone_a !== null & user.phone_b  !== null ? user.phone_a + user.phone_b : "" }
                      </TableCell>
                      <TableCell className={classes.dataTableCell}>
                        {user.email}
                      </TableCell>
                      
                      <TableCell
                        className={classes.dataTableCell}
                        style={{ maxWidth: "1px" }}
                      >
                        <IconButton size="small">
                          <DeleteIcon className={classes.delete}
                            onClick={() => handleDeleteClick(index)}
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
    </Grid>
  );
}

export default MainGuestsView;
