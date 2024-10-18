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
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";

const CreateUser = ({ onClose, onUserCreated }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'User'
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validation function
    const validateForm = () => {
        let formErrors = {};
        if (!formData.username) formErrors.username = 'Username is required';
        if (!formData.email) formErrors.email = 'Email is required';
        if (!formData.password) formErrors.password = 'Password is required';
        return formErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            try {
                // Call API to create the user
                const response = await axiosInstance.post('/create-user', formData);
                
                setSuccessMessage('User created successfully!');
                onUserCreated(response.data.user); // Notify the parent (Dashboard) that a user was created

                // Close the form after 2 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                    onClose(); // Close the modal
                }, 2000);
            } catch (err) {
                setErrors({ form: 'An error occurred while creating the user' });
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Create New User</h2>
                <form onSubmit={handleSubmit} className="create-user-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <p className="error">{errors.username}</p>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Admin">Admin</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="User">User</option>
                        </select>
                    </div>

                    {errors.form && <p className="error">{errors.form}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}

                    <button type="submit">Create User</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
