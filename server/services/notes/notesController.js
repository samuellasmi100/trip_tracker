const router = require("express").Router();
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
const notesService = require("./notesService")
const uuid = require("uuid").v4;


router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const noteDetails = req.body
  try {
    const response = await notesService.addNotes(noteDetails,vacationId)
    res.send("hello")

  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle notes request", error));
  }
});
;



module.exports = router;
