import React, { useEffect, useState } from 'react';
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import CreateUser from './CreateUser'; // Import the CreateUser component

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false); // State to control modal visibility

    useEffect(() => {
        fetchUsers(); // Fetch users when the component mounts
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/user'); // Adjust URL as necessary
            setUsers(response.data.users); // Assuming the API returns an array of users
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleUserCreated = (newUser) => {
        setUsers(prevUsers => [...prevUsers, newUser]); // Update the user list with the newly created user
    };

    const handleEditUser = (user) => {
        // Handle user edit functionality here
        console.log("Edit user:", user);
    };

    return (
        <div className="user-management-container">
            <h3>User Management</h3>
            <button onClick={() => setShowCreateUserModal(true)}>Create New User</button>

            <ul>
                {users.length > 0 ? (
                    users.map(user => (
                        <li key={user.id}>
                            {user.username}
                            <button onClick={() => handleEditUser(user)}>Edit</button>
                            <button>View</button>
                        </li>
                    ))
                ) : (
                    <li>No users found.</li>
                )}
            </ul>

            {/* Display the modal for creating a new user */}
            {showCreateUserModal && (
                <CreateUser 
                    onClose={() => setShowCreateUserModal(false)} 
                    onUserCreated={handleUserCreated} 
                />
            )}
        </div>
    );
};

export default UserManagement;
