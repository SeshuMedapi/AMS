import React, { useEffect, useState } from 'react';
import '../styles/Auth.css'; // Assuming styles are shared here

const Dashboard = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      
      {/* Example: HR-specific section */}
      {hasPermission('view_users') && (
        <div className="hr-section">
          <h3>HR Features</h3>
          <ul>
            {hasPermission('create_user') && <li>Create User</li>}
            {hasPermission('edit_user') && <li>Edit User</li>}
            {hasPermission('activate_user') && <li>Activate User</li>}
            {hasPermission('view_users') && <li>View Users</li>}
          </ul>
        </div>
      )}

      {/* Common section */}
      <div className="common-section">
        <h3>Common Features</h3>
        <p>All users can see this section.</p>
      </div>
      
      {/* Example: Employee-only section */}
      {!hasPermission('view_users') && (
        <div className="employee-section">
          <h3>Employee Features</h3>
          <p>This section is for employees only.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
