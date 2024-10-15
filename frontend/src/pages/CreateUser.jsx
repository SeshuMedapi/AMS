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

import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is imported

const CreateUser = ({ onClose, onUserCreated, roles }) => {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        role_id: '',
        password: ''
    });

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Submit the form to create a new user
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/user?user_id=9', formData, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            onUserCreated(response.data); // Notify parent component of the new user
            onClose(); // Close the modal after user creation
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <div className="create-user-modal">
            <h3>Create New User</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {/* Role selection dropdown */}
                <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                <button type="submit">Create User</button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CreateUser;
