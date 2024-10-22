import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import Permission from "../../Shared modules/Context management/permissionCheck";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User = ({ user, onCancel }) => {
  const [firstname, setFirstname] = useState(user.first_name);
  const [lastname, setLastname] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userActive, setUserActive] = useState(user.is_active);

  useEffect(() => {
    setFirstname(user.first_name);
    setLastname(user.last_name);
    setEmail(user.email);
    setUserActive(user.is_active);
  }, [user]);

  const handleRequest = async (activate) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/user/activate", {
        user_id: user.id,
        activate: activate,
      });

      if (response.status === 200 || response.status === 201) {
        console.log("User action successful:", response.data);
        setUserActive(activate);
        toast.success(
          `User ${activate ? "activated" : "deactivated"} successfully!`
        );
      } else {
        console.error("Unexpected status code:", response.status);
        setError("Failed to perform user action. Please try again later.");
      }
    } catch (error) {
      console.error("Error performing user action:", error);

      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode === 400) {
          setError("Bad request. Please check your input and try again.");
        } else if (statusCode === 401) {
          setError(
            "Unauthorized. You are not authorized to perform this action."
          );
        } else if (statusCode === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError("An error occurred while performing the user action.");
        }
      } else {
        setError("An error occurred while performing the user action.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivation = () => {
    if (userActive) {
      handleRequest(false);
    } else {
      handleRequest(true);
    }
  };

  const handleFirstNameChange = (e) => {
    setFirstname(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <div className="d-flex align-items-center OIC-Edit-Head">
          <h3 className="d-inline ms-4">Active/Deactivate User</h3>
        </div>
        <div className="me-5">
          <FontAwesomeIcon
            icon={faTimes}
            className="User-x-icon me-2"
            onClick={onCancel}
          />
        </div>
      </div>
      <fieldset disabled="true">
        <form className="p-3">
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label fw-bold">
              First Name
            </label>
            <input
              type="text"
              className="form-control form-control-all"
              id="firstName"
              value={firstname}
              onChange={handleFirstNameChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label fw-bold">
              Last Name
            </label>
            <input
              type="text"
              className="form-control form-control-all"
              id="lastName"
              value={lastname}
              onChange={handleLastNameChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Email address
            </label>
            <input
              type="email"
              className="form-control form-control-all"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        </form>
      </fieldset>

      <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
        <div className="d-flex justify-content-end">
          <button className="profile_btn me-2 fw-bold" onClick={onCancel}>
            Cancel
          </button>
          <Permission requiredPermission="activate_user" action="hide">
            <button
              className={`profile_btn me-2 fw-bold btnUser ${
                loading ? "disabled" : ""
              }`}
              onClick={handleToggleActivation}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : userActive
                ? "Deactivate"
                : "Activate"}
            </button>
          </Permission>
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default User;
