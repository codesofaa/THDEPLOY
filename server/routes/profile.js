const { Router } = require('express');
const bcrypt = require('bcrypt');
const multer = require("multer");
const userCollection = require("../src/userdb");
const fs = require('fs');
const path = require('path');

const router = Router();

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware for login authentication
function requireLogin(req, res, next) {
  if (req.session && req.session.email) {
    return next();
  }
  res.status(401).json({ message: "User not authenticated." });
}

// Route: Get user profile data
router.get("/profile", requireLogin, async (req, res) => {
  try {
    const { email } = req.session;
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Combine firstName and lastName to create a full name
    const fullName = `${user.firstName} ${user.lastName}`;
    res.json({ name: fullName, profileIcon: user.profileIcon });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "An error occurred while fetching profile data." });
  }
});

// Route: Get user profile image
router.get('/profile/image', requireLogin, async (req, res) => {
  try {
    const user = await userCollection.findOne({ email: req.session.email });

    if (!user || !user.profileIcon) {
      // Path to the default image
      const defaultImagePath = path.join(__dirname, '../public/img/icons/defaulticon.jpg');
      return res.sendFile(defaultImagePath);
    }

    // Serve the user's profile image
    res.set('Content-Type', user.profileIcon.contentType);
    res.send(user.profileIcon.data);
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ message: "Error fetching profile image." });
  }
});

// Route: Upload profile image
router.post('/profile/image', requireLogin, upload.single('profileIcon'), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const user = await userCollection.findOne({ email: req.session.email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Save the uploaded file data
    user.profileIcon = {
      data: file.buffer, // File as Buffer
      contentType: file.mimetype, // File MIME type
    };

    // Save the user record
    await user.save();
    res.status(200).json({ message: "Profile image uploaded successfully." });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "An error occurred during the upload process." });
  }
});


// Route: Edit user profile (update name, password, and profile icon)
router.post('/profile/edit', requireLogin, upload.single('profileIcon'), async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  const { file } = req;

  try {
    const user = await userCollection.findOne({ email: req.session.email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If currentPassword is provided, validate it
    if (currentPassword) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect current password." });
      }

      // Update password if newPassword is provided
      if (newPassword) {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
      }
    } else if (newPassword) {
      // Prevent setting a new password without providing the current password
      return res.status(400).json({ message: "Current password is required to set a new password." });
    }

    // Update name if provided
    if (name) {
      const [firstName, ...lastNameParts] = name.split(' ');
      user.firstName = firstName;
      user.lastName = lastNameParts.join(' ') || ''; // Handle cases where only the first name is provided
    }

    // Handle profile icon upload
    if (file) {
      user.profileIcon = {
        data: file.buffer, // Save file as Buffer
        contentType: file.mimetype, // Save MIME type (e.g., image/jpeg)
      };
    }

    // Save updated user data to the database
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "An error occurred while updating the profile." });
  }
});

module.exports = router;
