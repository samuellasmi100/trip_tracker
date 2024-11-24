import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Collapse,
  Box,
  Typography,
  TextField,
  Input,
} from "@mui/material";
  import React, { useState } from "react";
import { useStyles } from "./Analytics.style";
 
  
  function AnalyticsView(props) {
    const headers = ["כמות אורחים","ילדים עד גיל 3","ילדים מעל גיל 3","מספר המשפחות"]
    const classes = useStyles();
    const data = [
      {amount:50,child:10,child1:20,families:2}
    ]
   
    
   //guest
   //payments
   //rooms

    return (
    <Grid style={{marginRight:"70px",display:"flex",gap:"10px",justifyContent:"center"}}>
     <Grid style={{height:"250px",width:"400px" ,border:"1px solid red"}}>

     </Grid>
     <Grid style={{height:"250px",width:"400px" ,border:"1px solid red"}}>

     </Grid>
     <Grid style={{height:"250px",width:"400px" ,border:"1px solid red"}}>

     </Grid>
    </Grid>
    )
  }
  
  export default AnalyticsView;
  