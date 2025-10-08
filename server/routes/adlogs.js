const { Router } = require('express');
const router = Router();
const adLogs = require('../src/adlogdb.js'); 

// Endpoint to get all theses
router.get('/api/adLogs', async (req, res) => {
  try {
    const theses = await adLogs.find(); 
    res.json(theses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;