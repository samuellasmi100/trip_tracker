import React from "react";
import {
    Switch,
    RadioGroup,
    Radio,
    FormControlLabel,
    Grid,
    Typography,
    InputLabel,
} from "@mui/material";
import { useStyles } from "../../Guest/GuestWizard.style";
import { useSelector } from "react-redux";

function Flights({ handleInputChange }) {
    const classes = useStyles();
    const form = useSelector((state) => state.userSlice.form);

    return (
        <Grid style={{ marginRight: "20px", marginTop: form.user_type === "parent" ? "20px" : "50px" }}>
            <div className={classes.switchRow}>
                <Typography className={classes.switchLabel}>כולל טיסות</Typography>
                <Switch
                    name="flights"
                    checked={Boolean(form.flights)}
                    onChange={handleInputChange}
                    className={classes.switchControl}
                    size="small"
                />
            </div>

            <div className={classes.switchRow}>
                <Typography className={classes.switchLabel}>חלק מקבוצה?</Typography>
                <Switch
                    name="is_in_group"
                    checked={Boolean(form.is_in_group)}
                    onChange={handleInputChange}
                    className={classes.switchControl}
                    size="small"
                />
            </div>

            {Boolean(form.flights) && (
                <>
                    <div className={classes.switchRow}>
                        <Typography className={classes.switchLabel}>טסים איתנו</Typography>
                        <Switch
                            name="flying_with_us"
                            checked={Boolean(form.flying_with_us)}
                            onChange={handleInputChange}
                            className={classes.switchControl}
                            size="small"
                        />
                    </div>

                    <div style={{ marginTop: "12px" }}>
                        <InputLabel className={classes.inputLabelStyle} style={{ marginBottom: "8px" }}>
                            כיוון טיסה
                        </InputLabel>
                        <div className={classes.radioGroupCard}>
                            <RadioGroup
                                name="flights_direction"
                                value={form.flights_direction || ""}
                                onChange={handleInputChange}
                                row
                            >
                                <FormControlLabel
                                    value="round_trip"
                                    control={<Radio />}
                                    label="הלוך ושוב"
                                    className={classes.radioLabel}
                                />
                                <FormControlLabel
                                    value="one_way_outbound"
                                    control={<Radio />}
                                    label="הלוך בלבד"
                                    className={classes.radioLabel}
                                />
                                <FormControlLabel
                                    value="one_way_return"
                                    control={<Radio />}
                                    label="חזור בלבד"
                                    className={classes.radioLabel}
                                />
                            </RadioGroup>
                        </div>
                    </div>
                </>
            )}
        </Grid>
    );
}

export default Flights;
