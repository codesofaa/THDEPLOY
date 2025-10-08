import React from 'react';
import Chatbot from './Chatbot'; // Ensure the path is correct
import './ChatbotModal.css'; // Include a CSS file for styling

const ChatbotModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="chatbotmodal-overlay">
      <div className="chatbotmodal-content">
      <button className="chatbotmodal-close" onClick={onClose}>_</button>
        <h2>Chatbot</h2>
        
        <Chatbot />
      </div>
    </div>
  );
};

export default ChatbotModal;
