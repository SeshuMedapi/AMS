import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  passwordvalidator,
  Confirm_passwordvalidator,
} from "../../Shared modules/Exception handling/regexValidation";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";

function ChangePswd({ handleCancel, handlesaved }) {
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [oldPasswordValid, setOldPasswordValid] = useState(true);
  const [newPasswordValid, setNewPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const [confirmPasswordMatch, setConfirmPasswordMatch] = useState(true);
  const [overallpassword, setoverallpassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  const handleSubmit = async () => {
    validateNewPassword();
    validateConfirmPassword();
    validateOldPassword();

    if (
      oldPasswordValid &&
      newPasswordValid &&
      confirmPasswordValid &&
      confirmPasswordMatch
    ) {
      try {
        await axiosInstance.put("/myinfo/changepassword", {
          old_password: oldPassword,
          new_password: newPassword,
        });
        console.log("Password changed successfully");
        handlesaved();
        handleCancel();
      } catch (error) {
        setoverallpassword(true);
        console.error("Error changing password:", error);
      }
    }
  };

  const validateNewPassword = () => {
    const isValid = passwordvalidator(newPassword);
    setNewPasswordValid(isValid);
    if (isValid) {
      setConfirmPasswordValid(Confirm_passwordvalidator(confirmPassword));
      setConfirmPasswordMatch(newPassword === confirmPassword);
    } else {
      setConfirmPasswordValid(true);
      setConfirmPasswordMatch(true);
    }
  };

  const validateConfirmPassword = () => {
    const isValid = Confirm_passwordvalidator(confirmPassword);
    setConfirmPasswordValid(isValid);
    setConfirmPasswordMatch(newPassword === confirmPassword);
  };

  const validateOldPassword = () => {
    if (oldPassword.trim() === "") {
      setOldPasswordValid(false);
      return false;
    } else {
      setOldPasswordValid(true);
      return true;
    }
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <h3 className="editprofile ms-4">Change Password </h3>
        <FontAwesomeIcon
          icon={faTimes}
          className="Chng-pwsd-x-icon"
          onClick={handleCancel}
        />
      </div>

      <div className="ms-4">
        <div className="mb-3">
          {/* Old Password */}
          <label htmlFor="oldPassword" className="form-label   fw-bold mt-4">
            Old Password <span className="text-danger">*</span>
          </label>
          <div className="position-relative">
            <input
              type={passwordVisibility.oldPassword ? "text" : "password"}
              className={`form-control form-control-all ${
                !oldPassword && !oldPasswordValid && "is-invalid"
              }`}
              id="oldPassword"
              placeholder="Enter Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={passwordVisibility.oldPassword ? faEye : faEyeSlash}
              className="position-absolute top-50 translate-middle-y chng-psd-eye"
              onClick={() => togglePasswordVisibility("oldPassword")}
            />
          </div>
          {!oldPassword && !oldPasswordValid && (
            <div className="text-danger">Old Password is required</div>
          )}
        </div>
        <div className="mb-3">
          {/* New Password */}
          <label htmlFor="newPassword" className="form-label  fw-bold">
            New Password <span className="text-danger">*</span>
          </label>
          <div className="position-relative">
            <input
              type={passwordVisibility.newPassword ? "text" : "password"}
              className={`form-control form-control-all ${
                !newPassword && !newPasswordValid && "is-invalid"
              }`}
              id="newPassword"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={validateNewPassword}
            />
            <FontAwesomeIcon
              icon={passwordVisibility.newPassword ? faEye : faEyeSlash}
              className="position-absolute top-50 translate-middle-y chng-psd-eye"
              onClick={() => togglePasswordVisibility("newPassword")}
            />
          </div>
          {!newPassword && !newPasswordValid && (
            <div className="text-danger"> New Password is required </div>
          )}
          {!newPasswordValid && newPassword && (
            <div>
              <h5 className="text-secondary mt-2">
                Password must be at least 8 characters
              </h5>
              <p className="text-danger">
                Password must contain the following:numbers,lowercase letters,
                <br></br>
                uppercase letters,or special characters.
              </p>
            </div>
          )}
        </div>
        <div className="mb-3">
          {/* Confirm New Password */}
          <label htmlFor="confirmNewPassword" className="form-label  fw-bold">
            Confirm New Password <span className="text-danger">*</span>
          </label>
          <div className="position-relative">
            <input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              className={`form-control form-control-all ${
                !confirmPassword && !confirmPasswordValid && "is-invalid"
              }`}
              id="confirmNewPassword"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validateConfirmPassword}
            />
            <FontAwesomeIcon
              icon={passwordVisibility.confirmPassword ? faEye : faEyeSlash}
              className="position-absolute top-50 translate-middle-y chng-psd-eye"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            />
          </div>
          {!confirmPassword && !confirmPasswordValid && (
            <div className="text-danger">Confirm New password is required.</div>
          )}

          {!confirmPasswordMatch && (
            <div className="text-danger">Password Mismatch</div>
          )}
          {overallpassword && (
            <div className="text-secondary mt-5">
              Please check the form and correct all errors before submitting.
            </div>
          )}
        </div>

        <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
          <div className="d-flex justify-content-end">
            <button className="profile_btn me-2" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="profile_btn me-2 profile-changePassword-btn2"
              onClick={handleSubmit}
              disabled={
                !oldPasswordValid ||
                !newPasswordValid ||
                !confirmPasswordValid ||
                !confirmPasswordMatch
              }
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePswd;
