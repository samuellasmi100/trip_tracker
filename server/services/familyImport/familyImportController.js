const router = require("express").Router();
const familyImportService = require("./familyImportService");
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");

// Excel family import. The client parses the workbook in the browser (same as
// the leads import) and POSTs the raw cell rows; this endpoint applies all the
// business rules server-side (week/exception date resolution, room assignment,
// dedup, backdated created_at) and returns a structured report for the UI.
router.post("/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId;
  const rows = req.body.rows;
  if (!Array.isArray(rows)) {
    return res.status(400).json({ error: "INVALID_PAYLOAD", message: "rows must be an array" });
  }
  try {
    const report = await familyImportService.importFamilies(vacationId, rows);
    res.send(report);
  } catch (error) {
    // Another import for this vacation is still running (advisory lock not
    // granted within the timeout). Tell the client to retry shortly rather than
    // surfacing a generic 500.
    if (error && error.code === "LOCK_TIMEOUT") {
      return res.status(409).json({
        error: "IMPORT_IN_PROGRESS",
        message: "ייבוא אחר מתבצע כעת עבור חופשה זו. נסה שוב בעוד רגע.",
      });
    }
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to import families", error));
  }
});

module.exports = router;
