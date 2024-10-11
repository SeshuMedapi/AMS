// //AdminRegistration
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/Auth.css';

// const Register = () => {
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [roles, setRoles] = useState([]);
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [username, setUsername] = useState(''); // New username state
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [selectedRoleId, setSelectedRoleId] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchRoles = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/role/?role=Admin');
//                 setRoles(response.data);
//             } catch (error) {
//                 console.error('Error fetching roles:', error);
//             }
//         };
//         fetchRoles();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (password !== confirmPassword) {
//             setError("Passwords do not match");
//             return;
//         }

//         const registrationData = {
//             username, // Add username to registration data
//             email,
//             first_name: firstName,
//             last_name: lastName,
//             phone_number: phoneNumber,
//             role_id: selectedRoleId,
//             password
//         };

//         try {
//             console.log("Registration Data: ", registrationData);

//             const response = await axios.post('http://localhost:8000/api/user', registrationData, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log("Registration Response: ", response.data);
//             navigate('/login');
//         } catch (err) {
//             console.error('Registration error:', err.response);
//             setError(err.response?.data?.detail || 'Registration failed');
//         }
//     };

//     return (
//         <div className="container">
//             <h2>Admin</h2>
//             <form onSubmit={handleSubmit}>
//                 <input 
//                     type="text" 
//                     placeholder="Company Name" 
//                     value={firstName} 
//                     onChange={(e) => setFirstName(e.target.value)} 
//                     required 
//                 />
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
//                 <input 
//                     type="password" 
//                     placeholder="Confirm Password" 
//                     value={confirmPassword} 
//                     onChange={(e) => setConfirmPassword(e.target.value)} 
//                     required 
//                 />
//                 <button type="submit">Register</button>
//                 {error && <p className="error">{error}</p>}
//             </form>
//             <div className="link">
//                 <p>Already have an account? <Link to="/login">Login here</Link></p>
//             </div>
//         </div>
//     );
// };

// export default Register;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Register = () => {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const registrationData = {
            company : companyName,
            email,
            password
        };

        try {
            console.log("Registration Data: ", registrationData);

            const response = await axios.post('http://localhost:8000/api/admin', registrationData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Registration Response: ", response.data);
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err.response);
            setError(err.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="container">
            <h2>Admin Registration</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Company Name" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Register</button>
                {error && <p className="error">{error}</p>}
            </form>
            <div className="link">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
};

export default Register;
