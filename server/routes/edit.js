const { Router } = require('express');
const router = Router();
const ThesisCollection = require('../src/thesisdb'); 
const multer = require('multer'); // Make sure multer is installed

// Set up Multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for in-memory file handling
const upload = multer({ storage });


// Handle edit request
router.put('/api/thesis/:id', upload.single('file'), async (req, res) => {
  try {
    const { titlename, category, program, overview, author, thesisdate } = req.body;

    // Create an update object with the new values
    const updateFields = {
      titlename,
      category,
      program,
      overview,
      author,
      thesisdate
    };

    // If a file is uploaded, include its filename in the update
    if (req.file) {
      updateFields.filename = req.file.originalname; // or handle the file buffer as needed
    }

    const updatedThesis = await ThesisCollection.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedThesis) return res.status(404).json({ message: 'Thesis not found' });
    
    res.json(updatedThesis);
  } catch (err) {
    console.error('Error updating thesis:', err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
