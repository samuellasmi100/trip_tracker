const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require('multer')

const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vacationId = req.params.vacationId;
    const vacationFolderPath = path.join(uploadsFolder, vacationId);

    if (!fs.existsSync(vacationFolderPath)) {
      fs.mkdirSync(vacationFolderPath, { recursive: true });
    }
    const folderName = file.originalname.split('_')[0];

    const folderPath = path.join(vacationFolderPath, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/:vacationId", upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    res.status(200).json({
      message: 'File uploaded successfully!',
      file: req.file,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/files/:clientName/:vacationId', (req, res) => {
  const { clientName, vacationId } = req.params;
  const vacationFolderPath = path.join(uploadsFolder,vacationId, clientName);

  
  if (!fs.existsSync(vacationFolderPath)) {
    return res.status(404).json({ message: 'Vacation folder not found.' });
  }

  try {
    const files = fs.readdirSync(vacationFolderPath);

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found in the folder.' });
    }
    res.status(200).json({
      message: 'Files retrieved successfully!',
      files: files,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve files.' });
  }
});



module.exports = router;
