// ContactModal.js
import React from 'react';
import './ContactModal.css'; // Assuming you will create a CSS file for styling the modal

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;  // Don't render the modal if it's not open

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal-content">
        <button className="contact-modal-close" onClick={onClose}>X</button>
        <h2>Contact Us</h2>
        <p>Email: <a href="mailto:thesishubit@gmail.com">thesishubit@gmail.com</a></p>
        <p>Mobile Phone: <a href="tel:+639657248827">09657248827</a></p>
      </div>
    </div>
  );
};

export default ContactModal;
