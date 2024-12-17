import React, { useState, useEffect } from "react";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import "./FloatingPunchButton.scss";
import { Modal } from "react-bootstrap";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import punchbutton from "/src/assets/punch.png";

const FloatingPunchButton = ({ userId }) => {
  const [status, setStatus] = useState(null); 
  const [punchData, setPunchData] = useState(null); 
  const [showModal, setShowModal] = useState(false); 

  const fetchPunchData = async () => {
    try {
      const response = await axiosInstance.get(`/punch-in`);
      setStatus(response.data.status);
      setPunchData(response.data);
    } catch (error) {
      console.error("Error fetching punch data:", error);
    }
  };

  useEffect(() => {
    fetchPunchData();
  }, [userId]);

  // Toggle Punch In/Out
  const handlePunchAction = async () => {
    try {
      if (status === "PunchIN") {
        await axiosInstance.post(`/punch-in`);
        setStatus("PunchOUT");
      } else if (status === "PunchOUT") {
        await axiosInstance.post(`/punch-out`);
        setStatus("LoggedOut");
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error toggling punch status:", error);
    }
  };

  // Modal Handlers
  const handlePunchIconClick = () => {
    if (status) setShowModal(true);
  };
  const handleCancel = () => setShowModal(false);

  // Render dynamic info
  const renderInfoList = (info) => (
    <ul>
      {info.map((item, index) => (
        <li key={index}>
          <strong>{item.label}:</strong> {item.value}
        </li>
      ))}
    </ul>
  );

  const punchDetails = [
    { label: "Time", value: punchData?.time || "N/A" },
    { label: "PunchInZone", value: punchData?.zone || "N/A" }, 
    ...(status === "PunchOut"
      ? [
          { label: "Punch In Time", value: punchData?.punchin || "N/A" },
        ]
      : []),
    ...(status === "LoggedOut"
      ? [
          { label: "Punch In Time", value: punchData?.punchin || "N/A" },
          { label: "Punch Out Time", value: punchData?.punchout || "N/A" },
        ]
      : []),
    { label: "Punch Type", value: status },
  ];

  return (
    <div className="floating-punch-container">
      {/* Floating Punch Icon */}
      <div
        className={`punch-icon`}
        onClick={handlePunchIconClick}
        style={{ cursor: "pointer" }}
      >
        <img src={punchbutton} alt="Punch Button" style={{ width: "50px", height: "50px" }} />
      </div>

      {/* Modal */}
      <Modal show={showModal} centered onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>
            {status === "PunchIN"
              ? "Are you sure you want to Punch In?"
              : status === "PunchOUT"
              ? "Are you sure you want to Punch Out?"
              : "Punch Details"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="info-container">
            <div className="punch-info">{renderInfoList(punchDetails)}</div>
          </div>
        </Modal.Body>

        <Modal.Footer>
        {status === "PunchIN" && (
          <IoIosLogIn
            size={50}
            color="green"
            onClick={handlePunchAction}
            style={{ cursor: "pointer" }}
          />
        )}
        {status === "PunchOUT" && (
          <IoIosLogOut
            size={50}
            color="red"
            onClick={handlePunchAction}
            style={{ cursor: "pointer" }}
          />
        )}
        {status === "LoggedOut" && (
          <IoIosLogIn
            size={50}
            color="grey"
            style={{ cursor: "not-allowed" }} // Non-clickable style
          />
        )} 
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FloatingPunchButton;
