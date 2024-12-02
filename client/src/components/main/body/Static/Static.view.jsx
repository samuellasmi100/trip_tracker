import {
  Grid,
  Button,
  IconButton,
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import React from "react";
import { useStyles } from "./Static.style";
import { useSelector } from "react-redux";
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

function StaticView({ handleButtonClick ,handleNavButtonClicked,searchTerm,
  setSearchTerm,handleAddIcons}) {
  const classes = useStyles();

  const headers = ["חדרים", "מלונות","אורחים","תשלומים","חופשות"];
  const activeButton = useSelector((state) => state.staticSlice.activeButton)

  return (
    <Grid
      item
      xs={12}
      style={{
        border: "1px solid rgb(61, 63, 71)",
        background: "rgb(45, 45, 45)",
        width: "80vw",
        height: "calc(100vh - 170px)",
      }}
    >
      <Grid item style={{ display: "flex",justifyContent:"space-between" }}>
        <Grid>
        {headers.map((label) => (
          <Button
            key={label}
            className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
            onClick={() => handleButtonClick(label)}
          >
            {label}
          </Button>
        ))
        }
        </Grid>
        <Grid>
         <Grid style={{display:'flex'}}>
          <Grid style={{marginTop:"5px",}}> 
          <FormControl>
        <TextField
          size="small"
          className={classes.textField}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          InputProps={{ 
            endAdornment: (
              <InputAdornment
                position="end"
                // style={{ display: showClearIcon }}
                // onClick={handleClick}
              >
                <SearchIcon style={{color: 'rgb(84, 169, 255)'}}/>
              </InputAdornment>
            )
          }}
        />
      </FormControl>
          </Grid>
         <IconButton onClick={handleAddIcons}>
            <AddBoxIcon style={{ color: "#54A9FF", fontSize: "30px" }} />
          </IconButton>
         </Grid>
        </Grid>
      </Grid>
     {handleNavButtonClicked()}
    </Grid>
  );
}

export default StaticView;
