import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const MyLibraryModal = ({ isOpen, onClose, libraryItems, onDelete, notification }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>My Library</h2>
        {libraryItems.length === 0 ? (
          <p>No items in your library.</p>
        ) : (
          <div className="library-list">
            {libraryItems.map((item, index) => (
              <div key={index} className="library-item">
                <div className="library-item-details">
                  <p className="result-title">{item.title}</p>
                  <p className="result-authors">{item.authors}</p>
                  <p className="result-date">{item.date}</p>
                </div>
                <button className="delete-button" onClick={() => onDelete(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibraryModal;
