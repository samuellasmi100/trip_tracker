const router = require("express").Router();
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
const familyService = require("./familyService")
const userRoomsService = require("../userRooms/userRoomsService");
const { parseDateLoose } = require("../../utils/dateNormalize");

// Hebrew message used by BOTH PUT /family/:id and PUT /user/:id when a date
// change is attempted while the family still has room_taken rows. The user
// must remove the family from its rooms first.
const ROOM_LOCK_MSG = 'לא ניתן לשנות תאריכים כל עוד המשפחה משובצת לחדרים. יש לבטל את השיבוץ תחילה.';

router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const familyData = req.body.form
  familyData.familyId = req.body.newFamilyId
  familyData.familyName = familyData.family_name || (familyData.hebrew_first_name + " " + familyData.hebrew_last_name)
  // Client form sends arrival_date / departure_date as DD/MM/YYYY (the
  // GuestWizard runs isoToDisplay over date inputs). Convert to ISO before
  // storing so newly-created families go in as YYYY-MM-DD. Existing rows are
  // intentionally left in their original format — the assignment endpoint's
  // normalizer handles them at read time. An empty/missing date stores as
  // null (the wizard allows the field to be blank); a *present* date that
  // can't be parsed is rejected outright so we never silently store garbage.
  const hasArrival   = familyData.arrival_date   && String(familyData.arrival_date).trim() !== "";
  const hasDeparture = familyData.departure_date && String(familyData.departure_date).trim() !== "";
  const isoArrival   = hasArrival   ? parseDateLoose(familyData.arrival_date)   : null;
  const isoDeparture = hasDeparture ? parseDateLoose(familyData.departure_date) : null;
  if ((hasArrival && !isoArrival) || (hasDeparture && !isoDeparture)) {
    return res.status(400).json({
      error: 'INVALID_DATES',
      message: 'תאריכי שהייה לא תקינים',
    });
  }
  familyData.start_date = isoArrival;
  familyData.end_date = isoDeparture;
  try {
    const response = familyService.addFamily(familyData, vacationId)
    res.send("ההוספה עברה בהצלחה")
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle family request", error));
  }
});

router.put("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const data = req.body
  // FamilyList's edit dialog sends start_date / end_date in DD/MM/YYYY (the
  // dialog runs isoToDisplay over the values). Without normalization, every
  // edit would regress an ISO-stored row back to DD/MM/YYYY in `families`,
  // re-fragmenting storage. Normalize symmetrically with POST: empty
  // becomes null, present-but-unparseable is rejected with 400.
  const hasStart = data.start_date && String(data.start_date).trim() !== "";
  const hasEnd   = data.end_date   && String(data.end_date).trim()   !== "";
  const isoStart = hasStart ? parseDateLoose(data.start_date) : null;
  const isoEnd   = hasEnd   ? parseDateLoose(data.end_date)   : null;
  if ((hasStart && !isoStart) || (hasEnd && !isoEnd)) {
    return res.status(400).json({
      error: 'INVALID_DATES',
      message: 'תאריכי שהייה לא תקינים',
    });
  }
  data.start_date = isoStart;
  data.end_date = isoEnd;

  // Rule: do not let a family's dates be edited while it still has rooms.
  // Probe room_taken; if a current booking exists and its dates differ from
  // what we're about to write, 409 the request. If the new dates match what
  // room_taken already holds, this is a no-op for dates — allow it (the user
  // may just be editing the name / phone / counts).
  try {
    const bookings = await userRoomsService.getBookingDatesForFamily(vacationId, data.family_id);
    if (bookings && bookings.length > 0) {
      const current = bookings[0];
      const dateChange = current.start_date !== isoStart || current.end_date !== isoEnd;
      if (dateChange) {
        return res.status(409).json({
          error: 'HAS_ROOM_ASSIGNMENTS',
          message: ROOM_LOCK_MSG,
        });
      }
    }
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle family request", error));
  }

  try {
    await familyService.updateFamily(data, vacationId)
    res.send("העדכון עבר בהצלחה")
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle family request", error));
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
