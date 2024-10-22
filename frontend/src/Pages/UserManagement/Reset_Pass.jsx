import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPass = ({ onCancel, user }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/user", {
          params: {
            id: user.id,
          },
        });
        setEmail(response.data.email);
        setStatus(response.data.is_active);
        console.log(response.data.is_active);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user]);

  const handleResetPassword = async () => {
    try {
      const response = await axiosInstance.post("/resetpassword/request", {
        email: email,
      });

      switch (response.status) {
        case 200:
          toast.success("Password reset request successful!");
          onCancel();
          break;
        case 201:
          toast.success("User created successfully!");
          onCancel();
          break;
        case 202:
          toast.info("Request accepted!");
          onCancel();
          break;
        default:
          toast.success("Successful response!");
          onCancel();
          break;
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error("Bad Request");
            break;
          case 401:
            toast.error("Unauthorized");
            break;
          case 403:
            toast.error("Forbidden");
            break;
          case 404:
            toast.error("Not Found");
            break;
          case 500:
            toast.error("Internal Server Error");
            break;
          default:
            toast.error(`Error: ${error.response.status}`);
            break;
        }
      } else if (error.request) {
        toast.error("No response received from server");
      } else {
        toast.error("Error setting up the request");
      }
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <div className="d-flex align-items-center OIC-Edit-Head">
          <h3 className="d-inline ms-4">Reset Password</h3>
        </div>
        <div className="me-5">
          <FontAwesomeIcon
            icon={faTimes}
            className="Restpass-x-icon"
            onClick={onCancel}
          />
        </div>
      </div>

      <form className="p-3">
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-bold">
            Email address
          </label>
          <fieldset disabled>
            <input
              type="email"
              className="form-control form-control-all text-muted"
              id="email"
              value={email}
            />
          </fieldset>
        </div>
        {status === false && (
          <div className="text-danger mt-2">
            Please activate the user to reset the password
          </div>
        )}
      </form>
      <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="profile_btn me-2 fw-bold"
            onClick={onCancel}
          >
            Cancel
          </button>
          <fieldset disabled={status === false}>
            <button
              type="button"
              className="me-2 fw-bold btnUserUpgdate"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
