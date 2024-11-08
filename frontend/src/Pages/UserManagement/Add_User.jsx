import React, { useState, useEffect } from "react";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  emailvalidator,
  UsPhoneNumberValidator,
  NameValidator,
} from "../../Shared modules/Exception handling/regexValidation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Permission from "../../Shared modules/Context management/permissionCheck";


const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "United States/Canada" },
  { code: "+44", name: "United Kingdom" },
  { code: "+61", name: "Australia" },
  { code: "+81", name: "Japan" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+39", name: "Italy" },
  { code: "+86", name: "China" },
  { code: "+55", name: "Brazil" },
  { code: "+7", name: "Russia" },
  { code: "+27", name: "South Africa" },
  { code: "+34", name: "Spain" },
  { code: "+82", name: "South Korea" },
  { code: "+31", name: "Netherlands" },
  { code: "+46", name: "Sweden" },
  { code: "+64", name: "New Zealand" },
  { code: "+32", name: "Belgium" },
  // Add more country codes here if needed
];

function AddUser({ onCancel, onUserAdded }) {
  const [clickedSave, setClickedSave] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastname, setLastname] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [mail, setMail] = useState("");
  const [mailError, setEmailError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [roles, setRoles] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [overallpassword, setoverallpassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91"); // Set India as the default country code

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const fetchRoles = async () => {
        try {
          const response = await axiosInstance.get(`/role/${userId}`);
          setRoles(response.data);
        } catch (error) {
          console.error("Error fetching roles:", error);
          setRoles([]);
        }
      };
      fetchRoles();
    }
  }, [userId]);

  const formatPhoneNumber = (input) => {
    const value = input.replace(/\D/g, "");
    let formattedNumber = "";

    switch (selectedCountryCode) {
      case "+91": // India
        if (value.length <= 5) return value;
        return `${value.substring(0, 5)} ${value.substring(5, 10)}`;

      case "+1": // US and Canada
        if (value.length <= 3) return value;
        if (value.length <= 6) return `(${value.substring(0, 3)}) ${value.substring(3)}`;
        return `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;

      case "+44": // UK
          if (value.length <= 4) return value;
          if (value.length <= 7) return `${value.substring(0, 4)} ${value.substring(4)}`;
          return `${value.substring(0, 4)} ${value.substring(4, 7)} ${value.substring(7, 11)}`;
          
      case "+61": // Australia
          if (value.length <= 4) return value;
          if (value.length <= 7) return `${value.substring(0, 4)} ${value.substring(4)}`;
          return `${value.substring(0, 4)} ${value.substring(4, 7)} ${value.substring(7, 10)}`;
          
      
          
      case "+81": // Japan
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)}-${value.substring(3)}`;
          return `${value.substring(0, 3)}-${value.substring(3, 6)}-${value.substring(6, 10)}`;
          
      case "+49": // Germany
          if (value.length <= 4) return value;
          if (value.length <= 7) return `${value.substring(0, 4)} ${value.substring(4)}`;
          return `${value.substring(0, 4)} ${value.substring(4, 7)} ${value.substring(7, 11)}`;
          
      case "+33": // France
          if (value.length <= 2) return value;
          if (value.length <= 4) return `${value.substring(0, 2)} ${value.substring(2)}`;
          return `${value.substring(0, 2)} ${value.substring(2, 4)} ${value.substring(4, 6)} ${value.substring(6, 8)} ${value.substring(8, 10)}`;
          
      case "+39": // Italy
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)} ${value.substring(3)}`;
          return `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 10)}`;
          
      case "+86": // China
          if (value.length <= 3) return value;
          if (value.length <= 7) return `${value.substring(0, 3)} ${value.substring(3)}`;
          return `${value.substring(0, 3)} ${value.substring(3, 7)} ${value.substring(7, 11)}`;
          
      case "+55": // Brazil
          if (value.length <= 2) return value;
          if (value.length <= 6) return `${value.substring(0, 2)} ${value.substring(2)}`;
          return `${value.substring(0, 2)} ${value.substring(2, 7)}-${value.substring(7, 11)}`;
          
      case "+7": // Russia
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)} ${value.substring(3)}`;
          return `${value.substring(0, 3)} ${value.substring(3, 6)}-${value.substring(6, 10)}`;
          
      case "+27": // South Africa
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)} ${value.substring(3)}`;
          return `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 9)}`;
          
      case "+34": // Spain
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)} ${value.substring(3)}`;
          return `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 9)}`;
          
      case "+82": // South Korea
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)}-${value.substring(3)}`;
          return `${value.substring(0, 3)}-${value.substring(3, 6)}-${value.substring(6, 10)}`;
          
      case "+31": // Netherlands
          if (value.length <= 2) return value;
          if (value.length <= 5) return `${value.substring(0, 2)} ${value.substring(2)}`;
          return `${value.substring(0, 2)} ${value.substring(2, 5)} ${value.substring(5, 9)}`;
          
      case "+46": // Sweden
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)} ${value.substring(3)}`;
          return `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 9)}`;
          
      case "+64": // New Zealand
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)} ${value.substring(3)}`;
          return `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 10)}`;
          
      case "+32": // Belgium
          if (value.length <= 3) return value;
          if (value.length <= 6) return `${value.substring(0, 3)} ${value.substring(3)}`;
          return `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 9)}`;
          
      default:
          return value; // Fallback to just digits if country code not matched
  }
  
  };

  const handlePhoneChange = (event) => {
    const inputValue = event.target.value;
    const formattedValue = formatPhoneNumber(inputValue);
    setPhoneNumber(formattedValue);
    if (clickedSave) {
      setPhoneNumberError(validatePhoneNumber(formattedValue));
    }
  };

  const handleCountryCodeChange = (event) => {
    setSelectedCountryCode(event.target.value);
    // Reformat the phone number when changing the country code
    const rawPhoneNumber = phoneNumber.replace(/\D/g, "");
    setPhoneNumber(formatPhoneNumber(rawPhoneNumber));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const numberOnly = phoneNumber.replace(/\D/g, "");
    if (!numberOnly) {
      return "Phone number is required";
    }
    switch (selectedCountryCode) {
      case "+91": // India
        if (numberOnly.length !== 10) return "Invalid Indian phone number";
        break;

        case "+1": // US and Canada
        if (numberOnly.length !== 10) return "Invalid US/Canada phone number";
        break;

    case "+44": // UK
        if (numberOnly.length !== 10) return "Invalid UK phone number";
        break;

    case "+61": // Australia
        if (numberOnly.length !== 9) return "Invalid Australian phone number";
        break;

    case "+91": // India
        if (numberOnly.length !== 10) return "Invalid Indian phone number";
        break;

    case "+81": // Japan
        if (numberOnly.length !== 10) return "Invalid Japanese phone number";
        break;

    case "+49": // Germany
        if (numberOnly.length < 10 || numberOnly.length > 11) return "Invalid German phone number";
        break;

    case "+33": // France
        if (numberOnly.length !== 9) return "Invalid French phone number";
        break;

    case "+39": // Italy
        if (numberOnly.length !== 10) return "Invalid Italian phone number";
        break;

    case "+86": // China
        if (numberOnly.length !== 11) return "Invalid Chinese phone number";
        break;

    case "+55": // Brazil
        if (numberOnly.length !== 11) return "Invalid Brazilian phone number";
        break;

    case "+7": // Russia
        if (numberOnly.length !== 10) return "Invalid Russian phone number";
        break;

    case "+27": // South Africa
        if (numberOnly.length !== 9) return "Invalid South African phone number";
        break;

    case "+34": // Spain
        if (numberOnly.length !== 9) return "Invalid Spanish phone number";
        break;

    case "+82": // South Korea
        if (numberOnly.length !== 10) return "Invalid South Korean phone number";
        break;

    case "+31": // Netherlands
        if (numberOnly.length !== 9) return "Invalid Dutch phone number";
        break;

    case "+46": // Sweden
        if (numberOnly.length !== 9) return "Invalid Swedish phone number";
        break;

    case "+64": // New Zealand
        if (numberOnly.length !== 9) return "Invalid New Zealand phone number";
        break;

    case "+32": // Belgium
        if (numberOnly.length !== 9) return "Invalid Belgian phone number";
        break;

    default:
        return "Unsupported country code";

    }
    return "";
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
      setLastnameError(validateLastName(value));
    }
  };

  const handleEmailChange = (value) => {
    setMail(value);
    if (clickedSave) {
      setEmailError(validateMail(value));
    }
  };

  const handleRoleChange = (value) => {
    setRole(Number(value));
    if (clickedSave) {
      setRoleError(validateRole(value));
    }
  };

  const validateName = (name) => {
    if (!name.trim()) return "First Name is required";
    if (!NameValidator(name)) return "Invalid Name";
    return "";
  };
  
  const validateLastName = (name) => {
    if (!name.trim()) return "Last Name is required";
    if (!NameValidator(name)) return "Invalid Name";
    return "";
  };

  const validateMail = (mail) => {
    if (!mail.trim()) return "Email is required";
    if (!emailvalidator(mail)) return "Invalid email format";
    return "";
  };

  const validateRole = (role) => {
    if (!role) {
      return "Role is required";
    }
    return "";
  };

  const handleSave = async () => {
    setClickedSave(true);
    setIsLoading(true);
    const nameError = validateName(firstname);
    const lnameError = validateLastName(lastname);
    const mailError = validateMail(mail);
    const numberError = validatePhoneNumber(phoneNumber);
    const roleError = validateRole(role);

    setFirstnameError(nameError);
    setLastnameError(lnameError);
    setEmailError(mailError);
    setPhoneNumberError(numberError);
    setRoleError(roleError);

    // Check if there are any validation errors
    const hasValidationErrors =
      nameError || lnameError || mailError || numberError || roleError;

    if (hasValidationErrors) {
      setoverallpassword(true);
      setIsLoading(false);
      return;
    } else {
      setoverallpassword(false);
    }

    setIsButtonDisabled(true);

    try {
      const userData = {
        first_name: firstname.trim(),
        last_name: lastname.trim(),
        email: mail.toLowerCase().trim(),
        phone_number: String(phoneNumber.trim()),
        role_id: role,
      };

      const response = await axiosInstance.post(`/user?user_id=${userId}`, userData);
      onUserAdded();
      switch (response.status) {
        case 200:
        case 201:
          toast.success("User created successfully!", {
            onClose: () => setIsButtonDisabled(false),
          });
          // fetchUserData(); // Ensure this function is defined or implement if needed
          setTimeout(() => {
            onCancel();
          }, 3000);
          break;
        case 202:
          toast.info("Request accepted!", {
            onClose: () => setIsButtonDisabled(false),
          });
          setTimeout(() => {
            onCancel();
          }, 3000);
          break;
        default:
          toast.info("Successful response!", {
            onClose: () => setIsButtonDisabled(false),
          });
          setTimeout(() => {
            onCancel();
          }, 3000);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setApiError("Bad Request");
            toast.error("Bad Request", {
              onClose: () => setIsButtonDisabled(false),
            });
            break;
          case 401:
            setApiError("Unauthorized");
            toast.error("Unauthorized", {
              onClose: () => setIsButtonDisabled(false),
            });
            break;
          case 403:
            setApiError("Forbidden");
            toast.error("Forbidden", {
              onClose: () => setIsButtonDisabled(false),
            });
            break;
          case 404:
            setApiError("Not Found");
            toast.error("Not Found", {
              onClose: () => setIsButtonDisabled(false),
            });
            break;
          case 409:
            setApiError("Email id already exists");
            toast.error("Email id already exists", {
              onClose: () => setIsButtonDisabled(false),
            });
            break;
          case 500:
            setApiError("Internal Server Error");
            toast.error("Internal Server Error", {
              onClose: () => setIsButtonDisabled(false),
            });
            break;
          default:
            setApiError(`Error: ${error.response.status}`);
            toast.error(`Error: ${error.response.status}`, {
              onClose: () => setIsButtonDisabled(false),
            });
        }
      } else if (error.request) {
        setApiError("No response received from server");
        toast.error("No response received from server", {
          onClose: () => setIsButtonDisabled(false),
        });
      } else {
        setApiError("Error: " + error.message);
        toast.error("Error: " + error.message, {
          onClose: () => setIsButtonDisabled(false),
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <ToastContainer />
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <div className="d-flex align-items-center OIC-Edit-Head">
          <h3 className="d-inline ms-4">Add New User</h3>
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
            <label  className="form-label fw-bold">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter First Name"
              className={`form-control form-control-all ${
                firstnameError ? "is-invalid" : ""
              }`}
              value={firstname}
              onChange={(e) => handleFirstNameChange(e.target.value)}
            />
            {firstnameError && (
              <div className="text-danger">{firstnameError}</div>
            )}
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Last Name"
              className={`form-control form-control-all ${
                lastnameError ? "is-invalid" : ""
              }`}
              value={lastname}
              onChange={(e) => handleLastNameChange(e.target.value)}
            />
            {lastnameError && (
              <div className="text-danger">{lastnameError}</div>
            )}
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className={`form-control form-control-all ${
                mailError ? "is-invalid" : ""
              }`}
              value={mail}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {mailError && <div className="text-danger">{mailError}</div>}
          </div>
          <div className="mb-2">
            <label htmlFor="countryCode" className="form-label fw-bold">
              Country Code <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select form-control form-control-all`}
              id="countryCode"
              value={selectedCountryCode}
              onChange={handleCountryCodeChange}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} - {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className={`form-control form-control-all ${
                phoneNumberError ? "is-invalid" : ""
              }`}
              id="editedPhoneNumber"
              value={phoneNumber}
              placeholder="Enter Phone Number"
              maxLength="14"
              onChange={handlePhoneChange}
            />
            {phoneNumberError && (
              <div className="text-danger">{phoneNumberError}</div>
            )}
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              Role <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select form-control form-control-all ${
                roleError ? "is-invalid" : ""
              }`}
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {roleError && <div className="text-danger">{roleError}</div>}
          </div>
        </form>
      </div>
      <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
        <div className="d-flex justify-content-end">
          <button className="profile_btn me-2 fw-bold" onClick={onCancel}>
            Cancel
          </button>
          <Permission requiredPermission="create_user" action="hide">
            <button
              className="me-2 fw-bold btnUserUpgdate"
              onClick={handleSave}
              disabled={isLoading || isButtonDisabled}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                "Add User"
              )}
            </button>
          </Permission>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
