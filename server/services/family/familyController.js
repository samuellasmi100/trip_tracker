const router = require("express").Router();
const familyService = require("./familyService")



router.post("/:id", async (req, res, next) => {
    const vacationId = req.params.id
    const familyData = req.body.form
    familyData.familyId = req.body.newFamilyId
    familyData.familyName = familyData.family_name || (familyData.hebrew_first_name + " " + familyData.hebrew_last_name)
    try {
      const response = familyService.addFamily(familyData,vacationId)
      res.send("ההוספה עברה בהצלחה")
  
    } catch (error) {
      return next(error);
    }
  });

router.get("/:id", async (req, res, next) => {
    try {
      const vacationId = req.params.id
      const response = await familyService.getFamilies(vacationId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });
  

  router.get("/details/:id/:familyId", async (req, res, next) => {
    const id = req.params.id
    const familyId= req.params.familyId
  
    try {
     const response = await familyService.getUserDetails(id,familyId)

     res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });

  module.exports = router;