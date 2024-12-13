import React, { useState } from "react";
import "./FloatingPunchButton.scss";
import { Button, Modal } from "react-bootstrap";
import { IoIosLogIn } from "react-icons/io";

const FloatingPunchButton = () => {
  const [isPunchedIn, setIsPunchedIn] = useState("PunchIn");
  const [showModal, setShowModal] = useState(false);

  const handlePunchIconClick = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);
  const handleConfirmPunch = () => {
    setIsPunchedIn("PunchOut");
    setShowModal(false);
  };

  const modalTitle =
    isPunchedIn === "PunchIn"
      ? "Are you sure you want to Punch In?"
      : "Are you sure you want to Punch Out?";

  // Data for dynamic rendering
  const personalInfo = [
    { label: "Employee Id", value: "N/A" },
    { label: "Employee Name", value: "N/A" },
    { label: "Department", value: "N/A" },
  ];

  const punchDetails = [
    { label: "Time Stamp", value: "N/A" },
    { label: "PunchInZone", value: "N/A" },
    { label: "Punch Type", value: isPunchedIn },
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
      <div className="punch-icon" onClick={handlePunchIconClick}>
        <IoIosLogIn size={50} />
      </div>

      {/* Modal */}
      <Modal show={showModal} centered onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="info-container">

          <div className="personal-info">
            {renderInfoList(personalInfo)}
          </div>
          <div className="punch-into">
            {renderInfoList(punchDetails)}
          </div>
          <div className="shift-info">
            {renderInfoList(shiftInfo)}
          </div>

          </div>

        </Modal.Body>

        <Modal.Footer>
        <a className="btn-2" onClick={handleCancel}>Cancel</a>
        <a className="btn-1" onClick={handleConfirmPunch}>Confirm</a>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FloatingPunchButton;
