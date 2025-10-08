const { Router } = require('express');
const router = Router();
const Logs = require('../src/logdb.js'); 

// Endpoint to get all theses
router.get('/api/logs', async (req, res) => {
  try {
    const theses = await Logs.find(); // Filter out deleted theses
    res.json(theses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;