import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import Permission from "../../Shared modules/Context management/permissionCheck";
import './calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentEvent, setCurrentEvent] = useState({ name: '', date: '', description: '', type: '', is_editable: true });
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await axiosInstance.get(`calendar/${userId}`);
        setCalendarEvents(response.data);
      } catch (error) {
        setError("Error fetching calendar events.");
        console.error("Error fetching calendar events:", error);
      }
    };
    fetchCalendarEvents();
  }, [userId]);

  const handleShowModal = (event = { name: '', date: '', description: '', type: '', is_editable: true }) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveEvent = async () => {
    if (!currentEvent.name || !currentEvent.date || !currentEvent.type) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    const formattedEvent = {
      ...currentEvent,
      date: moment(currentEvent.date).format("YYYY-MM-DD HH:mm:ss"),
    };

    const url = currentEvent.id ? `calendar/${userId}` : `calendar/${userId}`;
    try {
      const response = await axiosInstance.post(url, formattedEvent);
      if (currentEvent.id) {
        setCalendarEvents(calendarEvents.map(e => e.id === response.data.id ? response.data : e));
      } else {
        setCalendarEvents([...calendarEvents, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data || "Error saving calendar event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLoading(true);
      try {
        await axiosInstance.delete(`calendar/delete/${id}`);
        setCalendarEvents(calendarEvents.filter(event => event.id !== id));
        setShowModal(false);
      } catch (error) {
        setError(error.response?.data || "Error deleting calendar event.");
      } finally {
        setLoading(false);
      }
    }
  };

  const formattedEvents = calendarEvents.map(event => ({
    id: event.id,
    title: event.name,
    start: new Date(moment(event.date).toISOString()),
    end: new Date(moment(event.date).toISOString()),
    description: event.description,
    type: event.type,
  }));

  const Role = localStorage.getItem("role");

  const getDynamicTimeRestrictions = (selectedDate) => {
    const currentDate = new Date();
    const selectedDateWithoutTime = new Date(selectedDate);
    selectedDateWithoutTime.setHours(0, 0, 0, 0);
    const currentDateWithoutTime = new Date(currentDate);
    currentDateWithoutTime.setHours(0, 0, 0, 0);

    let minTime, maxTime;

    if (selectedDateWithoutTime.getTime() === currentDateWithoutTime.getTime()) {
      minTime = new Date();
      minTime.setSeconds(0, 0);
      maxTime = new Date(selectedDate);
      maxTime.setHours(23, 59, 59, 999);
    } else {
      minTime = new Date(selectedDate);
      minTime.setHours(0, 0, 0, 0);

      maxTime = new Date(selectedDate);
      maxTime.setHours(23, 59, 59, 999);
    }

    return { minTime, maxTime };
  };

  const { minTime, maxTime } = getDynamicTimeRestrictions(selectedDate);

  return (
    <div>
        <div className="container mt-5">
        <div className="row card-body">
          <div className={loading ? "blurred" : ""}>
            <h2>{Role} Calendar</h2>

            <Permission requiredPermission="edit_calendar" action="hide">
              <a href="#" className="btn-1 add-event-btn" onClick={() => handleShowModal()}>Add Event</a>
            </Permission>

            <BigCalendar
              localizer={localizer}
              events={formattedEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, marginTop: '20px' }}
              onSelectEvent={(event) => handleShowModal({
                id: event.id,
                name: event.title,
                date: event.start,
                description: event.description,
                type: event.type,
                is_editable: true,
              })}
              selectable
              eventPropGetter={(event) => {
                const eventDate = new Date(event.start);
                if (eventDate.getDay() === 0) {
                  return {
                    style: {
                      backgroundColor: 'lightgrey',
                      color: 'black',
                      pointerEvents: 'none',
                      opacity: 0.6,
                    },
                  };
                }

                const eventStyles = {
                  week_off: {
                    className: "week-off-event",
                    style: { backgroundColor: "#18b53d", color: "#fff", borderRadius: "4px" },
                  },
                  public_holiday: {
                    className: "public-holiday-event",
                    style: { backgroundColor: "#fff3cd", color: "#856404", borderRadius: "4px" },
                  },
                  meeting: {
                    className: "meeting-event",
                    style: { backgroundColor: "#d1ecf1", color: "#0c5460", borderRadius: "4px" },
                  },
                  training: {
                    className: "training-event",
                    style: { backgroundColor: "#d4edda", color: "#155724", borderRadius: "4px" },
                  },
                };

                return eventStyles[event.type] || { className: "default-event" };
              }}
              dayPropGetter={(date) => {
                if (date.getDay() === 0) {
                  return {
                    style: {
                      backgroundColor: 'lightgrey',
                      pointerEvents: 'none',
                    },
                  };
                }
                return {};
              }}
            />
{/* 
<Permission requiredPermission="view_calendar" action="hide">
<Modal show={showModal} onHide={handleCloseModal}>
  <p>hhugkjhukhk</p>
  </Modal>
  </Permission> */}
  
          <Permission requiredPermission="edit_calendar" action="hide">
            <Modal show={showModal} onHide={handleCloseModal}>
              {loading && (
                <div className="loader-overlay">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="loading-message">
                    <i className="bi bi-bell-fill"></i>
                    <p>Sending notifications to the users, please wait...</p>
                  </div>
                </div>
              )}
            
              <div className={loading ? "blurred" : ""}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentEvent.id ? "Edit Event" : "Add Event"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <Form>
                    <Form.Group>
                      <Form.Label>Event Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={currentEvent.name}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group className="date-picker-group">
                      <Form.Label>Date & Time</Form.Label>
                      <DatePicker
                        selected={currentEvent.date ? new Date(currentEvent.date) : null}
                        onChange={(date) => {
                          const formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
                          setCurrentEvent({ ...currentEvent, date: formattedDate });
                          setSelectedDate(date);
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={5}
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                        className="form-control"
                        filterDate={(date) => date.getDay() !== 0}
                        minDate={new Date()}
                        minTime={minTime}
                        maxTime={maxTime}
                        popperPlacement="bottom-start"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Event Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={currentEvent.type || ''}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value })}
                      >
                        <option value="">Select Type</option>
                        <option value="week_off">Week Off</option>
                        <option value="public_holiday">Public Holiday</option>
                        <option value="meeting">Meeting</option>
                        <option value="training">Training</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={currentEvent.description}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  {currentEvent.id && (
                    <a href="#" className="btn-3" onClick={() => handleDeleteEvent(currentEvent.id)}>Delete</a>
                  )}
                  <a href="#" className="btn-2" onClick={handleCloseModal}>Cancel</a>
                  <a href="#" className="btn-1" onClick={handleSaveEvent} disabled={loading}>
                    {currentEvent.id ? "Update" : "Save"}
                  </a>
                </Modal.Footer>
              </div>
            </Modal>
            </Permission>
          </div>
                {/* Calendar Summary Section */}
            <div className="calendar-summary">
              <div className="summary-item">
                <strong>Working Days:</strong> <span className="placeholder">Loading...</span>
              </div>
              <div className="summary-item">
                <strong>Public Holidays:</strong> <span className="placeholder">Loading...</span>
              </div>
              <div className="summary-item">
                <strong>Week Offs:</strong> <span className="placeholder">Loading...</span>
              </div>
              <div className="summary-item">
                <strong>Sundays:</strong> <span className="placeholder">Loading...</span>
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Calendar;
