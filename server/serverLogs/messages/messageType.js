let MessageType = {
    UNAUTHORIZED:{httpCode: 401, message :"Login failed, invalid user name or password",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    FORBIDDEN:{httpCode: 403, message :"Access Forbidden",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    GENERAL_ERROR :{httpCode: 600, message : "Something went wrong please try again",writeToFile:false},
    INPUT_REGISTER_SUCCESS:{httpCode: 200,message :"The user add successfully",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    SMS_SENT:{httpCode: 200,message :"Verification SMS sent Successfully",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    EMAIL_SENT:{httpCode: 200,message :"Verification EMAIL sent Successfully",returnMessageToUser:true,sendEmail:false,writeToFile:false},
}


module.exports = MessageType;