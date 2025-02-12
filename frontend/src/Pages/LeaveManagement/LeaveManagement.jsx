import React, { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import "./LeaveManagement.css";

function LeaveManagement() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveType, setLeaveType] = useState("VACATION");
  const [formData, setFormData] = useState({ name: "", reason: "", from: "", to: "" });
  const [viewMode, setViewMode] = useState('pending');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeaveRequest = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      leaveType,
      status: 'pending'
    };
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
    setFormData({ name: "", reason: "", from: "", to: "" });
    setLeaveType("VACATION");
    setShowRequestForm(false);
  };

  const handleApprove = (id) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'approved' } : request
    ));
  };

  const handleReject = (id) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'rejected' } : request
    ));
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (viewMode === 'pending') return request.status === 'pending';
    if (viewMode === 'approved') return request.status === 'approved';
    return request.status === 'rejected';
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="leave-dashboard">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="text-2xl font-bold text-gray-800">Leave Management Dashboard</h1>
          <button 
            className="request-leave-btn"
            onClick={() => setShowRequestForm(true)}
          >
            Request Leave
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>Pending Requests</h3>
              <p>{leaveRequests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3>Approved Leaves</h3>
              <p>{leaveRequests.filter(r => r.status === 'approved').length}</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'pending' ? 'active' : ''}`}
            onClick={() => setViewMode('pending')}
          >
            Pending
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'approved' ? 'active' : ''}`}
            onClick={() => setViewMode('approved')}
          >
            Approved
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'history' ? 'active' : ''}`}
            onClick={() => setViewMode('history')}
          >
            History
          </button>
        </div>

        {/* Leave Requests List */}
        <div className="leave-requests">
          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <p>No {viewMode} leave requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="leave-request-card">
                <div className="request-header">
                  <h3>{request.name}</h3>
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <div className="request-details">
                  <p><strong>Type:</strong> {request.leaveType}</p>
                  <p><strong>From:</strong> {request.from}</p>
                  <p><strong>To:</strong> {request.to}</p>
                  <p><strong>Reason:</strong> {request.reason}</p>
                </div>
                {viewMode === 'pending' && (
                  <div className="request-actions">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leave Request Modal */}
      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Request Leave</h2>
              <button 
                className="close-btn"
                onClick={() => setShowRequestForm(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  name="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="VACATION">Vacation Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="PERSONAL">Personal Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>From Date</label>
                <input
                  type="date"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter reason for leave"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit Request
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveManagement;