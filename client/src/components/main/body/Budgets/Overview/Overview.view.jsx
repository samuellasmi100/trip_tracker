import { Grid, Select, InputLabel, MenuItem, OutlinedInput, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import './Overview.style'

function OverviewView() {

  return (
  <Grid
        container
        style={{
          background: "#2d2d2d",
          width: "10vw",
          border: "1px solid rgb(61, 63, 71)",
        }}
      >
     <Grid container item>
      <Grid style={{color:"white",marginTop:"10px",marginRight:"60px"}}>
      <Typography style={{color:"white",textAlign:"center"}}>מבט כללי</Typography>
      <hr style={{border: "1px solid rgb(61, 63, 71)"}} />

      </Grid>
      
      <Grid>
        
      </Grid>
     </Grid>
    </Grid>
  )
}

export default OverviewView;
