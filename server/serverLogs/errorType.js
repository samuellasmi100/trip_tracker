let ErrorType = {
    UNAUTHORIZED:{httpCode: 401, message :"Login failed, invalid user name or password",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    FORBIDDEN:{httpCode: 403, message :"Access Forbidden",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    SQL_ERROR:{httpCode:500, message : "Service unavailable", returnMessageToUser:false,sendEmail:false,writeToFile:false},
    SQL_GENERAL_ERROR:{httpCode:400, message : "Something went wrong please try again", returnMessageToUser:true,sendEmail:false,writeToFile:true},
    SQL_SYNTAX_ERROR:{httpCode: 503, message :"You have an error in your SQL syntax", returnMessageToUser:false,sendEmail:false,writeToFile:false},
    SQL_DUPLICATE_ERROR:{httpCode: 503, message :"This client user is already exist", returnMessageToUser:true,sendEmail:false,writeToFile:false},
    GENERAL_ERROR :{httpCode: 600, message : "Something went wrong please try again",writeToFile:false},
    INVALID_TOKEN:{httpCode: 498,message : "Invalid token",returnMessageToUser:false,sendEmail:false,writeToFile:false},
    VALID_TOKEN:{httpCode:200,message : "Valid token",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    INPUT_LOGIN_VALIDATE:{httpCode: 400 ,message :"Missing required inputs",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    INPUT_REGISTER_CLIENT_VALIDATE:{httpCode: 422 ,message :"Missing required inputs",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    EMAIL_VALIDATE:{httpCode: 400,message : "Invalid email format. Please provide a valid email address",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    INPUT_REGISTER_ERROR:{httpCode:409,message :"This user already exist",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    INPUT_REGISTER_SUCCESS:{httpCode: 200,message :"The user add successfully",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    FAILED_TO_VERIFY_CODE:{httpCode: 401,message :"Failed to verify code",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    SMS_SENT:{httpCode: 200,message :"Verification SMS sent Successfully",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    EMAIL_SENT:{httpCode: 200,message :"Verification EMAIL sent Successfully",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    FAILED_TO_SEND_SMS:{httpCode: 401,message :"Failed to send code to SMS",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    FAILED_TO_SEND_EMAIL:{httpCode: 401,message :"Failed to send verify code Email",returnMessageToUser:true,sendEmail:false,writeToFile:false},
    SQL_QUERY_ERROR:{httpCode: 500,message :"Please check the query",returnMessageToUser:false,sendEmail:false,writeToFile:false},
}


module.exports = ErrorType;