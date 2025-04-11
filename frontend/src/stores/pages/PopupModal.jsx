import React from 'react';
import './PopupModal.css';

const PopupModal = ({ message, type, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className={`popup-modal ${type}`}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default PopupModal;
