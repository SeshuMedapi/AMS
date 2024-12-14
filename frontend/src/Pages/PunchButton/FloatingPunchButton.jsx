import React, { useState } from "react";
import "./FloatingPunchButton.scss";
import { Modal } from "react-bootstrap";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import punchbutton from "/src/assets/punch.png";

const FloatingPunchButton = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false); // Track punch status
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  // Modal Handlers
  const handlePunchIconClick = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);

  // Toggle Punch In/Out
  const handleIconToggle = () => {
    setIsPunchedIn(!isPunchedIn); // Toggle Punch In/Out status
    setShowModal(false); // Close modal after toggling
  };

  // Modal Title based on punch state
  const modalTitle = isPunchedIn
    ? "Are you sure you want to Punch Out?"
    : "Are you sure you want to Punch In?";

  // Data for dynamic rendering
  const personalInfo = [
    { label: "Employee Id", value: "N/A" },
    { label: "Employee Name", value: "N/A" },
    { label: "Department", value: "N/A" },
  ];

  const punchDetails = [
    { label: "Time Stamp", value: "N/A" },
    { label: "PunchInZone", value: "N/A" },
    { label: "Punch Type", value: isPunchedIn ? "PunchOut" : "PunchIn" },
  ];

  const shiftInfo = [
    { label: "Shift Name", value: "N/A" },
    { label: "Shift Start Time", value: "N/A" },
    { label: "Shift End Time", value: "N/A" },
  ];

  // Function to render a list dynamically
  const renderInfoList = (info) => (
    <ul>
      {info.map((item, index) => (
        <li key={index}>
          <strong>{item.label}:</strong> {item.value}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="floating-punch-container">
      {/* Floating Punch Icon */}
      <div className="punch-icon" onClick={handlePunchIconClick}>
        <img src={punchbutton} alt="Punch Button" style={{ width: "50px", height: "50px" }} />
      </div>

      {/* Modal */}
      <Modal show={showModal} centered onHide={handleCancel}>
        <Modal.Header closeButton >
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="info-container">
            <div className="personal-info">{renderInfoList(personalInfo)}</div>
            <div className="punch-info">{renderInfoList(punchDetails)}</div>
            <div className="shift-info">{renderInfoList(shiftInfo)}</div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {/* Toggle Between Log In and Log Out Icons */}
          {isPunchedIn ? (
            <IoIosLogOut
            className="punch-icon"
              size={50}
              color="red"
              onClick={handleIconToggle} // Toggle on click
              style={{ cursor: "pointer" }}
            />
          ) : (
            <IoIosLogIn
              className="punch-icon"
              size={50}
              color="green"
              onClick={handleIconToggle} // Toggle on click
              style={{ cursor: "pointer" }}
            />
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FloatingPunchButton;
