// src/Components/Modal.js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// Function to trap focus within the modal
const trapFocus = (e) => {
  if (e.key === 'Tab') {
    const focusableElements = Array.from(
      e.currentTarget.querySelectorAll('button, a, input, textarea, select')
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && e.target === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && e.target === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};

const BlockModal = ({ onLogin, onClose, message, additional_message1, additional_message2 }) => {
  useEffect(() => {
    // Trap focus within modal
    const handleTab = (e) => trapFocus(e);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // No action on overlay click (since the close button is removed)
    }
  };

  return (
    <div
      style={styles.modalOverlay}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div style={styles.modalContent}>
        <h3 id="modal-title">Account Lockout </h3>
        <p>
        {message} 
        </p><br/>
        {additional_message1 && additional_message2 && (
        <ol style={{ textAlign: 'left' }}>
          <li>{additional_message1}</li>
          <li>{additional_message2}</li>
        </ol>
      )}
        <button style={styles.loginButton} onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

BlockModal.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100000, // Ensure modal is above other content
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  },
  loginButton: {
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
  cancelButton: {
    backgroundColor: 'gray',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    marginLeft: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
};

export default BlockModal;
