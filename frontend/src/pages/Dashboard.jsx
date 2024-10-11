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
import axios from 'axios';
import '../styles/Auth.css';

const Dashboard = () => {
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Get permissions and users
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const openCreateUserForm = () => {
    
  };

  const handleEditUser = (userId) => {
    // Logic to open edit user form as a modal
  };

  const handleViewUser = (userId) => {
    // Logic to view user details in a modal
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      
      {hasPermission('create_user') && (
        <button className="action-button" onClick={openCreateUserForm}>
          + Create User
        </button>
      )}

      <h3>Users List</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email}
            {hasPermission('view_user') && (
              <button className="action-icon" onClick={() => handleViewUser(user.id)}>
                View
              </button>
            )}
            {hasPermission('edit_user') && (
              <button className="action-icon" onClick={() => handleEditUser(user.id)}>
                Edit
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

