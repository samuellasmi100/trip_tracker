const router = require("express").Router();
const familyService = require("./familyService")
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;

router.post("/", async (req, res, next) => {
    const familyName = req.body
    console.log(familyName)
    familyName.family_id = uuid();
    try {
      const response = familyService.addFamily(familyName)
      res.send("ההוספה עברה בהצלחה")
  
    } catch (error) {
      return next(error);
    }
  });
  
  router.get("/", async (req, res, next) => {
    try {
      const response = await familyService.getFamilies()
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });
  
  router.post("/families/upload", async (req, res, next) => {
    const { filename, fileType, data, id } = req.body;
  
  try {
    // if (!filename || !fileType || !data) {
    //   return res.status(400).send("Invalid payload");
    // }
  
    // const registrationFormPath = path.join(__dirname, "..", "..", "registrationForm");
    // try {
    //   fs.mkdirSync(registrationFormPath, { recursive: true });
    // } catch (err) {
    //   if (err.code !== "EEXIST") {
    //     console.error("Error creating directory:", err);
    //     return res.status(500).send("Failed to create directory.");
    //   }
    // }
    // const fileBuffer = Buffer.from(data, "base64");
    // const filePath = path.join(registrationFormPath, filename);
    // fs.writeFile(filePath, fileBuffer, (err) => {
    //   if (err) {
    //     console.error("Error saving file:", err);
    //     return res.status(500).send("Failed to save file.");
    //   }
    //   console.log(`File saved to ${filePath}`);
    // });
    // const response = await familyService.saveRegistrationForm(filename, fileType, filePath, id);
    // res.send("הטופס נשמר בהצלחה")
    // res.status(200).send("File uploaded and saved successfully.")
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