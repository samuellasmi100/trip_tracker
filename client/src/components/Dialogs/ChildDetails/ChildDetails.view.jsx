import React, { useState } from "react";
import {
    Grid,
    Typography,
} from "@mui/material";
import { useStyles } from "./ChildDetails.style";



const ChildDetailsView = ({ userData }) => {
    // const handleDownloadPDF = (userDetails, flightDetails, roomsDetails, notesDetails, paymentsDetails) => {
    //     const doc = new jsPDF();
      
    //     // Title
    //     doc.setFontSize(18);
    //     doc.text("User Report", 105, 10, null, null, "center");
      
    //     // Add Guest Details
    //     doc.setFontSize(16);
    //     doc.text("פרטי אורח", 10, 20);
    //     doc.setFontSize(12);
    //     doc.text(`קבוצה / משפחה: ${userDetails[0]?.family_name || ""}`, 10, 30);
    //     doc.text(`שם פרטי ושם משפחה: ${userDetails[0]?.hebrew_name || ""}`, 10, 40);
    //     doc.text(`גיל: ${flightDetails[0]?.age || ""}`, 10, 50);
    //     doc.text(`מספר זהות: ${userDetails[0]?.identity_id || ""}`, 10, 60);
      
    //     // Add Flight Status
    //     doc.setFontSize(16);
    //     doc.text("סטטוס טיסה", 10, 70);
    //     doc.setFontSize(12);
    //     doc.text(`מספר דרכון: ${flightDetails[0]?.passport_number || ""}`, 10, 80);
    //     doc.text(`תוקף דרכון: ${flightDetails[0]?.validity_passport || ""}`, 10, 90);
    //     doc.text(`נוסע בטיסה: ${userDetails[0]?.flights === "1" ? "כן" : "לא"}`, 10, 100);
    //     doc.text(`סוג טיסה: ${handleFlightStatus(userDetails)}`, 10, 110);
      
    //     // Add Room Details
    //     doc.setFontSize(16);
    //     doc.text("חדר", 10, 120);
    //     doc.setFontSize(12);
    //     doc.text(`מספר חדר: ${roomsDetails[0]?.roomId || ""}`, 10, 130);
    //     doc.text(`סוג חדר: ${roomsDetails[0]?.roomType || ""}`, 10, 140);
    //     doc.text(`קומה: ${roomsDetails[0]?.roomFloor || ""}`, 10, 150);
    //     doc.text(`כיוון: ${roomsDetails[0]?.roomDirection || ""}`, 10, 160);
      
    //     // Add Notes
    //     doc.setFontSize(16);
    //     doc.text("הודעות", 10, 170);
    //     doc.setFontSize(12);
    //     notesDetails?.forEach((note, index) => {
    //       doc.text(`${index + 1}. ${note.note}`, 10, 180 + index * 10);
    //     });
      
    //     // Add Payments
    //     if (userDetails[0]?.user_type === "parent") {
    //       doc.setFontSize(16);
    //       doc.text("תשלום", 10, 190 + notesDetails.length * 10);
    //       doc.setFontSize(12);
    //       doc.text(`סכום מקורי: ${userDetails[0]?.total_amount || ""}`, 10, 200 + notesDetails.length * 10);
    //       doc.text(
    //         `היתרה לתשלום: ${paymentsDetails[paymentsDetails.length - 1]?.remainsToBePaid || ""}`,
    //         10,
    //         210 + notesDetails.length * 10
    //       );
      
    //       paymentsDetails?.forEach((payment, index) => {
    //         doc.text(
    //           `סכום שהתקבל: ${payment.amountReceived || ""} בתאריך: ${payment.paymentDate || ""}`,
    //           10,
    //           220 + notesDetails.length * 10 + index * 10
    //         );
    //       });
    //     }
      
    //     // Save the PDF
    //     doc.save("user-report.pdf");
    // };
      
      // Helper Function for Flight Status
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
    return (
        <Grid container style={{ display: "flex", flexDirection: "column", paddingRight: '25px' }}>
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
                <Grid>
                    <Grid>
                        <Typography style={{ fontSize: "25px" }}>חדר</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>מספר חדר :</Typography>
                        <Typography className={classes.inputLabelStyle}>{roomsDetails[0]?.roomId}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>סוג חדר :</Typography>
                        <Typography className={classes.inputLabelStyle}> {roomsDetails[0]?.roomType} </Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>קומה  :</Typography>
                        <Typography className={classes.inputLabelStyle}> {roomsDetails[0]?.roomFloor}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>כיוון  :</Typography>
                        <Typography className={classes.inputLabelStyle}> {roomsDetails[0]?.roomDirection}</Typography>
                    </Grid>
                </Grid>

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
                        <Typography className={classes.inputLabelStyle}> {userData?.total_amount}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', gap: "5px" }}>
                        <Typography className={classes.inputLabelStyle}>היתרה לתשלום  :</Typography>
                        <Typography className={classes.inputLabelStyle}> {paymentsDetails[paymentsDetails?.length-1]?.remainsToBePaid}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', flexDirection: "column", gap: "5px", }}>
                        {paymentsDetails?.length > 0 ?
                            paymentsDetails.map((key) => {
                                return( 
                                <Grid style={{border:"6px solid #343536",width:"70%"}}>
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
