import React from "react";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import { useStyles } from "./NewEditClientUserDialog.style";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

const NewEditClientUserDialogView = (props) => {
  const classes = useStyles();
  const {
    closeModal,
    dialogOpen,
    currentClientUserData,
    changeCurrentClientUserData,
    handleSelectCheckboxChecked,
    handlePreRenderSelectCheckboxChecked,
    handlePreRenderCheckboxChecked,
    apiEditClientUser,
    handleCheckboxChecked,
    apiSaveNewClientUser,
    selectedClientValue,
    selectedMakorSalesValue,
    handleTraderChange,
    handleClientsChange,
    dialogType,
    currentRegionClientUserData,
  } = props;

  const regions = useSelector((state) => state.regionSlice.regions);
  const clients = useSelector((state) => state.userSlice.clients);
  const traders = useSelector((state) => state.userSlice.traders);
      return (
    <Dialog
      open={dialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={closeModal}
    >
      <Grid container spacing={2}>
        <Grid
          item
          container
          xs={12}
          style={{ marginTop: "30px", marginLeft: "30px" }}
          alignContent="center"
          justifyContent="space-between"
        >
          <Grid item xs={6}>
            <Typography className={classes.header}>
              {dialogType === "edit" ? "Edit Client User" : "New Client"}
            </Typography>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end">
            <IconButton
              size="small"
              style={{
                marginRight: "20px",
                display: "relative",
                bottom: "5px",
              }}
              onClick={closeModal}
            >
              <CloseIcon style={{ color: "#ffffff" }} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                First Name
              </InputLabel>
              <TextField
                value={currentClientUserData.firstName}
                className={classes.textField}
                onChange={(e) => changeCurrentClientUserData(e, "firstName")}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                Client
              </InputLabel>
              <Select
                value={
                  currentClientUserData.clientName !== undefined
                    ? currentClientUserData.clientName
                    : selectedClientValue
                }
                onChange={handleClientsChange}
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
                {clients?.map((key, index) => {
                  return (
                    <MenuItem value={key.client_name} key={index}>
                      {key.client_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>Email</InputLabel>
              <TextField
                value={currentClientUserData.email}
                className={classes.textField}
                onChange={(e) => changeCurrentClientUserData(e, "email")}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                Makor Sales
              </InputLabel>
              <Select
                value={
                  currentClientUserData.traderName !== undefined
                    ? currentClientUserData.traderName
                    : selectedMakorSalesValue
                }
                onChange={handleTraderChange}
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
                {traders?.map((key, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={key.fullName}
                      style={{ textTransform: "capitalize" }}
                    >
                      {key.fullName}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                Last Name
              </InputLabel>
              <TextField
                value={currentClientUserData.lastName}
                className={classes.textField}
                onChange={(e) => changeCurrentClientUserData(e, "lastName")}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                Phone Number
              </InputLabel>
              <Grid container>
                <Grid>
                
                  <PhoneInput
                    country={""}
                    onChange={(e) => changeCurrentClientUserData(e, "areaCode")}
                    buttonClass={classes.button}
                    inputClass={classes.input}
                    dropdownClass={classes.dropdown}
                    value={currentClientUserData?.phone?.code}
                    inputStyle={{
                      background: "#2D2D2D",
                      width: "20px",
                      height: "32px",
                    }}
                    dropdownStyle={{ width: "150px" }}
                  />
                </Grid>
                <Grid style={{ paddingLeft: "10px" }}>
                  <TextField
                    value={currentClientUserData?.phone?.number}
                    className={classes.textFieldPhone}
                    onChange={(e) => changeCurrentClientUserData(e, "phone")}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                Daily Limit
              </InputLabel>
              <TextField
                value={currentClientUserData?.dailyLimit}
                className={classes.textField}
                onChange={(e) => changeCurrentClientUserData(e, "dailyLimit")}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                Region Select
              </InputLabel>
              <Select
                multiple
                value={
                  currentRegionClientUserData ? currentRegionClientUserData : []
                }
                className={classes.select}
                renderValue={() => {
                  return currentRegionClientUserData
                    .map((region) => region.name)
                    .join(", ");
                }}
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
                    <MenuItem key={index}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: "#686B76",
                              "&.Mui-checked": {
                                color: "#54A9FF",
                              },
                            }}
                            onClick={(e) => handleSelectCheckboxChecked(e, key)}
                            checked={handlePreRenderSelectCheckboxChecked(
                              key.name
                            )}
                          />
                        }
                        label={key.name}
                      />
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid style={{ marginTop: "20px", marginLeft: "30px" }}>
        <Grid>
          <Typography style={{ color: "##757882", fontSize: "15px" }}>
            Privileges
          </Typography>
        </Grid>
        <Grid container display="flex" flexDirection="row">
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#686B76",
                    "&.Mui-checked": {
                      color: "#54A9FF",
                    },
                  }}
                  className={classes.checkbox}
                  onClick={(e) => handleCheckboxChecked(e, "trading")}
                  checked={handlePreRenderCheckboxChecked("trading")}
                />
              }
              label={
                <Typography style={{ color: "##757882", fontSize: "15px" }}>
                  Trading
                </Typography>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#686B76",
                    "&.Mui-checked": {
                      color: "#54A9FF",
                    },
                  }}
                  onClick={(e) => handleCheckboxChecked(e, "reporting")}
                  checked={handlePreRenderCheckboxChecked("reporting")}
                />
              }
              label={
                <Typography style={{ color: "##757882", fontSize: "15px" }}>
                  Reporting
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        container
        style={{ marginTop: "30px" }}
        justifyContent="space-around"
      >
        <Grid item>
          <Button className={classes.cancelButton} onClick={() => closeModal()}>
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.submitButton}
            onClick={
              dialogType === "edit" ? apiEditClientUser : apiSaveNewClientUser
            }
          >
            {dialogType === "edit" ? "Submit" : "Create"}
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default NewEditClientUserDialogView;
