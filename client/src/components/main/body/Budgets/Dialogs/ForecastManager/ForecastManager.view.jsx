import React from "react";
import {
  Button,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { useStyles } from "./ForecastManager.style";
import { useSelector } from "react-redux";


const ForecastManagerView = (props) => {
  const paymentCurrency = ["שקל", "דולר", "יורו"]
  const form = useSelector((state) => state.budgetSlice.form)
  const categories = useSelector((state) => state.budgetSlice.categories)
  const subCategories = useSelector((state) => state.budgetSlice.subCategories)

  const classes = useStyles();

  const {
    handleInputChange,
    submit,
    handleCloseClicked
  } = props;

  return (
    <>
      <Grid container>
        <Grid container style={{ height: "300px", maxHeight: "301px", overflow: "auto", }}>
          <Grid item xs={12}>
            <Grid spacing={2} style={{ display: "flex", justifyContent: 'center', marginTop: "20px", gap: "10px" }}>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>בחר קטגוריה</InputLabel>
                <Select
                  name="categories"
                  onChange={handleInputChange}
                  input={<OutlinedInput className={classes.selectOutline} />}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#222222",
                        color: "#ffffff !important",
                        maxHeight: "260px",
                        overflowY: "auto",
                        width: "187px",
                        "&::-webkit-scrollbar": {
                          width: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "#babec7",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#707079",
                          borderRadius: "4px",
                        },
                      },
                    },
                  }}
                >
                  {categories?.map((type) => (
                    <MenuItem
                      key={type.id}
                      value={type.id}
                      className={classes.selectedMenuItem}
                      sx={{
                        height: "40px",
                        width: "187px",
                        borderRadius: "4px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          background: "#babec7",
                        },
                      }}
                    >
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>בחר תת קטגוריה</InputLabel>
                <Select
                  name="subCategories"
                  onChange={handleInputChange}
                  input={<OutlinedInput className={classes.selectOutline} />}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#222222",
                        color: "#ffffff !important",
                        maxHeight: "260px",
                        overflowY: "auto",
                        width: "151px",
                        "&::-webkit-scrollbar": {
                          width: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "#babec7",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#707079",
                          borderRadius: "4px",
                        },
                      },
                    },
                  }}
                >
                  {subCategories?.map((type) => (
                    <MenuItem
                      key={type.id}
                      value={type.id}
                      className={classes.selectedMenuItem}
                      sx={{
                        height: "40px",
                        width: "187px",
                        borderRadius: "4px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          background: "#babec7",
                        },
                      }}
                    >
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>מספר תשלומים</InputLabel>
                <TextField
                  name="numberOfPayments"
                  value={form.numberOfPayments}
                  className={classes.shortTextField}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {Array.from({ length: form?.numberOfPayments }).map((_, index) => (
              <Grid spacing={2} style={{ display: "flex", justifyContent: 'center', gap: "10px" }}>
                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>צפי הוצאה </InputLabel>
                  <TextField
                    name={`expectedExpenditure${index}`}
                    value={form[`expectedExpenditure${index}`] || ''}
                    className={classes.textField}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>
                    תאריך תשלום
                  </InputLabel>
                  <TextField
                    type="date"
                    name={`paymentDate${index}`}
                    value={form[`paymentDate${index}`] || ''}
                    className={classes.textField}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>צורת תשלום</InputLabel>
                  <Select
                    name={`paymentCurrency${index}`}
                    value={form[`paymentCurrency${index}`] || ''}


                    onChange={handleInputChange}
                    input={<OutlinedInput className={classes.selectOutline} />}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          color: "#ffffff !important",
                          bgcolor: "#222222",
                        },
                      },
                    }}
                  >
                    {paymentCurrency?.map((type) => (
                      <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            ))}

          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          container
          justifyContent="space-around">
          <Grid item>
            <Button
              onClick={submit}
              className={classes.submitButton}
            > הוסף צפי הוצאה
            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.cancelButton} onClick={handleCloseClicked}>
              סגור
            </Button>
          </Grid>
        </Grid>

      </Grid>

    </>
  );
};

export default ForecastManagerView;



