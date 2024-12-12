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

function Child({areaCodes,handleInputChange }) {
    const classes = useStyles();
    const form = useSelector((state) => state.userSlice.form)
    return (
        <>
            <Grid item xs={6}>
                <Grid container spacing={2} justifyContent="center">
                <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            שם פרטי בעברית
                        </InputLabel>
                        <TextField
                            name="hebrew_first_name"
                            value={form.hebrew_first_name}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                             שם משפחה בעברית
                        </InputLabel>
                        <TextField
                            name="hebrew_last_name"
                            value={form.hebrew_last_name}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            שם פרטי ושם משפחה באנגלית
                        </InputLabel>
                        <TextField
                            name="english_first_name"
                            value={form.english_first_name}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            שם משפחה באנגלית
                        </InputLabel>
                        <TextField
                            name="english_last_name"
                            value={form.english_last_name}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                תאריך לידה
              </InputLabel>
              <TextField
                type="date"
                name="birth_date"
                value={form.birth_date}
                className={classes.dateTextField}
                onChange={handleInputChange}
              />
            </Grid>
                </Grid>
            </Grid>
            <Grid item xs={5}>
            <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>גיל</InputLabel>
              <TextField
                name="age"
                value={form.age}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
                    
                <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            מספר זהות
                        </InputLabel>
                        <TextField
                            name="identity_id"
                            value={form.identity_id}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>אימייל</InputLabel>
                        <TextField
                            name="email"
                            value={form.email}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            מספר טלפון
                        </InputLabel>
                        <Grid container>
                            <Grid style={{ paddingLeft: "10px" }}>
                                <TextField
                                    name="phone_b"
                                    value={form.phone_b}
                                    className={classes.textFieldPhone}
                                    onChange={handleInputChange}

                                />
                            </Grid>
                            <Grid>
                                <Select
                                    name="phone_a"
                                    value={form.phone_a}
                                    onChange={handleInputChange}
                                    input={
                                        <OutlinedInput
                                            name="phoneA"
                                            value={form.phoneA}
                                            className={classes.selectOutline}
                                        />
                                    }
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                color: "#ffffff !important",
                                                bgcolor: "#222222",
                                            },
                                        },
                                    }}
                                >
                                    {areaCodes.map((region) => (
                                        <MenuItem
                                            key={region}
                                            value={region}
                                            className={classes.selectedMenuItem}>
                                            <ListItemText
                                                primaryTypographyProps={{ fontSize: "16" }}
                                                primary={region}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                         כתובת מלאה
                        </InputLabel>
                        <TextField
                            name="address"
                            value={form.address}
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
