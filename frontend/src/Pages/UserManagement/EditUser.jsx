import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Permission from "../../Shared modules/Context management/permissionCheck";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";

function EditUser({ onCancel, onUserUpdated, userData }) {
  const [formData, setFormData] = useState({
    email: userData.email || "",
    group_name: userData.group_name || "User",
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    phone_number: userData.phone_number || "",
    // password: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    }
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const updateData = {
        ...formData,
        ...(formData.password && { password: formData.password }),
      };

      const response = await axiosInstance.put(`users/${userData.id}`, updateData);
      
      if (response.status === 200) {
        toast.success("User updated successfully!");
        onUserUpdated();
        setTimeout(() => {
          onCancel();
        }, 3000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error updating user");
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
        <div className="d-flex align-items-center">
          <h3 className="d-inline ms-4">Edit User</h3>
        </div>
        <div className="me-5">
          <FontAwesomeIcon icon={faTimes} className="addUser-x-icon" onClick={onCancel} />
        </div>
      </div>

      <div className="form-container">
        <form className="p-3">
          <div className="mb-3">
            <label className="form-label fw-bold">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter First Name"
              className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
              value={formData.first_name}
              onChange={handleInputChange}
            />
            {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter Last Name"
              className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
              value={formData.last_name}
              onChange={handleInputChange}
            />
            {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="phone_number"
              placeholder="Enter Phone Number"
              className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
              value={formData.phone_number}
              onChange={handleInputChange}
            />
            {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Role <span className="text-danger">*</span>
            </label>
            <select
              name="group_name"
              className="form-select"
              value={formData.group_name}
              onChange={handleInputChange}
            >
              <option value="Admin">Admin</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
          </div>
{/* 
          <div className="mb-3">
            <label className="form-label fw-bold">
              Password <span className="text-muted">(Leave blank to keep current)</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div> */}
        </form>
      </div>

      <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
        <div className="d-flex justify-content-end">
          <button className="profile_btn me-2 fw-bold" onClick={onCancel}>
            Cancel
          </button>
          <Permission requiredPermission="edit_user" action="hide">
            <button
              className="me-2 fw-bold btnUserUpgdate"
              onClick={handleSave}
              disabled={isLoading || isButtonDisabled}
            >
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Update User"}
            </button>
          </Permission>
        </div>
      </div>
    </div>
  );
}

export default EditUser;