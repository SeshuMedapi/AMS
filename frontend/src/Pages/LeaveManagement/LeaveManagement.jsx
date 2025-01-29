import React, { useState } from "react";
import "./LeaveManagement.css"; // Import the CSS file

function LeaveManagement() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);

  const [formData, setFormData] = useState({ name: "", reason: "", from: "", to: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLeaveRequests([...leaveRequests, formData]);
    setFormData({ name: "", reason: "", from: "", to: "" });
    setShowRequestForm(false);
  };

  return (
    <div className="leave-container">
      <div className="button-group">
        <button className="btn request-btn" onClick={() => setShowRequestForm(!showRequestForm)}>
          Leave Request
        </button>
        <button className="btn approve-btn">Leave Approve</button>
      </div>

      {showRequestForm && (
        <form className="leave-form" onSubmit={handleSubmit}>
          <h2>Request Leave</h2>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Reason:</label>
            <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>From:</label>
            <input type="date" name="from" value={formData.from} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>To:</label>
            <input type="date" name="to" value={formData.to} onChange={handleInputChange} required />
          </div>
          <button type="submit" className="btn submit-btn">Submit</button>
        </form>
      )}

      <div className="leave-list">
        <h2>Leave Requests</h2>
        <ul>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request, index) => (
              <li key={index}>
                <span className="request-name">{request.name}</span> - {request.reason} ({request.from} to {request.to})
              </li>
            ))
          ) : (
            <p>No leave requests yet.</p>
          )}
        </ul>
      </div>

      <div className="leave-list">
        <h2>Approved Leaves</h2>
        <ul>
          {approvedLeaves.length > 0 ? (
            approvedLeaves.map((leave, index) => (
              <li key={index}>
                <span className="request-name">{leave.name}</span> - {leave.reason} ({leave.from} to {leave.to})
              </li>
            ))
          ) : (
            <p>No approved leaves yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default LeaveManagement;
