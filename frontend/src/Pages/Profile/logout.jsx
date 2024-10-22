import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import redlogout from "../../assets/Profile/logout image.svg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";

function LogoutProfile({ handleCancel }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/logout");
      localStorage.setItem('logout', 'true');
      console.log("Logout successful:", response.data);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <h4 className="ms-4">Logout</h4>
        <FontAwesomeIcon
          icon={faTimes}
          className="logout-x-icon"
          onClick={handleCancel}
        />
      </div>

      <div className="logout-mid-container">
        <div className="row justify-content-center align-items-center LogoutContentSpace">
          <div className="col-12 text-center">
            <img className="logout-red-img" src={redlogout} alt="Image" />
          </div>
          <div className="col-12 ">
            <p className="logpara">
              Are you sure you want to
              <br />
              logout of this account?
            </p>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="col-12 text-center">
            <button className="profile_btn me-2" onClick={handleCancel}>
              No
            </button>
            <button
              className="profile_btn"
              disabled={isLoading}
              onClick={handleLogout}
            >
              {isLoading ? "Yes" : "Yes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutProfile;
