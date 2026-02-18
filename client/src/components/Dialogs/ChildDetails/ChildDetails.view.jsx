import React, { useState } from "react";
import {
    Grid,
    Typography,
} from "@mui/material";
import { useStyles } from "./ChildDetails.style";
import { use } from "react";



const ChildDetailsView = ({ userData }) => {

    const classes = useStyles();
    const userDetails = userData?.userDetails
    const flightDetails = userData?.flightsDetails
    const roomsDetails = userData?.roomsDetails
    const notesDetails = userData?.notesDetails
    const paymentsDetails = userData?.paymentsDetails

    const handleFlightStatus = () => {
        if (userDetails[0]?.flights_direction === "one_way_outbound") {
            return "הלוך בלבד"
        } else if (userDetails[0]?.flights_direction === "one_way_return") {
            return "חזור בלבד"
        } else {
            return "הלוך חזור"
        }
    }
    const handleFlightDetails = () => {
        if (userDetails[0]?.flights_direction === "one_way_outbound") {
            return (
                <>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>חברת תעופה הלוך :</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.outbound_airline}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}> תאריך טיסה הלוך :</Typography>
                        <Typography className={classes.inputLabelStyle}> {flightDetails[0]?.outbound_flight_date}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}> מספר טיסה הלוך :</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.outbound_flight_number}</Typography>
                    </Grid>
                </>
            )
        } else if (userDetails[0]?.flights_direction === "one_way_return") {
            return (
                <>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>חברת תעופה חזור :</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.return_airline} </Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}> תאריך טיסה חזור :</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.return_flight_date}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}> מספר טיסה חזור:</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.return_flight_number}</Typography>
                    </Grid>
                </>
            )
        } else {
            return (
                <>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>חברת תעופה הלוך :</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.outbound_airline}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>חברת תעופה חזור :</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.return_airline} </Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}> תאריך טיסה הלוך :</Typography>
                        <Typography className={classes.inputLabelStyle}> {flightDetails[0]?.outbound_flight_date} </Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}> תאריך טיסה חזור :</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.return_flight_date}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}> מספר טיסה הלוך :</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.outbound_flight_number}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}> מספר טיסה חזור:</Typography>
                        <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.return_flight_number}</Typography>
                    </Grid>
                </>
            )
        }
    }

    const calaculatRminedToBePaid = () => {
   if(paymentsDetails.length === 0){
    return ""
   }else {
    const totalAmountReceived = paymentsDetails.reduce((sum, payment) => sum + Number(payment.amountReceived), 0);
    return userDetails[0]?.total_amount - totalAmountReceived 
   }
    }
    return (
        <Grid container style={{ display: "flex", flexDirection: "column", paddingRight: '25px',maxHeight: "300px" }}>
            <Grid item xs={6}>
                <Grid>
                    <Typography style={{ fontSize: "25px" }}>פרטי אורח</Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>קבוצה / משפחה  :</Typography>
                    <Typography className={classes.inputLabelStyle}> {userDetails[0]?.family_name}</Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>שם פרטי ושם משפחה:</Typography>
                    <Typography className={classes.inputLabelStyle}>{userDetails[0]?.hebrew_name} </Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>גיל :</Typography>
                    <Typography className={classes.inputLabelStyle}> {flightDetails[0]?.age}</Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>מספר זהות :</Typography>
                    <Typography className={classes.inputLabelStyle}> {userDetails[0]?.identity_id}</Typography>
                </Grid>
                <Grid >
                    <Typography style={{ fontSize: "25px", marginTop: "12px" }}>סטטוס טיסה</Typography>
                </Grid>

                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>מספר דרכון :</Typography>
                    <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.passport_number} </Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>תןקף דרכון :</Typography>
                    <Typography className={classes.inputLabelStyle}>{flightDetails[0]?.validity_passport} </Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>נוסע בטיסה  :</Typography>
                    <Typography className={classes.inputLabelStyle}> {userDetails[0]?.flights === "1" ? "כן" : "לא"}</Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}> סוג טיסה  :</Typography>
                    <Typography className={classes.inputLabelStyle}> {handleFlightStatus()} </Typography>
                </Grid>
                {handleFlightDetails()}
            </Grid>
            <Grid item xs={6}>
                {roomsDetails !== undefined && roomsDetails.length > 0 ? 
                <Grid>
                <Grid>
                    <Typography style={{ fontSize: "25px" }}>חדר</Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>מספר חדר :</Typography>
                    <Typography className={classes.inputLabelStyle}>{roomsDetails[0]?.rooms_id}</Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>סוג חדר :</Typography>
                    <Typography className={classes.inputLabelStyle}> {roomsDetails[0]?.type} </Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>קומה  :</Typography>
                    <Typography className={classes.inputLabelStyle}> {roomsDetails[0]?.floor}</Typography>
                </Grid>
                <Grid style={{ display: 'flex', gap: "5px" }}>
                    <Typography className={classes.inputLabelStyle}>כיוון  :</Typography>
                    <Typography className={classes.inputLabelStyle}> {roomsDetails[0]?.direction}</Typography>
                </Grid>
            </Grid>
                : ""}
                

                <Grid>
                    <Grid>
                        <Typography style={{ fontSize: "25px", marginTop: "12px" }}>הודעות</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', flexDirection: "column", gap: "5px" }}>
                        {notesDetails?.length > 0 ?
                            notesDetails.map((key) => {
                                return <Typography className={classes.inputLabelStyle}>{key.note} <br /></Typography>
                            })
                            : ""}
                    </Grid>
                    
                </Grid>
 
                 {
                    userDetails[0]?.user_type === "parent" ?   <Grid>
                    <Grid>
                        <Typography style={{ fontSize: "25px", marginTop: "12px" }}>תשלום</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>סכום מקורי :</Typography>
                        <Typography className={classes.inputLabelStyle}> {userDetails[0]?.total_amount}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>היתרה לתשלום  :</Typography>
                        <Typography className={classes.inputLabelStyle}> {calaculatRminedToBePaid()}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', flexDirection: "column", gap: "5px", }}>
                        {paymentsDetails?.length > 0 ?
                            paymentsDetails.map((key) => {
                                return( 
                                <Grid style={{border:"6px solid #e2e8f0",width:"70%"}}>
                                <Grid style={{ display: 'flex', gap: "5px" }}>
                                <Typography className={classes.inputLabelStyle}>סכום שהתקבל  :</Typography>
                                <Typography className={classes.inputLabelStyle}> {key.amountReceived}</Typography>
                            </Grid>
                            <Grid style={{ display: 'flex', gap: "5px",marginTop:"-5px" }}>
                                <Typography className={classes.inputLabelStyle}>בתאריך  :</Typography>
                                <Typography className={classes.inputLabelStyle}> {key.paymentDate}</Typography>
                            </Grid>         
                            </Grid>
                                )
                            })
                            : ""}
                    </Grid>
                    
                </Grid> : ""
                 }
            </Grid>
        </Grid>

    );
};

export default ChildDetailsView;
