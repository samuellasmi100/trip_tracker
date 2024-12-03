const router = require("express").Router();
const userService = require("./userService")
const uuid = require("uuid").v4;

router.post("/", async (req, res, next) => {
    const userData = req.body.form
    userData.family_id = req.body.newFamilyId
    if(userData.userType === "addParent" || userData.userType === "addFamily"){
      userData.is_main_user = true
      userData.user_type = "parent"
      userData.user_id = req.body.newUserId
    }else{
      userData.is_main_user = false
      userData.user_type = "client"
      userData.user_id = uuid();
    }
    try {
      const response = await userService.addGuest(userData)
   
       res.send(response)
    } catch (error) {
      return next(error);
    }
});

router.get("/:id", async (req, res, next) => {

  const familyId = req.params.id
  try {
    const response = await userService.getFamilyGuests(familyId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.put("/", async (req, res, next) => {
   const userData = req.body
   console.log(userData)
  try {
   await userService.updateGuest(userData)
   const response = await userService.getFamilyMamber(userData.family_id)
   res.send(response)
  } catch (error) {
    return next(error);
  }
});

router.get("/details/:id/:familyId/:isIngroup", async (req, res, next) => {
  const id = req.params.id
  const familyId= req.params.familyId
  const isIngroup = req.params.isIngroup
  try {
   const response = await userService.getUserDetails(id,familyId,isIngroup)
   res.send(response)

  } catch (error) {
    return next(error);
  }
});









module.exports = router;
