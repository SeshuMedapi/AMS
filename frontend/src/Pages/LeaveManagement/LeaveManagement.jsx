import React, { useState } from "react";
import "./LeaveManagement.css"; // Import the CSS file

function LeaveManagement() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [leaveType, setLeaveType] = useState("VACATION");
  const [formData, setFormData] = useState({ name: "", reason: "", from: "", to: "" });
  const [viewApproved, setViewApproved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeaveRequest = { ...formData, leaveType };
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
    setFormData({ name: "", reason: "", from: "", to: "" });
    setLeaveType("VACATION");
    setShowRequestForm(false);
  };

  return (
    <div className="container">
        <div className="row mb-4">
    <div className="leave-container">
      <div className="top-section">
        {/* Left Section - Buttons */}
        <div className="button-group">
          <button className="btn request-btn" onClick={() => setShowRequestForm(!showRequestForm)}>
            Leave Request
          </button>
          <button className="btn approve-btn">Leave Approve</button>
        </div>

        {/* Right Section - Toggle Requests & Approved */}
        <div className="toggle-section">
  <button
    className={`toggle-btn ${!viewApproved ? "active" : ""}`}
    onClick={() => setViewApproved(false)}
  >
    View Requests
  </button>
  <button
    className={`toggle-btn ${viewApproved ? "active" : ""}`}
    onClick={() => setViewApproved(true)}
  >
    View Approved
  </button>
</div>

      </div>

      {/* Leave Request Form */}
      {showRequestForm && (
        <form className="leave-form" onSubmit={handleSubmit}>
          <h2>Request Leave</h2>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Leave Type:</label>
            <select name="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
              <option value="VACATION">Vacation Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="PERSONAL">Personal Leave</option>
              <option value="MATERNITY">Maternity Leave</option>
              <option value="PATERNITY">Paternity Leave</option>
              <option value="OTHER">Other</option>
            </select>
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

      {/* Leave Requests & Approved Leaves Section */}
      <div className="leave-list">
        <h2>{viewApproved ? "Approved Leaves" : "Leave Requests"}</h2>
        <ul>
          {!viewApproved ? (
            leaveRequests.length > 0 ? (
              leaveRequests.map((request, index) => (
                <li key={index}>
                  <span className="request-name">{request.name}</span> - {request.leaveType} - {request.reason} ({request.from} to {request.to})
                </li>
              ))
            ) : (
              <p>No leave requests yet.</p>
            )
          ) : (
            approvedLeaves.length > 0 ? (
              approvedLeaves.map((leave, index) => (
                <li key={index}>
                  <span className="request-name">{leave.name}</span> - {leave.leaveType} - {leave.reason} ({leave.from} to {leave.to})
                </li>
              ))
            ) : (
              <p>No approved leaves yet.</p>
            )
          )}
        </ul>
      </div>
    </div>
    </div>
    </div>
  );
}

export default LeaveManagement;
