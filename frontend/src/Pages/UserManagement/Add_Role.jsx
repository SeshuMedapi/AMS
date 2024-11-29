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
  const userId = localStorage.getItem("userId");

  // Fetch the list of permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosInstance.get('permission_list');
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setPermissions([]);
      }
    };
    fetchPermissions();
  }, [userId]);

  // Handle role name input change
  const handleRoleNameChange = (value) => {
    setRoleName(value);
    if (value.trim() === "") {
      setRoleNameError("Role name is required");
    } else {
      setRoleNameError("");
    }
  };

  // Handle permissions selection
  const handlePermissionsChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedPermissions(selectedOptions);
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
        permissions: selectedPermissions.map((id) => parseInt(id)), 
      };

      const response = await axiosInstance.post('newrole', roleData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Role added successfully!");
        onUserAdded();
        setTimeout(() => {
          onCancel();
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setApiError("Bad Request");
            toast.error("Bad Request");
            break;
          case 401:
            setApiError("Unauthorized");
            toast.error("Unauthorized");
            break;
          case 403:
            setApiError("Forbidden");
            toast.error("Forbidden");
            break;
          case 404:
            setApiError("Not Found");
            toast.error("Not Found");
            break;
          case 500:
            setApiError("Internal Server Error");
            toast.error("Internal Server Error");
            break;
          default:
            setApiError(`Error: ${error.response.status}`);
            toast.error(`Error: ${error.response.status}`);
        }
      } else if (error.request) {
        setApiError("No response received from server");
        toast.error("No response received from server");
      } else {
        setApiError("Error: " + error.message);
        toast.error("Error: " + error.message);
      }
    }

    setIsLoading(false);
    setIsButtonDisabled(false);
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
            <select
              multiple
              className={`form-control form-control-all`}
              value={selectedPermissions}
              onChange={handlePermissionsChange}
            >
              {permissions && permissions.length > 0 ? (
                permissions.map((permission) => (
                  <option key={permission.id} value={permission.id}>
                    {permission.permission_name}
                  </option>
                ))
              ) : (
                <option value="">No permissions available</option>
              )}
            </select>
            {selectedPermissions.length === 0 && (
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
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                "Add Role"
              )}
            </button>
          </Permission>
        </div>
      </div>
    </div>
  );
}

export default AddRole;
