import React, { useState } from 'react';
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";

const EditUserModal = ({ closeModal, user }) => {
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role); // Assuming role is part of the user object

  const handleEditUser = async () => {
    try {
      const response = await axiosInstance.put(`/users/${user.id}`, {
        email,
        role,
      }, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        alert('User updated successfully!');
        closeModal();  // Close the modal after user is updated
      }
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  return (
    <div className="modal">
      <h2>Edit User</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="Admin">Admin</option>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="User">User</option>
      </select>
      <button onClick={handleEditUser}>Save</button>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default EditUserModal;
