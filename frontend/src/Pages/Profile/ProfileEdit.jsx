import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  emailvalidator,
  UsPhoneNumberValidator,
  NameValidator,
} from "../../Shared modules/Exception handling/regexValidation";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";

function ProfileEdit({ user, handleCancel, handSave }) {
  const [editMode, setEditMode] = useState(false);
  const [clickedSave, setClickedSave] = useState(false);
  const [editedName, setEditedName] = useState(user.first_name);
  const [editedLastName, setEditedLastName] = useState(user.last_name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(user.phone_number);
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [overallpassword, setoverallpassword] = useState(true);

  const formatPhoneNumber = (input) => {
    const value = input.replace(/\D/g, "");
    if (value.length <= 3) return value;
    if (value.length <= 6)
      return `(${value.substring(0, 3)}) ${value.substring(3)}`;
    return `(${value.substring(0, 3)}) ${value.substring(
      3,
      6
    )}-${value.substring(6, 10)}`;
  };

  const handlePhoneChange = (event) => {
    const inputValue = event.target.value;
    const formattedValue = formatPhoneNumber(inputValue);
    setEditedPhoneNumber(formattedValue);
  };

  useEffect(() => {
    if (clickedSave) {
      setNameError(validateName());
      setLastNameError(validateLastName());
      setEmailError(validateEmail());
      setPhoneNumberError(validatePhoneNumber());
    }
  }, [editedName, editedLastName, editedEmail, editedPhoneNumber, clickedSave]);

  const handleNameChange = (value) => {
    setEditedName(value);
    if (clickedSave) {
      setNameError(validateName());
    }
  };

  const handleLastNameChange = (value) => {
    setEditedLastName(value);
    if (clickedSave) {
      setLastNameError(validateLastName());
    }
  };

  const handleEmailChange = (value) => {
    setEditedEmail(value);
    if (clickedSave) {
      setEmailError(validateEmail());
    }
  };

  const validateName = () => {
    if (!editedName.trim()) {
      return "First Name is required";
    } else if (!NameValidator(editedName)) {
      return "Invalid Name";
    }
    return "";
  };

  const validateLastName = () => {
    if (!editedLastName.trim()) {
      return "Last Name is required";
    } else if (!NameValidator(editedLastName)) {
      return "Invalid Last Name";
    }
    return "";
  };

  const validateEmail = () => {
    if (!editedEmail.trim()) {
      return "Please enter a  valid email";
    } else if (!emailvalidator(editedEmail)) {
      return "Invalid Email";
    }
    return "";
  };

 
  const validatePhoneNumber = () => {
    if (editedPhoneNumber && !UsPhoneNumberValidator(editedPhoneNumber)) {
      return "Phone Number does not match the mask";
    }
    return "";
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put("myinfo", {
        first_name: editedName,
        last_name: editedLastName,
        phone_number: editedPhoneNumber,
      });

      if (response.status === 200) {
        handSave({
          first_name: editedName,
          last_name: editedLastName,
          phone_number: editedPhoneNumber,
          email: editedEmail,
        });
        setEditMode(false);

        handleCancel();
      } else {
        setoverallpassword(true);
      }
    } catch (error) {
      setoverallpassword(false);
      console.error("Error updating profile:", error);
      //alert("Failed to update profile. Please try again.");
    }
  };

  const handleSave = () => {
    setClickedSave(true);

    const nameError = validateName();
    const lastNameError = validateLastName();
    const emailError = validateEmail();
    const phoneNumberError = validatePhoneNumber();

    if (!nameError && !lastNameError && !emailError && !phoneNumberError) {
      handleSaveChanges();
    } else {
      setoverallpassword(false);

      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <h3 className="editprofile ms-4">Edit Profile</h3>
        <FontAwesomeIcon
          icon={faTimes}
          className="profilr-edit-x-icon"
          onClick={handleCancel}
        />
      </div>
      <div className="ms-4">
        <div className="mb-2">
          <label htmlFor="editedName" className="form-label fw-bold mt-2">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control form-control-all${
              nameError ? " is-invalid" : ""
            }`}
            id="editedName"
            value={editedName}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {clickedSave && nameError && (
            <div className="text-danger">{nameError}</div>
          )}
        </div>
        <div className="mb-2">
          <label htmlFor="editedLastName" className="form-label fw-bold">
            Last Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control form-control-all${
              lastNameError ? " is-invalid" : ""
            }`}
            id="editedLastName"
            value={editedLastName}
            onChange={(e) => handleLastNameChange(e.target.value)}
          />
          {clickedSave && lastNameError && (
            <div className="text-danger">{lastNameError}</div>
          )}
        </div>
        <fieldset disabled>
          <div className="mb-2">
            <label htmlFor="editedEmail" className="form-label fw-bold">
              Email ID <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control form-control-all${
                emailError ? " is-invalid" : ""
              }`}
              id="editedEmail"
              value={editedEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {clickedSave && emailError && (
              <div className="text-danger">{emailError}</div>
            )}
          </div>
        </fieldset>
        <div className="mb-2">
          <label htmlFor="editedPhoneNumber" className="form-label fw-bold">
            Phone Number
          </label>
          <input
            type="tel"
            className={`form-control form-control-all${
              phoneNumberError ? " is-invalid" : ""
            }`}
            id="editedPhoneNumber"
            value={editedPhoneNumber}
            placeholder="(___) ___ -____"
            onChange={handlePhoneChange}
            maxLength="14"
          />

          {clickedSave && phoneNumberError && (
            <div className="text-danger">{phoneNumberError}</div>
          )}
          {!overallpassword && (
            <div className="text-secondary mt-4">
              Please check the form and correct all errors before submitting.
            </div>
          )}
        </div>
        <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
          <div className="d-flex justify-content-end">
            <button className="profile_btn me-2" onClick={handleCancel}>
              Cancel
            </button>
            <button className="profile_btn me-2" onClick={handleSave}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;
