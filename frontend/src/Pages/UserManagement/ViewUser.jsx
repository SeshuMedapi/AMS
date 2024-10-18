import React from 'react';

const ViewUserModal = ({ closeModal, user }) => {
  return (
    <div className="modal">
      <h2>View User Details</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {/* Add more fields here if needed */}
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default ViewUserModal;
