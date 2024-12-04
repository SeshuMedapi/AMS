import React, { useState, useEffect } from "react";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Permission from "../../Shared modules/Context management/permissionCheck";

function AddRole({ onCancel, onUserAdded }) {
  const [roleName, setRoleName] = useState("");
  const [roleNameError, setRoleNameError] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosInstance.get("permission_list");
        const permissionsList = response.data;

        // Deduplicate and sort permissions by name
        const deduplicatedPermissions = permissionsList.reduce((acc, current) => {
          if (!acc.find((item) => item.permission === current.permission)) {
            acc.push(current);
          }
          return acc;
        }, []);
        deduplicatedPermissions.sort((a, b) => a.permission.localeCompare(b.permission));

        setPermissions(deduplicatedPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to load permissions. Please try again later.");
      } finally {
        setIsPermissionsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  // Handle role name input change
  const handleRoleNameChange = (value) => {
    setRoleName(value);
    if (value.trim() === "") {
      setRoleNameError("Role name is required");
    } else {
      setRoleNameError("");
    }
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Handle Save action
  const handleSave = async () => {
    if (roleName.trim() === "") {
      setRoleNameError("Role name is required");
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("At least one permission is required.");
      return;
    }

    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const roleData = {
        role_name: roleName.trim(),
        permissions: selectedPermissions,
      };

      const response = await axiosInstance.post(`newrole/${userId}`, roleData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Role added successfully!");
        onUserAdded();
        setTimeout(() => {
          onCancel();
        }, 3000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
        toast.error(error.response.data.message);
      } else if (error.response) {
        toast.error(`Error: ${error.response.status}`);
      } else {
        toast.error("Error: " + error.message);
      }
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <ToastContainer />
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <div className="d-flex align-items-center OIC-Edit-Head">
          <h3 className="d-inline ms-4">Add New Role</h3>
        </div>
        <div className="me-5">
          <FontAwesomeIcon icon={faTimes} className="addUser-x-icon" onClick={onCancel} />
        </div>
      </div>
      <div className="form-container">
        <form className="p-3">
          <div className="mb-2">
            <label className="form-label fw-bold">
              Role Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Role Name"
              className={`form-control form-control-all ${roleNameError ? "is-invalid" : ""}`}
              value={roleName}
              onChange={(e) => handleRoleNameChange(e.target.value)}
            />
            {roleNameError && <div className="text-danger">{roleNameError}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">
              Permissions <span className="text-danger">*</span>
            </label>
            {isPermissionsLoading ? (
              <div>Loading permissions...</div>
            ) : (
              <div className="permission-list">
                {permissions.map((permission) => (
                  <div key={permission.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`permission-${permission.id}`}
                      value={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                    />
                    <label className="form-check-label" htmlFor={`permission-${permission.id}`}>
                      {permission.permission}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {selectedPermissions.length === 0 && !isPermissionsLoading && (
              <div className="text-danger">At least one permission is required.</div>
            )}
          </div>
        </form>
      </div>
      <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
        <div className="d-flex justify-content-end">
          <button className="profile_btn me-2 fw-bold" onClick={onCancel}>
            Cancel
          </button>
          <Permission requiredPermission="add_role" action="hide">
            <button
              className="me-2 fw-bold btnUserUpgdate"
              onClick={handleSave}
              disabled={isLoading || isButtonDisabled}
            >
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Add Role"}
            </button>
          </Permission>
        </div>
      </div>
    </div>
  );
}

export default AddRole;
