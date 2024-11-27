const router = require("express").Router();
const userService = require("./userService")
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;

router.post("/", async (req, res, next) => {
    const userData = req.body
    if(userData.userType === "addParent"){
      userData.is_main_user = true
      userData.user_type = "parent"
    }else {
      userData.is_main_user = false
      userData.user_type = "client"

    }
    userData.user_id = uuid();
    try {
       userService.addGuest(userData)
       const response = await userService.getFamilyMamber(userData.family_id)
       res.send(response)
    } catch (error) {
      return next(error);
    }
});

router.post("/family", async (req, res, next) => {
  const familyName = req.body
  familyName.family_id = uuid();
  try {
    const response = userService.addFamily(familyName)
    res.send("ההוספה עברה בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.get("/families", async (req, res, next) => {
  try {
    const response = await userService.getFamilies()
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
  // const response = await userService.saveRegistrationForm(filename, fileType, filePath, id);
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
   const response = await userService.getUserDetails(id,familyId)
   res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const familyId = req.params.id
  try {
    const response = await userService.getFamilyGuests(familyId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.put("/", async (req, res, next) => {
   const userData = req.body
  try {
   await userService.updateGuest(userData)
   const response = await userService.getFamilyMamber(userData.family_id)
   res.send(response)
  } catch (error) {
    return next(error);
  }
});








module.exports = router;
