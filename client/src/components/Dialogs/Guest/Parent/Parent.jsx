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

function Parent({areaCodes,handleInputChange }) {
    const classes = useStyles();
    const form = useSelector((state) => state.userSlice.form)
    return (
        <>
            <Grid item xs={6}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            שם פרטי
                        </InputLabel>
                        <TextField
                            name="first_name"
                            value={form.first_name}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            שם משפחה
                        </InputLabel>
                        <TextField
                            name="last_name"
                            value={form.last_name}
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
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <Grid container spacing={2} justifyContent="center">
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
                                                paddinTop: "110px !important"
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
                            כמות נופשים
                        </InputLabel>
                        <TextField
                            name="number_of_guests"
                            value={form.number_of_guests}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>

                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            כמות חדרים
                        </InputLabel>
                        <TextField
                            name="number_of_rooms"
                            value={form.number_of_rooms}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <InputLabel className={classes.inputLabelStyle}>
                            סכום עסקה
                        </InputLabel>
                        <TextField
                            name="total_amount"
                            value={form.total_amount}
                            className={classes.textField}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Parent;
