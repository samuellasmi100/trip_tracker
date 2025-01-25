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
    const folderName = file.originalname.split('_')[0];
    const folderPath = path.join(uploadsFolder, folderName);
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

router.post("/", upload.single('file'),async (req, res, next) => {

try {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).json({
    message: 'File uploaded successfully!',
    file: req.file
  });

  } catch (error) {
    return next(error);
  }
});

router.get('/files/:clientName', (req, res) => {
  const { clientName } = req.params;
  const clientFolderPath = path.join(uploadsFolder, clientName);

  if (!fs.existsSync(clientFolderPath)) {
    return res.status(404).json({ message: 'Client folder not found.' });
  }

  try {
    const files = fs.readdirSync(clientFolderPath);

    res.status(200).json({
      message: 'Files retrieved successfully!',
      files: files,
    });
  } catch (error) {
    console.error('Error reading client folder:', error);
    res.status(500).json({ message: 'Failed to retrieve files.' });
  }
});


module.exports = router;
