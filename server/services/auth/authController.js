const router = require("express").Router();
const authService = require("./authService")



router.post("/login", async (req, res, next) => {
console.log(req.body,"hhhhhhhhhhhh")
  let loginData = req.body

  try {
    const response = await authService.login(loginData)
    console.log(response,"login")
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
