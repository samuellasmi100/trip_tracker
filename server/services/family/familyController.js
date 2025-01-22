const router = require("express").Router();
const familyService = require("./familyService")
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to save the uploaded file
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    console.log(fileExtension,'fileExtension')
    cb(null, Date.now() + fileExtension); // Renaming file with a timestamp
  }
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single('file'),async (req, res, next) => {

  // const { filename, fileType, data, id } = req.body;
  console.log(req.file,'req.file')

try {
  if (!req.file) {

    return res.status(400).send('No file uploaded.');
  }
  // File uploaded successfully
  res.status(200).json({
    message: 'File uploaded successfully!',
    file: req.file
  });

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

router.post("/:id", async (req, res, next) => {
     const vacationId = req.params.id
    const familyData = req.body.form
    familyData.familyId = req.body.newFamilyId
    familyData.familyName = familyData.hebrew_first_name + " " + familyData.hebrew_last_name
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
  
  router.post("/upload", async (req, res, next) => {
    console.log("gggggggggggggggggggg")
    // const { filename, fileType, data, id } = req.body;
    console.log(req.body)
  
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    // File uploaded successfully
    res.status(200).json({
      message: 'File uploaded successfully!',
      file: req.file
    });
    res.send("thanks")
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