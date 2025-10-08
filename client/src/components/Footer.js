import React, { useState } from 'react';
import './Footer.css';

// Modal Component
const Modal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{content.title}</h2>
        <p>{content.body}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  const modalContent = {
    about: {
      title: 'About Us',
      body: 'This is where you can provide information about your company or team. You can include details about your mission, vision, and values.'
    },
    privacy: {
      title: 'Privacy Policy',
      body: 'Here you can describe your privacy policy, including how user data is collected, used, and protected.'
    },
    contact: {
      title: 'Contact Us',
      body: 'Provide contact information here, such as email addresses, phone numbers, and other ways to get in touch with you.'
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
        
        </div>
        <div className="footer-links">
          <a href="#" onClick={(e) => { e.preventDefault(); openModal('about'); }}></a>
          <a href="#" onClick={(e) => { e.preventDefault(); openModal('privacy'); }}></a>
          <a href="#" onClick={(e) => { e.preventDefault(); openModal('contact'); }}></a>
        </div>
        <img src="/ccslogo.png" alt="" className="footer-logo" /> 
        <div className="footer-text">

          <p>
            We use cookies to help provide and enhance our service. By continuing you agree to the  
            use of cookies.
          </p>
          <p>Copyright © 2024. All rights reserved.</p>
        </div>
       
      </div>

      <Modal isOpen={activeModal === 'about'} onClose={closeModal} content={modalContent.about} />
      <Modal isOpen={activeModal === 'privacy'} onClose={closeModal} content={modalContent.privacy} />
      <Modal isOpen={activeModal === 'contact'} onClose={closeModal} content={modalContent.contact} />
    </footer>
  );
}

export default Footer;
