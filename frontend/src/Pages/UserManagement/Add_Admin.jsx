import React, { useState, useEffect } from "react";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  emailvalidator,
  NameValidator,
} from "../../Shared modules/Exception handling/regexValidation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Permission from "../../Shared modules/Context management/permissionCheck";

function AddAdmin({ onCancel, onUserAdded }) {
  const [clickedSave, setClickedSave] = useState(false);
  const [company, setcompany] = useState("");
  const [companyError, setcompanyError] = useState("");
  const [mail, setMail] = useState("");
  const [mailError, setEmailError] = useState("");

  const [overallpassword, setoverallpassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleCompanyChange = (value) => {
    setcompany(value);
    if (clickedSave) {
      setcompanyError(validateName(value));
    }
  };

  const handleEmailChange = (value) => {
    setMail(value);
    if (clickedSave) {
      setEmailError(validateMail(value));
    }
  };

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

  const handleSave = async () => {
    setClickedSave(true);
    setIsLoading(true);
    const companyError = validateName(company);
    const mailError = validateMail(mail);

    setcompanyError(companyError);
    setEmailError(mailError);

    setIsButtonDisabled(true);

    try {
      const userData = {
        company: company.trim(),
        email: mail.toLowerCase().trim()
      };

      const response = await axiosInstance.post("/admin", userData);
      onUserAdded();
      switch (response.status) {
        case 200:
        case 201:
          toast.success("Company registered successfully!", {
            onClose: () => setIsButtonDisabled(false),
          });
          fetchData(); 
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
        setApiError("Error setting up the request");
        toast.error("Error setting up the request", {
          onClose: () => setIsButtonDisabled(false),
        });
      }
      console.error("Error saving user:", error);
    } finally {
      setIsLoading(false);
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
            <label htmlFor="company" className="form-label fw-bold">
              Company Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control form-control-all ${
                companyError ? "is-invalid" : ""
              }`}
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
              className={`form-control form-control-all ${
                mailError ? "is-invalid" : ""
              }`}
              id="email"
              value={mail}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {mailError && <div className="text-danger">{mailError}</div>}
          </div>

          {overallpassword && (
            <div className="text-secondary">
              Please check the form and correct all errors before submitting.
            </div>
          )}
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
              disabled={(isLoading || isButtonDisabled)}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                "Register Company"
              )}
            </button>
          </Permission>
        </div>
      </div>
    </div>
  );
}

export default AddAdmin;