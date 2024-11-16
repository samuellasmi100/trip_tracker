const router = require("express").Router();
const userService = require("./userService")
const uuid = require("uuid").v4;

router.post("/", async (req, res, next) => {
    const userData = req.body
    userData.parentId = uuid();
    try {
      const response = userService.addParent(userData)
     res.send("hello")
    } catch (error) {
      return next(error);
    }
});

router.post("/child", async (req, res, next) => {
  const userData = req.body
  userData.childId = uuid();
  try {
    const response = userService.addChild(userData)
   res.send("hello")
  } catch (error) {
    return next(error);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    const response = await userService.getMainUsers()

    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/child/:id", async (req, res, next) => {
  try {
    const childId = req.params.id
    const response = await userService.getChildByParentId(childId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
   const userId = req.params.id
 
  try {
   
  } catch (error) {
    return next(error);
  }
});






module.exports = router;
