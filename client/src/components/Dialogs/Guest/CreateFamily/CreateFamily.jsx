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
import { useStyles } from "../Guest.style";
import { useSelector } from "react-redux";

function Child({handleInputChange }) {
    const classes = useStyles();
    const form = useSelector((state) => state.userSlice.form)
    return (
        <>
            <Grid item xs={6}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            שם משפחה / קבוצה
                        </InputLabel>
                        <TextField
                            name="family_name"
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>
            </Grid>
          
        </>
    )
}

export default Child;
