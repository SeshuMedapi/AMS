// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import EmployeeDashboard from './pages/EmployeeDashboard'; // Import Employee Dashboard
// import HRDashboard from './pages/HRDashboard.jsx'; // Import HR Dashboard

// // Protected route component
// const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
//     const role_id = localStorage.getItem('role_id'); // Retrieve role from localStorage
    
//     // If role_id is in allowedRoles, render the component; otherwise, redirect to login
//     return allowedRoles.includes(parseInt(role_id)) ? <Component {...rest} /> : <Navigate to="/login" />;
// };

// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 {/* Public Routes */}
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
                
//                 {/* Redirect '/' to login if no specific path is given */}
//                 <Route path="/" element={<Navigate to="/login" />} />

//                 {/* Protected Routes for Employee and HR Dashboards */}
//                 <Route 
//                     path="/employee-dashboard" 
//                     element={<PrivateRoute component={EmployeeDashboard} allowedRoles={[1]} />} 
//                 />
//                 <Route 
//                     path="/hr-dashboard" 
//                     element={<PrivateRoute component={HRDashboard} allowedRoles={[2]} />} 
//                 />
//             </Routes>
//         </Router>
//     );
// };

// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard'; // Import the new Dashboard component

// const PrivateRoute = ({ component: Component, ...rest }) => {
//     const token = localStorage.getItem('token'); // Retrieve token from localStorage
    
//     // Check if token exists; if not, redirect to login
//     return token ? <Component {...rest} /> : <Navigate to="/login" />;
// };

// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 {/* Public Routes */}
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
                
//                 {/* Redirect '/' to login if no specific path is given */}
//                 <Route path="/" element={<Navigate to="/login" />} />

//                 {/* Protected Dashboard Route */}
//                 <Route 
//                     path="/dashboard" 
//                     element={<PrivateRoute component={Dashboard} />} 
//                 />
//             </Routes>
//         </Router>
//     );
// };

// export default App;

// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/AdminLogin';
import Register from './pages/AdminRegister';
import Dashboard from './pages/Dashboard';
import CreateUser from './pages/CreateUser'; // Import CreateUser component

// Create a private route for protecting the dashboard
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    return token ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-user" element={
                    <PrivateRoute>
                        <CreateUser />
                    </PrivateRoute>
                } />
                
                {/* Redirect '/' to login if no specific path is given */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Protected Dashboard Route */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
