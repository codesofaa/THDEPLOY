const { Router } = require('express');
const router = Router();
const adminCollection = require('../src/admindb'); 
const Admin = require('../src/admindb'); 
const bcrypt = require('bcrypt');

// Endpoint to get all users
router.get('/api/admins', async (req, res) => {
  try {
    const admins = await adminCollection.find(); 
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to update access status
router.post("/api/admins/access", async (req, res) => {
  const { adminId, access } = req.body;

  try {
    const admin = await adminCollection.findByIdAndUpdate(
      adminId,
      { access: access },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Access status updated", admin });
  } catch (error) {
    console.error("Error updating access status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new admin
router.post('/api/admins', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if an admin with the same email already exists
    const existingAdmin = await adminCollection.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin instance
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      access: true // Default access set to true
    });

    // Save the admin to the database
    const savedAdmin = await newAdmin.save();

    res.status(201).json(savedAdmin);
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ error: 'Failed to add admin' });
  }
});
 
// Delete an admin by ID
router.delete('/api/admins/:adminId', async (req, res) => {
  const { adminId } = req.params;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully', deletedAdmin });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
});

// Endpoint to update an admin
router.put('/api/admins/:adminId', async (req, res) => {
  const { adminId } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    // Find the admin by ID and update their details
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, {
      firstName,
      lastName,
      email,
      password: password ? await bcrypt.hash(password, 10) : undefined // Update password if provided
    }, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Failed to update admin' });
  }
});



module.exports = router;
