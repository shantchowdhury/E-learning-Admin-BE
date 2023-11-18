const express = require('express');
const router = express.Router();
const multer = require('multer');


const upload = multer();
const { uploadMultipleFilesToS3 } = require('../controllers/aws_file_upload.controller');
router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    console.log(req.files); // This will log the received files in the server console
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const uploadedFileURLs = await uploadMultipleFilesToS3(req.files);
    res.status(200).json({ uploadedFileURLs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
