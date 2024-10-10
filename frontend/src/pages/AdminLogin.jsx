import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                username,
                password
            });
            console.log(response.data);
            // Show success message and redirect after a short delay
            setSuccessMessage('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/'); // Redirect to home or dashboard on successful login
            }, 2000);
        } catch (err) {
            console.error(err.response);
            setError(err.response?.data?.detail || 'Invalid credentials');
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>} {/* Success message display */}
            </form>
            <div className="link">
                <p >Don't have an account? <Link to="/admin/register">Register here</Link></p>
            </div>
        </div>
    );
};

export default Login;
