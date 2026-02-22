const router = require("express").Router();
const familyService = require("./familyService")

router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const familyData = req.body.form
  familyData.familyId = req.body.newFamilyId
  familyData.familyName = familyData.family_name || (familyData.hebrew_first_name + " " + familyData.hebrew_last_name)
  familyData.start_date = familyData.arrival_date || null
  familyData.end_date = familyData.departure_date || null
  try {
    const response = familyService.addFamily(familyData, vacationId)
    res.send("ההוספה עברה בהצלחה")
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const data = req.body
  try {
    await familyService.updateFamily(data, vacationId)
    res.send("העדכון עבר בהצלחה")
  } catch (error) {
    return next(error);
  }
});

// Server-side family name search for the room board assignment dialog
// IMPORTANT: must be registered BEFORE /:id to guarantee Express matches it first
router.get("/search/:vacationId", async (req, res, next) => {
  const { vacationId } = req.params;
  const q = req.query.q || "";
  try {
    if (q.trim().length < 1) return res.send([]);
    const response = await familyService.searchFamilies(vacationId, q.trim());
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/stats", async (req, res, next) => {
  try {
    const stats = await familyService.getStats(req.params.id);
    res.send(stats);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const vacationId = req.params.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const search = (req.query.search || '').trim();
    const result = await familyService.getFamilies(vacationId, { page, search });
    res.send(result);
  } catch (error) {
    return next(error);
  }
});

router.get("/details/:id/:familyId", async (req, res, next) => {
  const id = req.params.id
  const familyId = req.params.familyId
  try {
    const response = await familyService.getUserDetails(id, familyId)
    res.send(response)
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
