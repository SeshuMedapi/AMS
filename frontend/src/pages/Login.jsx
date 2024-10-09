// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/Auth.css';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/api/login', {
//         username,
//         password
//       });

//       const { role_id, token } = response.data; // Destructure role_id and token from response
      
//       // Save the role and token to localStorage or sessionStorage
//       localStorage.setItem('role_id', role_id);
//       localStorage.setItem('token', token); // Save token if needed

//       // Show success message and redirect after a short delay
//       setSuccessMessage('Login successful! Redirecting...');

//       setTimeout(() => {
//         // Redirect based on the user's role
//         if (role_id === 1) {
//           navigate('/employee-dashboard'); // Redirect to Employee Dashboard
//         } else if (role_id === 2) {
//           navigate('/hr-dashboard'); // Redirect to HR Dashboard
//         }
//       }, 2000);
//     } catch (err) {
//       console.error(err.response);
//       setError(err.response?.data?.detail || 'Invalid credentials');
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="text" 
//           placeholder="Username" 
//           value={username} 
//           onChange={(e) => setUsername(e.target.value)} 
//           required 
//         />
//         <input 
//           type="password" 
//           placeholder="Password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           required 
//         />
//         <button type="submit">Login</button>
//         {error && <p className="error">{error}</p>}
//         {successMessage && <p className="success">{successMessage}</p>}
//       </form>
//       <div className="link">
//         <p>Don't have an account? <Link to="/register">Register here</Link></p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';  // Assuming your CSS is in this file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        username,
        password
      });

      const { token, permissions } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('permissions', JSON.stringify(permissions));

      setSuccessMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
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
        {successMessage && <p className="success">{successMessage}</p>}
      </form>

      {/* Registration link */}
      <div className="link">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;


