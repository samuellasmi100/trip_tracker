import { Grid, Select, InputLabel, MenuItem, OutlinedInput, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import './Overview.style'

function OverviewView() {

  return (
  <Grid
        container
        style={{
          background: "#ffffff",
          width: "10vw",
          border: "1px solid #e2e8f0",
        }}
      >
     <Grid container item>
      <Grid style={{color:"#1e293b",marginTop:"10px",marginRight:"60px"}}>
      <Typography style={{color:"#1e293b",textAlign:"center"}}>מבט כללי</Typography>
      <hr style={{border: "1px solid #e2e8f0"}} />

      </Grid>
      
      <Grid>
        
      </Grid>
     </Grid>
    </Grid>
  )
}

export default OverviewView;
