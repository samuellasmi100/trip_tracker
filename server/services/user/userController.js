const router = require("express").Router();
const userService = require("./userService")
const uuid = require("uuid").v4;

router.post("/", async (req, res, next) => {
    const userData = req.body
    userData.parent_id = uuid();

    try {
      const response = userService.addGuest(userData)
      res.send("ההוספה עברה בהצלחה")

    } catch (error) {
      return next(error);
    }
});

router.post("/child", async (req, res, next) => {
  const userData = req.body
    userData.child_id = uuid();
  
  try {
   await  userService.addChild(userData)
   const response = await userService.getFamilyMambers(userData.family_id)
   res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.post("/family", async (req, res, next) => {
  const familyName = req.body
  familyName.family_id = uuid();
  try {
    const response = userService.addFamily(familyName)
    res.send("ההוספה עברה בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.get("/families", async (req, res, next) => {
  try {
    const response = await userService.getFamilies()
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const familyId = req.params.id
  try {
    const response = await userService.getFamilyMambers(familyId)
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
   await userService.updateGuest(userData)
   const response = await userService.getFamilyMambers(userData.family_id)
   res.send(response)
  } catch (error) {
    return next(error);
  }
});

router.put("/child", async (req, res, next) => {
  const userData = req.body
 try {
    await userService.updateChild(userData)
    const response = await userService.getFamilyMambers(userData.family_id)
    res.send(response)
 } catch (error) {
   return next(error);
 }
});






module.exports = router;
