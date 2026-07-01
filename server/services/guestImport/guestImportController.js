const router = require("express").Router();
const multer = require("multer");
const guestImportService = require("./guestImportService");
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");

// Unlike the registrant import (which POSTs browser-parsed rows), this importer
// needs the raw .xlsx server-side: the boxes are defined by cell borders, which
// the client's SheetJS build can't read. The file is small (~40KB) and parsed
// in memory, then discarded.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/:vacationId", upload.single("file"), async (req, res, next) => {
  const vacationId = req.params.vacationId;
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: "NO_FILE", message: "לא סופק קובץ אקסל" });
  }
  try {
    const report = await guestImportService.importGuests(vacationId, req.file.buffer);
    res.send(report);
  } catch (error) {
    // Another guest import for this vacation is still running (advisory lock not
    // granted in time) — ask the client to retry rather than returning a 500.
    if (error && error.code === "LOCK_TIMEOUT") {
      return res.status(409).json({
        error: "IMPORT_IN_PROGRESS",
        message: "ייבוא אורחים אחר מתבצע כעת עבור חופשה זו. נסה שוב בעוד רגע.",
      });
    }
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to import guests", error));
  }
});

module.exports = router;
