const router = require("express").Router();
const userService = require("./userService")
const uuid = require("uuid").v4;

router.post("/", async (req, res, next) => {
    const userData = req.body
    userData.parent_id = uuid();
    try {
      const response = userService.addParent(userData)
      res.send("ההוספה עברה בהצלחה")

    } catch (error) {
      return next(error);
    }
});

router.post("/child", async (req, res, next) => {
  const userData = req.body
  userData.child_id = uuid();
  try {
    const response = userService.addChild(userData)
   res.send("ההוספה עברה בהצלחה")

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
    const parentId = req.params.id
    const response = await userService.getChildByParentId(parentId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.put("/", async (req, res, next) => {
   const userData = req.body
  try {
   await userService.updateParentUser(userData)
   res.send("העדכון עבר בהצלחה")
  } catch (error) {
    return next(error);
  }
});

router.put("/child", async (req, res, next) => {
  const userData = req.body
 try {
     await userService.updateChildUser(userData)
  res.send("העדכון עבר בהצלחה")

 } catch (error) {
   return next(error);
 }
});






module.exports = router;
