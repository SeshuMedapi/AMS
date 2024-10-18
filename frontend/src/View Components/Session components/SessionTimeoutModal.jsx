// src/Components/SessionTimeout.js
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import { setModalCallback } from './SessionController';

const SessionExpiredModal  = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setModalCallback(() => {
      setShowModal(true);
    });
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.classList.remove('blurred'); // Remove blur effect when modal is closed
  };

  const handleLoginClick = () => {
    handleCloseModal();
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <>
      {showModal && ReactDOM.createPortal(
        <Modal
          message="Session has expired. Please log in again."
          onClose={handleCloseModal}
          onLogin={handleLoginClick} // Pass the login handler
        />,
        document.body
      )}
    </>
  );
};

export default SessionExpiredModal ;
