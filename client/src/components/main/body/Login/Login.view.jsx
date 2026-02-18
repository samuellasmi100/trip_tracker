import React from "react";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { InputBase } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { ReactComponent as Makor } from "../../../../assets/icons/makor-big.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useStyles } from "./Login.style";
import "./Login.css"
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
      <Grid item className={classes.loginContainer} >
      
        <Grid style={{ paddingTop: "0px", textAlign: "center" }}>
          <Typography
            className={classes.welcome}
            style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b" }}
          >
            ברוכים הבאים!
          </Typography>
        </Grid>
        <Grid
          item
          container
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          className={classes.inputContainer}
        >
          <Grid item container justifyContent="center" style={{marginTop:"24px"}}>
          <form autoComplete="off">
            <InputBase
              className={`${classes.input} autofill-disabled`}
              autoComplete="off"
              required
              variant="outlined"
              placeholder="אימייל"
              name="email"
              onChange={handleChange}
              
            />
            <FormControl>
              <InputBase
                className={classes.input}
                placeholder="סיסמא"
                name="password"
                type={formState.showPassword ? "text" : "password"}
                onChange={handleChange}
                onKeyDown={(e) =>
                  e.key === "Enter" ? loginPostRequest(e) : null
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {formState.showPassword ? (
                        <VisibilityIcon
                          style={{
                            opacity: "100%",
                            color: "#94a3b8",
                            fontSize: "1.25rem",
                          }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          style={{
                            opacity: "100%",
                            color: "#94a3b8",
                            fontSize: "1.25rem",
                          }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            </form>
          </Grid>
         
          <Grid item style={{ paddingTop: "8px" }}>
            <Button
              className={classes.loginPostRequest}
              variant="contained"
              style={{
                marginTop: "2vh",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
              onClick={(e) => loginPostRequest(e)}
            >
              Log In
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {/* <ResetPassword open={resetPasswordDialog} onClose={openResetPasswordDialog}/> */}
    </Grid>
  );
}

export default LoginView;
