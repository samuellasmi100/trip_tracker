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
    const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, decodedName);
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

router.get('/files/:familyName/:vacationId', (req, res) => {
  const { familyName, vacationId } = req.params;
  const vacationFolderPath = path.join(uploadsFolder,vacationId, familyName);
  
  if (!fs.existsSync(vacationFolderPath)) {
    return res.json({ message: 'Vacation folder not found.' });
  }
  try {
    const files = fs.readdirSync(vacationFolderPath);

    if (files.length === 0) {
   
      return res.json({ message: 'No files found in the folder.' });
    }
    res.status(200).json({
      message: 'Files retrieved successfully!',
      files: files,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve files.' });
  }
});

router.delete('/files/:familyName/:vacationId/:file', (req, res) => {
  const { vacationId, familyName, file } = req.params;
  const filePath = path.join(uploadsFolder, vacationId, familyName, file);

  if (!fs.existsSync(filePath)) {
    return res.json({ message: 'File not found' });
  }

  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete file', error: error.message });
  }
});


module.exports = router;
