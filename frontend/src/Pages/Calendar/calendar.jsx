import React, { useEffect, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Permission from "../../Shared modules/Context management/permissionCheck";
import './calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ name: '', date: '', description: '', type: '', is_editable: true });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await axiosInstance.get(`calendar/${userId}`);
        setCalendarEvents(response.data);
      } catch (error) {
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
    setLoading(true);
    const url = currentEvent.id ? `calendar/${userId}` : `calendar/${userId}`;
    try {
      const response = await axiosInstance.post(url, currentEvent);
      if (currentEvent.id) {
        setCalendarEvents(calendarEvents.map(e => e.id === response.data.id ? response.data : e));
      } else {
        setCalendarEvents([...calendarEvents, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      alert(error.response?.data || "Error saving calendar event.");
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
        alert(error.response?.data || "Error deleting calendar event.");
      } finally {
        setLoading(false);
      }
    }
  };

  const formattedEvents = calendarEvents.map(event => ({
    id: event.id,
    title: event.name,
    start: new Date(event.date),
    end: new Date(event.date),
    description: event.description,
    type: event.type,
  }));

  const eventPropGetter = (event) => {
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
  };

  const Role = localStorage.getItem("role")

  return (
    <div className="container mt-5">
      <div className={loading ? "blurred" : ""}>
        <h2>{Role} Calendar</h2>

      <Permission requiredPermission="edit_calendar" action="hide">
        <a href="#" className="btn-1" onClick={() => handleShowModal()}>Add Event</a>
      </Permission>

      <BigCalendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, marginTop: '20px' }}
        onSelectEvent={(event) => handleShowModal(event)}
        eventPropGetter={eventPropGetter}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
      {loading && (
        <div className="loader-overlay">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="loading-message">
            <i className="bi bi-bell-fill"></i> {/* Icon */}
            <p>Sending notifications to the user, please wait...</p>
          </div>
        </div>
      )}
      <div className={loading ? "blurred" : ""}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEvent.id ? "Edit Event" : "Add Event"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                value={currentEvent.name}
                onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(currentEvent.date).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setCurrentEvent({ ...currentEvent, date: moment(e.target.value).format("YYYY-MM-DD HH:mm:ss") })}
              />
            </Form.Group>
            {/* <Form.Group>
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={currentEvent.time || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })}
              />
            </Form.Group> */}
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
          <a href="#" className="btn-1" onClick={handleSaveEvent}>{currentEvent.id ? "Update" : "Save"}</a>
        </Modal.Footer>
      </div>
      </Modal>
      </div>
    </div>
  );
};

export default Calendar;
