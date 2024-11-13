import React from "react";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useStyles } from "./NewEditClientDialog.style";
const NewEditClientDialogView = (props) => {
  const classes = useStyles();
  const {
    dialogOpen,
    saveNewClient,
    currentClientData,
    changeCurrentClientData,
    closeModal,
    editClient,
  } = props;
  return (
    <Dialog
      open={dialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={closeModal}
    >
      <Grid
        container
        justifyContent="space-between"
        direction="column"
        sx={{ height: "100%", maxWidth: "100%", padding: "10px" }}
      >
        <Grid item container>
          <Grid item xs={12}>
            <Typography
              style={{ textTransform: "capitalize", fontSize: "1.125rem" }}
            >{`${currentClientData.id ? "Edit" : "New"} Client`}</Typography>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center">
          {Object.entries(currentClientData)?.map(([key, value], index) => {
            if (key === "lei" || key === "client_name" || key === "is_active") {
              return (
                <Grid item xs={12} key={index} sx={{ paddingTop: "20px" }}>
                  {key === "is_active" ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            value === 0 || value === false ? false : true
                          }
                          onChange={(e) => changeCurrentClientData(e, key)}
                          sx={{
                            "&.Mui-checked": {
                              color: "#2e7d32",
                            },
                          }}
                        />
                      }
                      label="Active"
                    />
                  ) : (
                    <Grid item key={index}>
                      <InputLabel className={classes.inputLabelStyle}>
                        {key === "lei"
                          ? key.toUpperCase()
                          : key.charAt(0).toUpperCase() +
                            key.slice(1).replace("_", " ")}
                      </InputLabel>
                      <TextField
                        value={value}
                        className={classes.textField}
                        onChange={(e) => changeCurrentClientData(e, key)}
                      />
                    </Grid>
                  )}
                </Grid>
              );
            }
            return null;
          })}
        </Grid>
        <Grid item container justifyContent="space-around">
          <Grid item>
            <Button className={classes.cancelButton} onClick={() => closeModal()}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              className={classes.submitButton}
              onClick={
                currentClientData.hasOwnProperty("id")
                  ? editClient
                  : saveNewClient
              }
            >
              {currentClientData.hasOwnProperty("id") ? "Submit" : "Create"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default NewEditClientDialogView;
