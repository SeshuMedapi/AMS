// import React, { useEffect, useState } from 'react';
// import '../styles/Auth.css'; // Assuming styles are shared here

// const Dashboard = () => {
//   const [permissions, setPermissions] = useState([]);

//   useEffect(() => {
//     const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
//     setPermissions(storedPermissions);
//   }, []);

//   const hasPermission = (permission) => {
//     return permissions.includes(permission);
//   };

//   return (
//     <div className="dashboard-container">
//       <h2>Dashboard</h2>
      
//       {/* Example: HR-specific section */}
//       {hasPermission('view_users') && (
//         <div className="hr-section">
//           <h3>HR Features</h3>
//           <ul>
//             {hasPermission('create_user') && <li>Create User</li>}
//             {hasPermission('edit_user') && <li>Edit User</li>}
//             {hasPermission('activate_user') && <li>Activate User</li>}
//             {hasPermission('view_users') && <li>View Users</li>}
//           </ul>
//         </div>
//       )}

//       {/* Common section */}
//       <div className="common-section">
//         <h3>Common Features</h3>
//         <p>All users can see this section.</p>
//       </div>
      
//       {/* Example: Employee-only section */}
//       {!hasPermission('view_users') && (
//         <div className="employee-section">
//           <h3>Employee Features</h3>
//           <p>This section is for employees only.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// // Updated Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/Auth.css';

// const Dashboard = () => {
//     const [permissions, setPermissions] = useState([]);
//     const [role, setRole] = useState('');

//     useEffect(() => {
//         const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
//         const storedUser = JSON.parse(localStorage.getItem('user')) || {};
//         setPermissions(storedPermissions);
//         setRole(storedUser.role || ''); // Assuming the user object contains a role
//     }, []);

//     const hasPermission = (permission) => {
//         return permissions.includes(permission);
//     };

//     return (
//         <div className="dashboard-container">
//             <h2>Dashboard</h2>

//             <div className="dashboard-content">
//                 <div className="sidebar">
//                     <h3>Navigation</h3>
//                     <ul>
//                         <li><a href="#hr-section">HR Features</a></li>
//                         <li><a href="#common-section">Common Features</a></li>
//                         <li><a href="#employee-section">Employee Features</a></li>
//                         <li><a href="#admin-section">Admin Features</a></li>
//                     </ul>
//                 </div>

//                 <div className="main-content">
//                     {hasPermission('view_users') && (
//                         <div className="hr-section" id="hr-section">
//                             <h3>HR Features</h3>
//                             <ul>
//                                 {hasPermission('create_user') && <li><Link to="/create-user">Create User</Link></li>}
//                                 {hasPermission('edit_user') && <li>Edit User</li>}
//                                 {hasPermission('activate_user') && <li>Activate User</li>}
//                                 {hasPermission('view_users') && <li>View Users</li>}
//                             </ul>
//                         </div>
//                     )}

//                     <div className="common-section" id="common-section">
//                         <h3>Common Features</h3>
//                         <p>All users can see this section.</p>
//                         <p>Welcome, {role || 'User'}! You have the following permissions:</p>
//                         <ul>
//                             {permissions.map((perm) => (
//                                 <li key={perm}>{perm}</li>
//                             ))}
//                         </ul>
//                     </div>

//                     {!hasPermission('view_users') && (
//                         <div className="employee-section" id="employee-section">
//                             <h3>Employee Features</h3>
//                             <p>This section is for employees only.</p>
//                         </div>
//                     )}

//                     {hasPermission('admin_dashboard') && (
//                         <div className="admin-section" id="admin-section">
//                             <h3>Admin Features</h3>
//                             <ul>
//                                 <li><Link to="/create-user">Create User</Link></li>
//                                 <li>Manage Settings</li>
//                                 <li>View Reports</li>
//                                 <li>Admin Logs</li>
//                             </ul>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import CreateUser from './CreateUser'; // Import the CreateUser component
import '../styles/Auth.css'; // Ensure styles are correctly imported

const Dashboard = () => {
    const [permissions, setPermissions] = useState([]); // Permissions state
    const [users, setUsers] = useState([]); // Users state
    const [roles, setRoles] = useState([]); // State to store roles
    const [showCreateUserModal, setShowCreateUserModal] = useState(false); // State to control the modal visibility

    useEffect(() => {
        const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
        setPermissions(storedPermissions);

        // Fetch users and roles from the backend
        fetchUsers();
        fetchRoles();
    }, []);

    // Fetch users from the backend with token
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
            const response = await axios.get('http://localhost:8000/api/user?user_id=3', {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setUsers(response.data.users); // Assuming the API returns a list of users
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Fetch roles from the backend
    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
            const response = await axios.get('http://localhost:8000/api/role/10', {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setRoles(response.data.roles); // Assuming the API returns a list of roles
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Check if the user has a specific permission
    const hasPermission = (permission) => {
        return permissions.includes(permission);
    };

    // Handle user creation
    const handleUserCreated = (newUser) => {
        setUsers(prevUsers => [...prevUsers, newUser]); // Update the user list with the newly created user
    };

    return (
        <div className="dashboard-container">
            <h2>Admin Dashboard</h2>

            {/* Check if the user has permission to view users */}
            {hasPermission('view_users') && (
                <div className="user-section">
                    <h3>Users</h3>
                    {hasPermission('create_user') && (
                        <button onClick={() => setShowCreateUserModal(true)}>
                            Create New User
                        </button>
                    )}

                    <ul>
                        {users.length > 0 ? (
                            users.map(user => (
                                <li key={user.id}>
                                    {user.username}
                                    {/* Add Edit and View icons here if permissions allow */}
                                    {hasPermission('edit_user') && <button>Edit</button>}
                                    <button>View</button>
                                </li>
                            ))
                        ) : (
                            <li>No users found.</li>
                        )}
                    </ul>
                </div>
            )}

            {/* Display the modal for creating a new user */}
            {showCreateUserModal && (
                <CreateUser 
                    onClose={() => setShowCreateUserModal(false)} 
                    onUserCreated={handleUserCreated}
                    roles={roles} // Pass roles to the CreateUser component
                />
            )}

            {/* Common section available to all users */}
            <div className="common-section">
                <h3>Common Features</h3>
                <p>All users can see this section.</p>
            </div>
        </div>
    );
};

export default Dashboard;
