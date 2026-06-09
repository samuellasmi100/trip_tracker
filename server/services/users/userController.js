const router = require("express").Router();
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
const userService = require("./userService")
const staticService = require("../static/staticService")


// Bulk-add people to a family by names only (trip info inherited client-side
// from the head). Two path segments, so it never collides with POST "/:id".
// Body: { familyId, people: [{ user_id, <name fields>, ...inheritedTrip }] }.
router.post("/:vacationId/bulk", async (req, res, next) => {
  const vacationId = req.params.vacationId
  const { familyId, people } = req.body
  if (!familyId || !Array.isArray(people) || people.length === 0) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "familyId and people are required" })
  }
  try {
    const created = await userService.addGuestsBulk(familyId, people, vacationId)
    res.send({ created })
  } catch (error) {
    // Adding these people would exceed the family's defined size → 400 with a
    // clear Hebrew message (and the remaining capacity).
    if (error && error.code === userService.EXCEEDS_FAMILY_SIZE) {
      return res.status(400).json({
        error: 'EXCEEDS_FAMILY_SIZE',
        message: `לא ניתן להוסיף יותר מ-${error.remaining} אנשים — חרגת מגודל המשפחה`,
      });
    }
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle bulk user request", error));
  }
});

router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
    const userData = req.body.form
    userData.family_id = req.body.newFamilyId
    // Default-only override: only apply the userType-derived values when the
    // caller hasn't explicitly set them. This lets the new client-side
    // "ראש משפחה" toggle in PersonalDetailsStep be authoritative for is_main_user
    // while preserving backward compat for callers (Excel importers, legacy UI
    // paths) that rely on the userType-based default.
    const isParentType = userData.userType === "addParent" || userData.userType === "addFamily"
    if (userData.is_main_user === undefined) userData.is_main_user = isParentType
    if (userData.user_type === undefined)    userData.user_type    = isParentType ? "parent" : "client"
    userData.user_id = req.body.newUserId
    try {
      const response = await userService.addGuest(userData,vacationId)
   
       res.send(response)
    } catch (error) {
      return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle user request", error));
    }
});

router.get("/:id/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
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
   const response = await userService.getFamilyMember(userData.family_id,vacationId)
   res.send(response)
  } catch (error) {
    // Match the assignment endpoint: bad date input gets a dedicated 400
    // with a Hebrew message so the client can show a precise toast instead
    // of the generic save-failed one.
    if (error && error.code === userService.INVALID_DATES) {
      return res.status(400).json({
        error: 'INVALID_DATES',
        message: 'תאריכי שהייה לא תקינים',
      });
    }
    // 409 when the user tried to change dates while the family is still in
    // room_taken — the client surfaces this as a distinct "remove rooms
    // first" toast instead of a generic save-failed.
    if (error && error.code === userService.HAS_ROOM_ASSIGNMENTS) {
      return res.status(409).json({
        error: 'HAS_ROOM_ASSIGNMENTS',
        message: 'לא ניתן לשנות תאריכים כל עוד המשפחה משובצת לחדרים. יש לבטל את השיבוץ תחילה.',
      });
    }
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle user request", error));
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
      const allGuests = await staticService.getAllGuests(vacationId)
      const mainGuests = await staticService.getMainGuests(vacationId)
      res.send({allGuests,mainGuests})
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle user request", error));
  }
});

router.delete("/main/:id/:vacationId", async (req, res, next) => {
  const familyId = req.params.id
  const vacationId = req.params.vacationId

  try {
      await userService.deleteMainGuest(familyId,vacationId)
      const allGuests = await staticService.getAllGuests(vacationId)
      const mainGuests = await staticService.getMainGuests(vacationId)
      res.send({allGuests,mainGuests})

  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle user request", error));
  }
})


module.exports = router;
