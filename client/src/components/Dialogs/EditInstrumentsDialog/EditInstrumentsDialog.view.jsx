import React from "react";
import {
  Button,
  Dialog,
  Grid,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { useStyles } from "./EditInstrumentsDialog.style";
import { ReactComponent as UploadFile } from "../../../../../assets/icons/upload-file.svg";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { ReactComponent as Trash } from "../../../../../assets/icons/trash.svg";
import { ReactComponent as Recycle } from "../../../../../assets/icons/recycle.svg";
import UndoIcon from "@mui/icons-material/Undo";

const NewEditInstrumentsDialogView = (props) => {
  const classes = useStyles();
  const {
    dialogOpen,
    closeModal,
    tableHeaders,
    handleAddRow,
    handleInputChange,
    handleInputKeyDown,
    selectedRegionValue,
    handleRegionChange,
    bondsByRegion,
    handleTrashIconClick,
    handleSubmit,
    handleClose,
    handleFileUpload,
    handleButtonClick,
  } = props;

  const regions = useSelector((state) => state.regionSlice.regions);
  return (
    <Dialog
      open={dialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={closeModal}
    >
      <Grid container style={{ padding: "28px 48px" }}>
        {/* header Section */}
        <Grid
          item
          xs={12}
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography className={classes.header}> Edit Instrument</Typography>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={closeModal}>
              <CloseIcon style={{ color: "#ffffff" }} />
            </IconButton>
          </Grid>
        </Grid>
        {/* Region select and upload file */}
        <Grid
          item
          xs={12}
          container
          justifyContent="space-between"
          alignItems={"center"}
          style={{ paddingTop: "22px" }}
        >
          <Grid item xs={12}>
            <InputLabel className={classes.inputLabelStyle}>Region</InputLabel>
          </Grid>
          <Grid item xs={8}>
            <Select
              value={selectedRegionValue}
              onChange={handleRegionChange}
              className={classes.select}
              MenuProps={{
                PaperProps: {
                  sx: {
                    color: "#ffffff !important",
                    bgcolor: "#222222",
                  },
                },
              }}
            >
              {regions?.map((key, index) => {
                return (
                  <MenuItem
                    value={key.name}
                    key={index}
                    style={{ textTransform: "capitalize" }}
                  >
                    {key.name}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid
            item
            container
            xs={4}
            style={{
              color: "white",
              justifyContent: "flex-end",
              cursor: "pointer",
            }}
          >
            <Button
              className={classes.uploadButton}
              startIcon={<UploadFile />}
              onClick={handleButtonClick}
            >
              <input
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                id="fileInput"
                onChange={handleFileUpload}
              />
              Upload File
            </Button>
          </Grid>
        </Grid>
        {/* Bonds Table */}
        <Grid item container style={{ paddingTop: "15px" }}>
          <TableContainer
            style={{ border: "1px solid #3D3F47" }}
            sx={{ height: "335px" }}
          >
            <Table stickyHeader style={{ width: "inherit" }} size="small">
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header, index) => {
                    return (
                      <TableCell key={index} className={classes.headerTableRow}>
                        {header}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody className={classes.dataTableBody}>
                {bondsByRegion?.map((bond, index) => {
                  return (
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor:
                          !bond.is_active && bond.is_active !== undefined
                            ? "green"
                            : "transparent",
                      }}
                    >
                      <TableCell className={classes.dataTableCell}>
                        <TextField
                          value={bond.isin}
                          className={
                            bond.is_active
                              ? classes.textField
                              : classes.textFieldNotActive
                          }
                          // InputProps={{
                          //   classes: {
                          //     input: bond.is_active
                          //       ? classes.textField
                          //       : null,
                          //   },
                          // }}
                          onChange={(e) => handleInputChange(e, bond)}
                          onKeyDown={(e) =>
                            handleInputKeyDown(e, bond, bond.bondId)
                          }
                        />
                      </TableCell>
                      <TableCell
                        className={classes.dataTableCell}
                        style={{
                          color: bond.is_active ? "#ffffff" : "#757882",
                        }}
                      >
                        {bond.bond_name}
                      </TableCell>
                      <TableCell
                        className={classes.dataTableCell}
                        style={{
                          color: bond.is_active ? "#ffffff" : "#757882",
                        }}
                      >
                        {bond.currency}
                      </TableCell>
                      <TableCell
                        className={classes.dataTableCell}
                        style={{ height: 35 }}
                      >
                        <IconButton
                          onClick={() => handleTrashIconClick(bond.bondId)}
                        >
                          {bond.is_active ? <Trash /> : <Recycle />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* add button */}
        <Grid item style={{ paddingTop: "24px" }}>
          <Button
            onClick={handleAddRow}
            className={classes.addButton}
            startIcon={<AddIcon className={classes.addIcon} />}
          >
            Add
          </Button>
        </Grid>
        {/* Bottom Section */}
        <Grid
          item
          container
          justifyContent="space-between"
          style={{ paddingTop: "45px" }}
        >
          <Grid item container justifyContent="space-between">
            <Grid item>
              <Button className={classes.cancelButton} onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button className={classes.submitButton} onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default NewEditInstrumentsDialogView;
