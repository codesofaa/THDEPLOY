const { Router } = require('express');
const router = Router();
const ThesisCollection = require('../src/thesisdb'); 
const RCDCollection = require('../src/rcd');

// Handle delete request
router.delete('/api/thesis/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mark thesis as deleted
    const result = await ThesisCollection.updateOne(
      { _id: id },
      { $set: { deleted: true } }
    );

    if (result.nModified === 0) {
      return res.status(404).send('Thesis not found.');
    }

    // Also handle RCD if needed
    await RCDCollection.deleteOne({ thesisId: id });

    res.send('Thesis marked as deleted.');
  } catch (err) {
    console.error('Error deleting thesis:', err);
    res.status(500).send('Error deleting thesis');
  }
});

module.exports = router;
