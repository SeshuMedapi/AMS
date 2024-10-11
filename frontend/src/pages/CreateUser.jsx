// // CreateUser.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/Auth.css';

// const CreateUser = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('User'); // Default role
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8000/api/register', {
//                 email,
//                 password,
//                 role
//             });
//             console.log(response.data);
//             setSuccessMessage('User created successfully! Redirecting to login...');
//             setTimeout(() => {
//                 navigate('/login'); // Redirect to login page after user creation
//             }, 2000);
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.detail || 'Error creating user');
//         }
//     };

//     return (
//         <div className="auth-container">
//             <h2>Create User</h2>
//             <form onSubmit={handleSubmit}>
//                 <input 
//                     type="email" 
//                     placeholder="Email" 
//                     value={email} 
//                     onChange={(e) => setEmail(e.target.value)} 
//                     required 
//                 />
//                 <input 
//                     type="password" 
//                     placeholder="Password" 
//                     value={password} 
//                     onChange={(e) => setPassword(e.target.value)} 
//                     required 
//                 />
//                 <select value={role} onChange={(e) => setRole(e.target.value)} required>
//                     <option value="User">User</option>
//                     <option value="HR">HR</option>
//                     <option value="Manager">Manager</option>
//                 </select>
//                 <button type="submit">Create User</button>
//                 {error && <p className="error">{error}</p>}
//                 {successMessage && <p className="success">{successMessage}</p>}
//             </form>
//         </div>
//     );
// };

// export default CreateUser;


// CreateUserModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreateUserModal = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');  // default role

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/create_user', {
        email, 
        password, 
        role,
      }, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });

      if (response.status === 201) {
        alert('User created successfully!');
        closeModal();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="modal">
      <h2>Create User</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="Admin">Admin</option>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="User">User</option>
      </select>
      <button onClick={handleCreateUser}>Create</button>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default CreateUserModal;
