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
} from "@mui/material";
import React from "react";
import { useStyles } from "./FamilyMember.style";
import { ReactComponent as EditIcon } from "../../../../../assets/icons/edit.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import { useSelector } from "react-redux";
import SearchInput from "../../../../ReusableComps/SearchInput/SearchInput";
import { ReactComponent as DownloadIcon } from "../../../../../assets/icons/download.svg";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import AddBoxIcon from "@mui/icons-material/AddBox";

function FamilyMemberView({ handleDialogTypeOpen }) {
  const guests = useSelector((state) => state.userSlice.guests);
  const isParentIdExist = guests.some((key) => {
    return key.parent_id;
  });
  const classes = useStyles();
  const family = useSelector((state) => state.userSlice.family);
  const headers = ["שם פרטי", "שם משפחה", "תעודת זהות", "ערוך", "פרטים"];

  return (
    <Grid
      item
      xs={12}
      style={{
        border: "1px solid rgb(61, 63, 71)",
        background: "rgb(45, 45, 45)",
        width: "40vw",
      }}
    >
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "4px",
        }}
      >
        <Grid style={{ display: "flex", justifyContent: "space-between" }} item>
          <Grid item style={{ marginRight: "8px", marginTop: "5px" }}>
            <SearchInput />
          </Grid>
         
          <Grid item style={{ marginRight: "8px", marginTop: "5px" }}>
            <IconButton className={classes.downloadButton}>
              <DownloadIcon style={{ color: "#54A9FF" }} />
            </IconButton>
          </Grid>
        </Grid>
        {family.family_id !== undefined ? (
          <>
        <Grid item style={{ marginRight: "-100px", marginTop: "10px" }}>
            <Typography style={{color:"white"}}> כלל האורחים משפחה /קבוצה {family.family_name} </Typography>
          </Grid>
        
          <Grid>
            <IconButton
              onClick={() =>
                handleDialogTypeOpen(isParentIdExist ? "addChild" : "addParent")
              }
            >
              <AddBoxIcon style={{ color: "#54A9FF", fontSize: "30px" }} />
            </IconButton>
          </Grid>
          </>
        ) : (
          ""
        )}
      </Grid>
      <TableContainer
        style={{
          border: "1px solid #3D3F47",
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
                    user.parent_id !== undefined && user.parent_id !== null
                      ? { background: "#54a9ff40 " }
                      : {}
                  }
                >
                  <TableCell className={classes.dataTableCell}>
                    {user.first_name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {user.last_name}
                  </TableCell>
                  <TableCell className={classes.dataTableCell}>
                    {user.identity_id}
                  </TableCell>
                  <TableCell
                    className={classes.dataTableCell}
                    style={{ maxWidth: "1px" }}
                  >
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleDialogTypeOpen(
                          user.parent_id !== undefined &&
                            user.parent_id !== null
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
                          user.parent_id !== undefined &&
                            user.parent_id !== null
                            ? "parentDetails"
                            : "childDetails",
                          user
                        )
                      }
                    >
                      <DescriptionIcon style={{ color: "rgb(255, 158, 84)" }} />
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
