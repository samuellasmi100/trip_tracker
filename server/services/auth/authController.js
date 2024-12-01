const router = require("express").Router();
const authService = require("./authService")



router.post("/login", async (req, res, next) => {

  let loginData = req.body

  try {
    const response = await authService.login(loginData)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
