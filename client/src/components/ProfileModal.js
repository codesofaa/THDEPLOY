import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null); // State for the selected image
  const [profileIcon, setProfileIcon] = useState(''); // State for profile icon

  const defaultIcon = '/defaultIcon.jpg'; // Default profile icon

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });
        const user = response.data;
        setName(user.name || '');

        // Fetch the profile image
        const imageResponse = await axios.get('http://localhost:5000/profile/image', { 
            responseType: 'blob',
            withCredentials: true 
        });

        // If image data is received, create a URL for it
        if (imageResponse.status === 200 && imageResponse.data.size > 0) {
            const imageUrl = URL.createObjectURL(imageResponse.data);
            setProfileIcon(imageUrl);
        } else {
            setProfileIcon(defaultIcon); // Use the default icon
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to load user data. Please try again.");
    }
};


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileIcon(reader.result); // Set the new image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== reEnterPassword) {
      setMessage("New passwords do not match!");
      return;
    }

    try {
      const data = { name, currentPassword, newPassword };

      const formData = new FormData();
      formData.append("name", name);
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      if (imageFile) {
        formData.append("profileIcon", imageFile); // Append the image file
      }

      await axios.post('http://localhost:5000/profile/edit', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage("Profile updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setReEnterPassword('');
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please check the current password.");
    }
  };

  const handleImageUpload = async () => {
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("profileIcon", imageFile); // Append the image file
        const response = await axios.post('http://localhost:5000/profile/image', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
  
        setMessage("Profile icon updated successfully!");
        setImageFile(null); // Clear the file after upload
      } else {
        setMessage("No image selected.");
      }
    } catch (error) {
      console.error("Error uploading profile icon:", error);
      setMessage("Failed to update profile icon.");
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-content">
        <h2 className="profile-modal-title">Profile</h2>
        <form onSubmit={handleSubmit} className="profile-modal-form">
          <div className="profile-modal-form-group">
            <label htmlFor="profile-icon-input" className="profile-modal-label">Profile Icon:</label>
            <div className="profile-modal-icon-container">
              <img 
                src={profileIcon} 
                alt="Profile Icon" 
                className="profile-modal-icon-preview" 
                onClick={() => document.getElementById('profile-icon-input').click()} 
              />
              <input 
                type="file" 
                id="profile-icon-input" 
                className="profile-modal-file-input" 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>
          </div>
          
          <div className="profile-modal-form-group">
            <label htmlFor="name" className="profile-modal-label">Name:</label>
            <p id="name" className="profile-modal-name">{name}</p> {/* Display the fetched name */}
          </div>
          <div className="profile-modal-form-group">
            <label htmlFor="current-password" className="profile-modal-label">Current Password:</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="profile-modal-input"
            />
          </div>
          <div className="profile-modal-form-group">
            <label htmlFor="new-password" className="profile-modal-label">New Password:</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="profile-modal-input"
            />
          </div>
          <div className="profile-modal-form-group">
            <label htmlFor="re-enter-password" className="profile-modal-label">Re-enter New Password:</label>
            <input
              type="password"
              id="re-enter-password"
              value={reEnterPassword}
              onChange={(e) => setReEnterPassword(e.target.value)}
              className="profile-modal-input"
            />
          </div>
          <div className="profile-modal-button-container">
          <button type="submit" className="profile-modal-save-button">Save Changes</button> 
          <button type="button" className="profile-modal-close-button" onClick={onClose}>Close</button>
          </div>
        </form>
        {message && <p className="profile-modal-message">{message}</p>}
      </div>
    </div>
  );
};

export default ProfileModal;
