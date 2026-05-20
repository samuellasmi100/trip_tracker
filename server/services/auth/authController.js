const router = require("express").Router();
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
const authService = require("./authService")



router.post("/login", async (req, res, next) => {
  let loginData = req.body
  console.log(loginData)
  try {
    const response = await authService.login(loginData)
    res.send(response)

  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle auth request", error));
  }
});



module.exports = router;
