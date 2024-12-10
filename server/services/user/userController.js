const router = require("express").Router();
const userService = require("./userService")
const staticService = require("../static/staticService")


router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
    const userData = req.body.form
    userData.family_id = req.body.newFamilyId
    if(userData.userType === "addParent" || userData.userType === "addFamily"){
      userData.is_main_user = true
      userData.user_type = "parent"
      userData.user_id = req.body.newUserId
    }else{
      userData.is_main_user = false
      userData.user_type = "client"
      userData.user_id = req.body.newUserId
    }
    try {
      const response = await userService.addGuest(userData,vacationId)
   
       res.send(response)
    } catch (error) {
      return next(error);
    }
});

router.get("/:id/:vacationid", async (req, res, next) => {
  const vacationId = req.params.vacationid
  const familyId = req.params.id
  try {
    const response = await userService.getFamilyGuests(familyId,vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const vacationId = req.params.id
   const userData = req.body
  
  try {
   await userService.updateGuest(userData,vacationId)
   const response = await userService.getFamilyMamber(userData.family_id,vacationId)
   res.send(response)
  } catch (error) {
    return next(error);
  }
});

router.get("/details/:id/:familyId/:isIngroup/:vacationId", async (req, res, next) => {
  const id = req.params.id
  const familyId= req.params.familyId
  const vacationId= req.params.vacationId
  const isIngroup = req.params.isIngroup
  try {
   const response = await userService.getUserDetails(id,familyId,isIngroup,vacationId)
   res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.delete("/:id/:vacationId", async (req, res, next) => {

  const userId = req.params.id
  const vacationId = req.params.vacationId

  try {
   await userService.deleteGuest(userId,vacationId)
   const response = await staticService.getAllGuests(vacationId)
   res.send(response)
  } catch (error) {
    return next(error);
  }
});







module.exports = router;
