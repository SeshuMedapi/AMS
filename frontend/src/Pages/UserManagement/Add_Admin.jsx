import React, { useState, useEffect } from "react";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { emailvalidator, NameValidator } from "../../Shared modules/Exception handling/regexValidation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Permission from "../../Shared modules/Context management/permissionCheck";

function AddAdmin({ onCancel, onUserAdded }) {
  const [clickedSave, setClickedSave] = useState(false);
  const [company, setCompany] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [mail, setMail] = useState("");
  const [mailError, setMailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const validateName = (name) => {
    if (!name.trim()) return "Company Name is required";
    if (!NameValidator(name)) return "Invalid Name";
    return "";
  };

  const validateMail = (mail) => {
    if (!mail.trim()) return "Email is required";
    if (!emailvalidator(mail)) return "Invalid email format";
    return "";
  };

  const handleCompanyChange = (value) => {
    setCompany(value);
    if (clickedSave) {
      setCompanyError(validateName(value));
    }
  };

  const handleEmailChange = (value) => {
    setMail(value);
    if (clickedSave) {
      setMailError(validateMail(value));
    }
  };

  const handleSave = async () => {
    setClickedSave(true);
    setIsLoading(true);
    const companyError = validateName(company);
    const mailError = validateMail(mail);

    setCompanyError(companyError);
    setMailError(mailError);
    setIsButtonDisabled(true);

    if (companyError || mailError) {
      setIsButtonDisabled(false);
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        company: company.trim(),
        email: mail.toLowerCase().trim(),
      };

      const response = await axiosInstance.post("/admin", userData);
      onUserAdded();

      switch (response.status) {
        case 200:
        case 201:
          toast.success("Company registered successfully!", {
            onClose: () => setIsButtonDisabled(false),
          });
          setTimeout(() => onCancel(), 3000);
          break;
        case 202:
          toast.info("Request accepted!", {
            onClose: () => setIsButtonDisabled(false),
          });
          setTimeout(() => onCancel(), 3000);
          break;
        default:
          toast.info("Successful response!", {
            onClose: () => setIsButtonDisabled(false),
          });
          setTimeout(() => onCancel(), 3000);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error) => {
    if (error.response) {
      const statusCode = error.response.status;
      let errorMessage = "An error occurred";

      switch (statusCode) {
        case 400:
          errorMessage = "Bad Request";
          break;
        case 401:
          errorMessage = "Unauthorized";
          break;
        case 403:
          errorMessage = "Forbidden";
          break;
        case 404:
          errorMessage = "Not Found";
          break;
        case 409:
          errorMessage = "Email id already exists";
          break;
        case 500:
          errorMessage = "Internal Server Error";
          break;
        default:
          errorMessage = `Error: ${statusCode}`;
      }

      toast.error(errorMessage, {
        onClose: () => setIsButtonDisabled(false),
      });
    } else if (error.request) {
      toast.error("No response received from server", {
        onClose: () => setIsButtonDisabled(false),
      });
    } else {
      toast.error("Error setting up the request", {
        onClose: () => setIsButtonDisabled(false),
      });
    }
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <ToastContainer />
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <div className="d-flex align-items-center OIC-Edit-Head">
          <h3 className="d-inline ms-4">Register New Company</h3>
        </div>
        <div className="me-5">
          <FontAwesomeIcon icon={faTimes} className="addUser-x-icon" onClick={onCancel} />
        </div>
      </div>
      <div className="form-container">
        <form className="p-3">
          <div className="mb-2">
            <label htmlFor="company" className="form-label fw-bold">
              Company Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control form-control-all ${companyError ? "is-invalid" : ""}`}
              id="company"
              value={company}
              onChange={(e) => handleCompanyChange(e.target.value)}
            />
            {companyError && <div className="text-danger">{companyError}</div>}
          </div>

          <div className="mb-2">
            <label htmlFor="email" className="form-label fw-bold">
              Email address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className={`form-control form-control-all ${mailError ? "is-invalid" : ""}`}
              id="email"
              value={mail}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {mailError && <div className="text-danger">{mailError}</div>}
          </div>
        </form>
      </div>

      <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
        <div className="d-flex justify-content-end">
          <button className="profile_btn me-2 fw-bold" onClick={onCancel}>
            Cancel
          </button>
          <Permission requiredPermission="create_company" action="hide">
            <button
              className="me-2 fw-bold btnUserUpgdate"
              onClick={handleSave}
              disabled={isLoading || isButtonDisabled}
            >
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Register Company"}
            </button>
          </Permission>
        </div>
      </div>
    </div>
  );
}

export default AddAdmin;
