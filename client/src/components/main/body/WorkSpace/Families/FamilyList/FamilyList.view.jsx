import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
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
import SearchIcon from "@material-ui/icons/Search";

function FamilyListView(props) {
  const classes = useStyles();
  const {
    handleDialogTypeOpen,
    handleNameClick,
    handleUpload,
    handleFileChange,
    filteredFamilyList,
    searchTerm,
    setSearchTerm,
    handleSelectInputChange
  } = props;
  const headers = ["", "שם משפחה / קבוצה", "הוסף / הצג קובצי רישום", "היתרה לתשלום", "כמות נרשמים", "חסרים במערכת", "מסלול"];
  const vacationList = useSelector((state) => state.vacationSlice.vacations)
  const vacationName = useSelector((state) => state.vacationSlice.vacationName)
  return (
    <Grid
      container
      style={{
        background: "#ffffff",
        width: "45vw",
        border: "1px solid #e2e8f0",
        marginLeft: "10px",
        borderRadius: "14px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >

      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "0",
          padding: "12px 16px",
          borderBottom: "1px solid #f1f5f9",
          backgroundColor: "#fafbfc",
        }}
      >
        <Grid style={{ marginRight: "0px", marginTop: "0px" }}>
          <Select
            value={vacationName}
            onChange={handleSelectInputChange}
            input={
              <OutlinedInput
                className={classes.selectOutline}
              />
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  color: "#1e293b !important",
                  bgcolor: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
                  border: "1px solid #e2e8f0",
                },
              },
            }}>
            {vacationList?.map((vacation) => (
              <MenuItem key={vacation.name} value={vacation.name} className={classes.selectedMenuItem}>
                {vacation.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item></Grid>
        <Grid item style={{ marginRight: "0px", marginTop: "0px" }}>
          <Typography style={{ color: "#1e293b", fontWeight: 600, fontSize: "16px" }}> נרשמים </Typography>
        </Grid>
        <Grid>
          <Grid style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Grid style={{ marginRight: "0px", marginTop: "0px" }}>
              <FormControl>
                <TextField
                  size="small"
                  className={classes.searchField}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                      // style={{ display: showClearIcon }}
                      // onClick={handleClick}
                      >
                        <SearchIcon style={{ color: "#0d9488" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid>
              <IconButton onClick={() => handleDialogTypeOpen("addFamily")}>
                <AddBoxIcon style={{ color: "#0d9488", fontSize: "30px" }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{ border: "none" }}>
        <TableContainer
          style={{
            border: "none",
            height: "calc(100vh - 230px)",
          }}
        >
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
              {filteredFamilyList?.map((user, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={classes.dataTableCell}>
                      {index + 1}
                    </TableCell>
                    <Button onClick={() => handleNameClick(user)}>
                      <TableCell className={classes.dataTableCell}>
                        {user.family_name}
                      </TableCell>
                    </Button>

                    <TableCell
                      className={classes.dataTableCell}
                      style={{ maxWidth: "1px" }}
                    >
                      <IconButton size={"small"}>
                        {/* <Input
                    onChange={handleFileChange}  type="file" sx={{
                      width:"105px",
                      paddingRight:'2px'
                     }}/> */}
                        <DriveFolderUploadIcon
                          style={{ color: "#0d9488", fontSize: "24px" }}
                          onClick={() =>
                            // handleUpload(user.family_name, user.family_id)
                            handleDialogTypeOpen("uploadFile",user)
                          }
                        />
                      </IconButton>
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>
                      {user.total_amount === "" || user.total_amount === null ? ""  : user.total_amount - user.total_paid_amount}
                    </TableCell>

                    <TableCell className={classes.dataTableCell}>{user.number_of_guests}</TableCell>
                    <TableCell className={`${classes.dataTableCell} ${classes.redText}`}>
                      {Number(user?.number_of_guests) - Number(user?.user_in_system_count) > 0 ? Number(user?.number_of_guests) - Number(user?.user_in_system_count) : ""}
                    </TableCell>
                    <TableCell className={classes.dataTableCell}>{vacationName}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default FamilyListView;
