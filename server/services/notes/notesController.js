const router = require("express").Router();
const notesService = require("./notesService")
const uuid = require("uuid").v4;


router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const noteDetails = req.body
  try {
    const response = await notesService.addNotes(noteDetails,vacationId)
    res.send("hello")

  } catch (error) {
    return next(error);
  }
});
;



module.exports = router;
