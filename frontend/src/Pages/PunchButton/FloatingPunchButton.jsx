import React, { useState, useEffect } from "react";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import "./FloatingPunchButton.scss";
import { Modal } from "react-bootstrap";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import punchbutton from "/src/assets/punch.png";
import { format } from "date-fns";
// import ReactTooltip from "react-tooltip";

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
        fetchPunchData();
      } else if (status === "PunchOUT") {
        await axiosInstance.post(`/punch-out`);
        fetchPunchData();
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
    ...(status === "PunchOUT"
      ? [
          { label: "Punch In Time", value: punchData?format(new Date(punchData.punchin), "do MMM yyyy, hh:mm a") : "N/A" },
        ]
      : []),
    ...(status === "LoggedOut"
      ? [
          { label: "Punch In Time", value: punchData?format(new Date(punchData.punchin), "do MMM yyyy, hh:mm a") : "N/A" },
          { label: "Punch Out Time", value: punchData?format(new Date(punchData.punchout), "do MMM yyyy, hh:mm a") : "N/A" },
        ]
      : []),
    { label: "Punch Type", value: status },
  ];

  return (
    <div className="floating-punch-container">
      {/* Floating Punch Icon */}
      <div
        className="punch-icon"
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
          className="punch-in-icon"
            size={50}
            color="green"
            onClick={handlePunchAction}
            style={{ cursor: "pointer" }}
          />
          
        )}
        {status === "PunchOUT" && (
          <IoIosLogOut
            className="punch-out-icon"
            size={50}
            color="red"
            onClick={handlePunchAction}
            style={{ cursor: "pointer" }}
          />
        )}
        {status === "LoggedOut" && (
          <IoIosLogIn
            className="after-out-icon"
            size={50}
            color="grey"
            style={{ cursor: "not-allowed" }}
          />
        )} 
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FloatingPunchButton;
