import React from "react";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { InputBase } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import avimorLogo from "../../../../assets/icons/avimor-logo.png";
import { useStyles } from "./Login.style";
import "./Login.css";

function LoginView({
  formState,
  handleClickShowPassword,
  handleClickForgotPassword,
  handleChange,
  loginPostRequest,
}) {
  const classes = useStyles();
  return (
    <Grid container className={classes.loginPage}>
      <Grid item className={classes.loginContainer}>
        {/* Logo */}
        <div className={classes.logoWrapper}>
          <img src={avimorLogo} alt="Avimor Tourism" className={classes.logo} />
        </div>

        <Typography className={classes.subtitle}>
          מערכת ניהול חופשות
        </Typography>

        {/* Form */}
        <form autoComplete="off" className={classes.form}>
          <div className={classes.inputWrapper}>
            <Typography className={classes.inputLabel}>אימייל</Typography>
            <InputBase
              className={`${classes.input} autofill-disabled`}
              autoComplete="off"
              required
              placeholder="הזן כתובת אימייל"
              name="email"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <EmailOutlinedIcon className={classes.inputIcon} />
                </InputAdornment>
              }
            />
          </div>

          <div className={classes.inputWrapper}>
            <Typography className={classes.inputLabel}>סיסמא</Typography>
            <FormControl fullWidth>
              <InputBase
                className={classes.input}
                placeholder="הזן סיסמא"
                name="password"
                type={formState.showPassword ? "text" : "password"}
                onChange={handleChange}
                onKeyDown={(e) =>
                  e.key === "Enter" ? loginPostRequest(e) : null
                }
                startAdornment={
                  <InputAdornment position="start">
                    <LockOutlinedIcon className={classes.inputIcon} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      size="small"
                    >
                      {formState.showPassword ? (
                        <VisibilityIcon className={classes.visibilityIcon} />
                      ) : (
                        <VisibilityOffIcon className={classes.visibilityIcon} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>

          <Button
            className={classes.loginButton}
            variant="contained"
            fullWidth
            onClick={(e) => loginPostRequest(e)}
          >
            כניסה
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}

export default LoginView;
