import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  emailvalidator,
  UsPhoneNumberValidator,
  NameValidator,
} from "../../Shared modules/Exception handling/regexValidation";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import Permission from "../../Shared modules/Context management/permissionCheck";

function EditUser({ user, onCancel }) {
  const [clickedSave, setClickedSave] = useState(false);
  const [firstname, setFirstname] = useState(user.first_name);
  const [firstnameError, setFirstnameError] = useState("");
  const [lastname, setLastname] = useState(user.last_name);
  const [lastnameError, setLastnameError] = useState("");
  const [email, setEmail] = useState(user.email);
  const [emailError, setEmailError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [role, setRole] = useState(user.roles[0]?.id || "");
  const [roleError, setRoleError] = useState("");
  const [score, setScore] = useState(user.score);
  const [scoreError, setScoreError] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/role");
        setAvailableRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user.role_id && availableRoles.length > 0) {
      const defaultRole = availableRoles.find(
        (role) => role.id === user.role_id
      );
      setRole(defaultRole?.id || "");
    }
  }, [user.role_id, availableRoles]);

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
    setPhoneNumber(formattedValue);
    if (clickedSave) {
      setPhoneNumberError(validatePhoneNumber(formattedValue));
    }
  };

  const handleFirstNameChange = (value) => {
    setFirstname(value);
    if (clickedSave) {
      setFirstnameError(validateName(value));
    }
  };

  const handleLastNameChange = (value) => {
    setLastname(value);
    if (clickedSave) {
      setLastnameError(validateName(value));
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (clickedSave) {
      setEmailError(validateEmail(value));
    }
  };

  const handleRoleChange = (event) => {
    const selectedRoleId = parseInt(event.target.value);
    setRole(selectedRoleId);
    if (clickedSave) {
      setRoleError(validateRole(selectedRoleId));
    }
  };

  // const handleScoreChange = (value) => {
  //   setScore(value);
  //   if (clickedSave) {
  //     setScoreError(validateScore(value));
  //   }
  // };

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (!NameValidator(name)) return "Invalid Name";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (!emailvalidator(email)) return "Invalid email format";
    return "";
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Phone number is required";
    if (!UsPhoneNumberValidator(phoneNumber)) return "Invalid US phone number";
    return "";
  };

  const validateRole = (roleId) => {
    if (!roleId) return "Role is required";
    return "";
  };

  // const validateScore = (score) => {
  //   if (!score) return "Score is required";
  //   if (isNaN(score) || score < 5 || score > 100) return "Invalid score";
  //   return "";
  // };

  const handleSave = async () => {
    setClickedSave(true);

    const nameError = validateName(firstname);
    const lnameError = validateName(lastname);
    const emailError = validateEmail(email);
    const numberError = validatePhoneNumber(phoneNumber);
    const roleError = validateRole(role);
    // const scoreError = validateScore(score);

    setFirstnameError(nameError);
    setLastnameError(lnameError);
    setEmailError(emailError);
    setPhoneNumberError(numberError);
    setRoleError(roleError);
    // setScoreError(scoreError);

    if (
      !nameError &&
      !lnameError &&
      !emailError &&
      !numberError &&
      !roleError
      // !scoreError
    ) {
      try {
        const response = await axiosInstance.put("/user", {
          id: user.id,
          first_name: firstname,
          last_name: lastname,
          email: email,
          phone_number: phoneNumber,
          role_id: role,
          // score: score,
        });

        switch (response.status) {
          case 200:
            toast.success("User updated successfully!");
            setTimeout(() => {
              onCancel();
            }, 3000);
            break;
          case 201:
            toast.success("User created successfully!");
            setTimeout(() => {
              onCancel();
            }, 3000);
            break;
          case 202:
            toast.info("Request accepted!");
            setTimeout(() => {
              onCancel();
            }, 3000);
            break;
          default:
            toast.info("Successful response!");
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
          setApiError("Error setting up the request");
          toast.error("Error setting up the request");
        }
        console.error("Error saving user:", error);
      }
    }
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <ToastContainer />
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <div className="d-flex align-items-center OIC-Edit-Head">
          <h3 className="d-inline ms-4">Edit Profile</h3>
        </div>
        <div className="me-5">
          <FontAwesomeIcon
            icon={faTimes}
            className="addUser-x-icon"
            onClick={onCancel}
          />
        </div>
      </div>
      <div className="form-container">
        <form className="p-3">
          <div className="mb-2">
            <label htmlFor="firstName" className="form-label fw-bold">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control form-control-all${
                firstnameError ? " is-invalid" : ""
              }`}
              id="firstName"
              value={firstname}
              onChange={(e) => handleFirstNameChange(e.target.value)}
            />
            {firstnameError && (
              <div className="text-danger">{firstnameError}</div>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="lastName" className="form-label fw-bold">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control form-control-all${
                lastnameError ? " is-invalid" : ""
              }`}
              id="lastName"
              value={lastname}
              onChange={(e) => handleLastNameChange(e.target.value)}
            />
            {lastnameError && (
              <div className="text-danger">{lastnameError}</div>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="form-label fw-bold">
              Email address <span className="text-danger">*</span>
            </label>
            <fieldset disabled>
              <input
                type="email"
                className={`form-control form-control-all${
                  emailError ? " is-invalid" : ""
                }`}
                id="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
            </fieldset>
            {emailError && <div className="text-danger">{emailError}</div>}
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className={`form-control form-control-all${
                phoneNumberError ? " is-invalid" : ""
              }`}
              id="editedPhoneNumber"
              value={phoneNumber}
              placeholder="(___) ___-____"
              maxLength="14"
              onChange={handlePhoneChange}
            />
            {phoneNumberError && (
              <div className="text-danger">{phoneNumberError}</div>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="role" className="form-label fw-bold">
              Role <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select form-control form-control-all${
                roleError ? " is-invalid" : ""
              }`}
              id="role"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="">Select</option>
              {availableRoles.map((availableRole) => (
                <option key={availableRole.id} value={availableRole.id}>
                  {availableRole.name}
                </option>
              ))}
            </select>
            {roleError && <div className="text-danger">{roleError}</div>}
          </div>
          {/* <div className="mb-2">
            <label htmlFor="score" className="form-label fw-bold">
              Score <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select form-control form-control-all${
                scoreError ? " is-invalid" : ""
              }`}
              id="score"
              value={score}
              onChange={(e) => handleScoreChange(e.target.value)}
            >
              <option value="">Select</option>
              {[...Array(20).keys()].map((num) => (
                <option key={num} value={(num + 1) * 5}>
                  {(num + 1) * 5}
                </option>
              ))}
            </select>
            {scoreError && <div className="text-danger">{scoreError}</div>}
          </div> */}
          {apiError && (
            <div className="alert alert-danger mt-3">{apiError}</div>
          )}
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
            >
              Update User
            </button>
          </Permission>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
