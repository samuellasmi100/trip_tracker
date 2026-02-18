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
  InputAdornment,
  FormControl,
  TextField
} from "@mui/material";
import React from "react";
import { useStyles } from "./FamilyMember.style";
import { ReactComponent as EditIcon } from "../../../../../../assets/icons/edit.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import { useSelector } from "react-redux";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@material-ui/icons/Search";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function FamilyMemberView({ handleDialogTypeOpen, handleSearchChange }) {
  const guests = useSelector((state) => state.userSlice.guests);
  const isParentIdExist = guests.some((key) => {
    return key.is_main_user;
  });
  const classes = useStyles();
  const family = useSelector((state) => state.userSlice.family);
  const headers = ["","שם", "משויך לחדר", "ערוך", "פרטים", "סטטוס"];

  return (
    <Grid
      item
      xs={12}
      style={{
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        width: "45vw",
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
        <Grid style={{ display: "flex", justifyContent: "space-between" }} item>
          <Grid style={{ marginRight: "0px", marginTop: '0px', marginBottom: "0px" }}>
            <FormControl>
              <TextField
                size="small"
                className={classes.searchField}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                    // style={{ display: showClearIcon }}
                    // onClick={handleClick}
                    >
                      <SearchIcon style={{ color: '#0d9488' }} />
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        {family.family_id !== undefined ? (
          <>
            <Grid item style={{ marginRight: "0px", marginTop: "0px" }}>
              <Typography style={{ color: "#1e293b", fontWeight: 600, fontSize: "16px" }}> כלל האורחים משפחה /קבוצה {family.family_name} </Typography>
            </Grid>
            <Grid>
              {Number(family?.user_in_system_count) < Number(family?.number_of_guests) ?
              <IconButton
              onClick={() =>
                handleDialogTypeOpen(isParentIdExist ? "addChild" : "addParent")
              } >
              <AddBoxIcon style={{ color: "#0d9488", fontSize: "30px" }} />
            </IconButton>
              :""}
            </Grid>
          </>
        ) : (
          ""
        )}
      </Grid>
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
            {guests?.map((user, index) => {
              return (
                <TableRow
                  key={index}
                  style={
                    user.is_main_user
                      ? { background: "rgba(13, 148, 136, 0.08)" }
                      : {}
                  }
                >
                   <TableCell className={classes.dataTableCell}>
                        {index+1}
                    </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {user.hebrew_first_name + " " + user.hebrew_last_name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {user.room_id}
                  </TableCell>
                  <TableCell
                    className={classes.dataTableCell}
                    style={{ maxWidth: "1px" }}
                  >
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleDialogTypeOpen(
                          user.is_main_user
                            ? "editParent"
                            : "editChild",
                          user
                        )
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    className={classes.dataTableCell}
                    style={{ maxWidth: "1px" }}
                  >
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleDialogTypeOpen(
                          user.is_main_user
                            ? "parentDetails"
                            : "childDetails",
                          user
                        )
                      }
                    >
                      <DescriptionIcon style={{ color: "#f59e0b" }} />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    className={classes.dataTableCell}
                    style={{ maxWidth: "1px" }}
                  >
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleDialogTypeOpen(
                          user.is_main_user
                            ? "parentDetails"
                            : "childDetails",
                          user
                        )
                      }>

                      <CheckCircleIcon
                        style={{
                          color: user.is_main_user
                            ? "#22c55e"
                            : user.address !== null
                              ? "#f59e0b"
                              : "#ef4444",
                          height: "25px",
                          width: "25px",
                        }}
                      />

                    </IconButton>
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default FamilyMemberView;
