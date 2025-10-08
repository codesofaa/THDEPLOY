const { Router } = require('express');
const router = Router();
const ThesisCollection = require('../src/thesisdb'); 


router.put('/thesis/recover/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await ThesisCollection.updateOne(
            { _id: id },
            { $set: { deleted: false } }
        );

        if (result.nModified === 0) {
            return res.status(404).send('Thesis not found.');
        }

        res.send('Thesis recovered.');
    } catch (err) {
        console.error('Error recovering thesis:', err);
        res.status(500).send('Error recovering thesis');
    }
});

module.exports = router;
