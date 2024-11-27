import React from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    ListItemText,
    OutlinedInput
} from "@mui/material";
import { useStyles } from "../../Guest/Guest.style";
import { useSelector } from "react-redux";

function Flights({areaCodes,handleInputChange }) {

    const classes = useStyles();
    const form = useSelector((state) => state.userSlice.form)
    return (
        <>
        <Grid style={{ marginRight: "20px",marginTop: form.user_type === "parent" ? "20px" : "90px"}}>
          <Grid container display="flex"
          >
            <Grid item >
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#686B76",
                      "&.Mui-checked": {
                        color: "#54A9FF",
                      },
                    }}
                    name="flights"
                    className={classes.checkbox}
                    onClick={handleInputChange}
                    checked={form.flights}
                  />
                }
                label={
                  <Typography style={{ color: "##757882", fontSize: "15px" }}>
                    כולל טיסות
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#686B76",
                      "&.Mui-checked": {
                        color: "#54A9FF",
                      },
                    }}
                    name="is_in_group"
                    className={classes.checkbox}
                    onClick={handleInputChange}
                    checked={form.is_in_group}
                  />
                }
                label={
                  <Typography style={{ color: "##757882", fontSize: "15px" }}>
                     חלק מקבוצה?
                  </Typography>
                }
              />
              {form.flights ? 
              <Grid>
                   <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#686B76",
                      "&.Mui-checked": {
                        color: "#54A9FF",
                      },
                    }}
                    name="flying_with_us"
                    value="flying_with_us"
                    className={classes.checkbox}
                    onClick={handleInputChange}
                    checked={form.flying_with_us}
                  />
                }
                label={
                  <Typography style={{ color: "##757882", fontSize: "15px" }}>
                    טסים איתנו
                  </Typography>
                }
                
              />
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#686B76",
                      "&.Mui-checked": {
                        color: "#54A9FF",
                      },
                    }}
                    name="flights_direction"
                    value="round_trip" 
                    className={classes.checkbox}
                    onClick={handleInputChange}
                    checked={form.flights_direction === "round_trip"}
                  />
                }
                label={
                  <Typography style={{ color: "##757882", fontSize: "15px" }}>
                    הלוך ושוב
                  </Typography>
                }
              />
               <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#686B76",
                      "&.Mui-checked": {
                        color: "#54A9FF",
                      },
                    }}
                    name="flights_direction"
                    value="one_way_outbound" 
                    className={classes.checkbox}
                    onClick={handleInputChange}
                    checked={form.flights_direction === "one_way_outbound"}
                  />
                }
                label={
                  <Typography style={{ color: "##757882", fontSize: "15px" }}>
                      הלוך בלבד
                  </Typography>
                }
              />
               <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#686B76",
                      "&.Mui-checked": {
                        color: "#54A9FF",
                      },
                    }}
                    name="flights_direction"
                    value="one_way_return"
                    className={classes.checkbox}
                    onClick={handleInputChange}
                    checked={form.flights_direction === "one_way_return"}
                  />
                }
                label={
                  <Typography style={{ color: "##757882", fontSize: "15px" }}>
                    חזור בלבד 
                  </Typography>
                }
                
              />

              </Grid>
              :<Grid></Grid>}
              
            </Grid>

          </Grid>
        </Grid>
        </>
    )
}

export default Flights;
