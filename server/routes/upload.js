const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const ThesisCollection = require('../src/thesisdb');
const RCDCollection = require('../src/rcd');

// Multer Configuration for Disk Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/files')); // Specify the directory to save files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  }
});

const upload = multer({ storage: storage });

// Handle form submission with file upload
router.post('/api/upload', upload.single('thesisPDF'), async (req, res) => {
  try {
    const { titlename, category, program, overview, author, thesisdate } = req.body; // Updated fields based on the UploadForm

    // Ensure all required fields are provided
    if (!titlename || !category || !program || !overview || !author || !thesisdate ||!req.file) {
      return res.status(400).json({ message: 'All fields are required.' }); // Return JSON response
    }

    // Create a new Thesis document
    const newThesis = new ThesisCollection({
      titlename,
      category,
      program, // Added program field
      overview, // Added overview field
      author,
      thesisdate,
      filename: req.file.originalname, // Use the original file name
      filePath: path.join('files', req.file.originalname) // Store the relative file path
    });

    // Save Thesis document to MongoDB
    const savedThesis = await newThesis.save();

    // Create a Record Control Document (RCD) entry
    const newRCD = new RCDCollection({
      thesisId: savedThesis._id,
      uploadDate: new Date()
      // Populate with other required fields if necessary
    });

    // Save RCD document to MongoDB
    await newRCD.save();

    // Send a success response
    res.status(201).json({ message: 'File uploaded and thesis data saved successfully!', thesis: savedThesis }); // Send back the saved thesis
  } catch (err) {
    // Handle error
    console.error('Error handling upload:', err);
    res.status(500).json({ message: 'Error processing upload' }); // Return JSON response
  }
});

module.exports = router;
