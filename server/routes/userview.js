const mongoose = require('mongoose');
const { Router } = require('express');
const router = Router();
const userCollection = require('../src/userdb'); 

// Endpoint to get all users
router.get('/api/users', async (req, res) => {
  try {
    const users = await userCollection.find(); 
    res.json(users); // Corrected from 'theses' to 'users'
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/api/users/approve', async (req, res) => {
  const { userId, approved } = req.body;
  
  try {
    const user = await userCollection.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.approved = approved;
    await user.save();
    res.status(200).json({ message: 'User approval status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating approval status' });
  }
});

router.get('/api/users/:userId/cor', async (req, res) => {
  const userId = req.params.userId;
  try {
      const user = await userCollection.findById(userId);
      if (user && user.corFile) {
          res.set('Content-Type', user.corFile.contentType);
          res.send(user.corFile.data);
      } else {
          res.status(404).send('COR not found');
      }
  } catch (error) {
      res.status(500).send('Error retrieving COR');
  }
});

// Update user by ID
router.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await userCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

router.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await userCollection.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);  // Detailed error logging
    res.status(500).json({ message: 'Server error deleting user', error: err.message });
  }
});

module.exports = router;
