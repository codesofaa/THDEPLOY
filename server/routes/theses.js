const { Router } = require("express");
const router = Router();
const ThesisCollection = require("../src/thesisdb");

// for security/authentication and session
const requireLogin = require('../middleware/requireLogin');

// Endpoint to get all theses
router.get("/api/theses", requireLogin, async (req, res) => {
  try {
    const theses = await ThesisCollection.find({ deleted: false }).sort({
      dateuploaded: -1,
    }); // Filter out deleted theses
    res.json(theses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
