import React, { useState, useEffect, useCallback } from "react";
import { Country, State, City } from "country-state-city";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Permission from "../../Shared modules/Context management/permissionCheck";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";

function EditBranch({ onCancel, onBranch, branchData }) {
  const [branchName, setBranchName] = useState(branchData.branch || "");
  const [branchNameError, setBranchNameError] = useState("");
  const [address, setAddress] = useState(branchData.address || "");
  const [addressError, setAddressError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.name === branchData.country) || null
  );
  const [selectedState, setSelectedState] = useState(
    branchData.state ? State.getStatesOfCountry(branchData.country)?.find((s) => s.name === branchData.state) : null
  );
  const [selectedCity, setSelectedCity] = useState(branchData.city || "");

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
    }
  }, [selectedState, selectedCountry]);

  const handleCountryChange = useCallback((country) => {
    setSelectedCountry(country);
    setStates(State.getStatesOfCountry(country.isoCode));
    setCities([]);
    setSelectedState(null);
    setSelectedCity("");
  }, []);

  const handleStateChange = useCallback((state) => {
    setSelectedState(state);
    setCities(City.getCitiesOfState(selectedCountry.isoCode, state.isoCode));
  }, [selectedCountry]);

  const handleBranchNameChange = (value) => {
    setBranchName(value);
    if (value.trim() === "") {
      setBranchNameError("Branch name is required");
    } else {
      setBranchNameError("");
    }
  };

  const handleAddressChange = (value) => {
    setAddress(value);
    if (value.trim() === "") {
      setAddressError("Address is required");
    } else {
      setAddressError("");
    }
  };

  const handleSave = async () => {
    if (branchName.trim() === "") {
      setBranchNameError("Branch name is required");
      return;
    }
    if (address.trim() === "") {
      setAddressError("Address is required");
      return;
    }
    if (!selectedCity) {
      toast.error("City is required");
      return;
    }

    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const updatedBranchData = {
        branch: branchName.trim(),
        address: address.trim(),
        country: selectedCountry.name,
        state: selectedState.name,
        city: selectedCity,
      };

      const response = await axiosInstance.put(`branch/${branchData.id}`, updatedBranchData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Branch updated successfully!");
        onBranch();
        setTimeout(() => {
          onCancel();
        }, 3000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
        toast.error(error.response.data.message);
      } else if (error.response) {
        toast.error(`Error: ${error.response.status}`);
      } else {
        toast.error("Error: " + error.message);
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
        <h3 className="d-inline ms-4">Edit Branch</h3>
        <FontAwesomeIcon icon={faTimes} className="addUser-x-icon" onClick={onCancel} />
      </div>
      <div className="form-container">
        <form className="p-3">
          <div className="mb-2">
            <label className="form-label fw-bold">
              Branch <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Branch Name"
              className={`form-control ${branchNameError ? "is-invalid" : ""}`}
              value={branchName}
              onChange={(e) => handleBranchNameChange(e.target.value)}
            />
            {branchNameError && <div className="text-danger">{branchNameError}</div>}
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              Address <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Address"
              className={`form-control ${addressError ? "is-invalid" : ""}`}
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
            />
            {addressError && <div className="text-danger">{addressError}</div>}
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              Country <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={selectedCountry?.isoCode || ""}
              onChange={(e) =>
                handleCountryChange(countries.find((c) => c.isoCode === e.target.value))
              }
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              State <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={selectedState?.isoCode || ""}
              onChange={(e) =>
                handleStateChange(states.find((s) => s.isoCode === e.target.value))
              }
              disabled={!selectedCountry}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">
              City <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
      <div className="position-fixed bottom-0 end-0 popup-bottom-bar">
        <div className="d-flex justify-content-end">
          <button className="profile_btn me-2 fw-bold" onClick={onCancel}>
            Cancel
          </button>
          <Permission requiredPermission="add_branch" action="hide">
            <button
              className="me-2 fw-bold btnUserUpgdate"
              onClick={handleSave}
              disabled={isLoading || isButtonDisabled}
            >
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Update Branch"}
            </button>
          </Permission>
        </div>
      </div>
    </div>
  );
}

export default EditBranch;
