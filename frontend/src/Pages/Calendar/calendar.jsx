import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Permission from "../../Shared modules/Context management/permissionCheck";
import './Calendar.css';  // Import custom CSS file

// Initialize the localizer with moment
const localizer = momentLocalizer(moment);

// Function to generate consistent color for event types
const getEventColor = (eventName) => {
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  const colorCode = hashCode(eventName);
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF5'];
  return colors[Math.abs(colorCode) % colors.length];  // Ensuring a consistent color from a set
};

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ name: '', date: '', description: '', is_editable: true });

  const group = localStorage.getItem("groupName");
  const calendarTitle = group === "HR" ? "HR Calendar" : "Manager Calendar";

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await axiosInstance.get('/calendar');
        setCalendarEvents(response.data);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };
    fetchCalendarEvents();
  }, []);

  const handleShowModal = (event = { name: '', date: '', description: '', is_editable: true }) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveEvent = async () => {
    const url = currentEvent.id ? `/calendar/edit/${currentEvent.id}` : `/calendar/add`;
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
    }
  };

  // DELETE EVENT
  const handleDeleteEvent = async (id) => {
    try {
      await axiosInstance.delete(`/calendar/delete/${id}/`); // Correct API URL
      setCalendarEvents(calendarEvents.filter(event => event.id !== id)); // Remove the event from state
      handleCloseModal(); // Close modal after deletion
    } catch (error) {
      alert(error.response?.data || "Error deleting calendar event.");
    }
  };

  // Format events and apply color logic
  const formattedEvents = calendarEvents.map(event => {
    const eventColor = getEventColor(event.name);
    const eventDate = new Date(event.date);
    const isSunday = eventDate.getDay() === 0;  // Check if it's a Sunday

    return {
      id: event.id,
      title: event.name,
      start: eventDate,
      end: eventDate,
      description: event.description,
      backgroundColor: isSunday ? '#B2B2B2' : eventColor,  // Set Sunday color to gray
      isEditable: !isSunday,  // Make Sunday events uneditable
    };
  });

  // Render today's date with a dot
  const renderDay = (date, dayWrapper) => {
    if (moment().isSame(date, 'day')) {
      return (
        <div className="today-day">
          <span className="dot-mark"></span>
          {dayWrapper}
        </div>
      );
    }
    return dayWrapper;
  };

  return (
    <div className="container mt-5">
      <h2>{calendarTitle}</h2>

      {/* Calendar and Add Event Button */}
      <div className="calendar-container">
        {group === "HR" && (
          <Permission requiredPermission="edit_calendar" action="hide">
            <Button className="add-event-btn" onClick={() => handleShowModal()}>Add Event</Button>
          </Permission>
        )}

        <BigCalendar
          localizer={localizer}
          events={formattedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, marginTop: '20px' }}
          onSelectEvent={event => handleShowModal(event)}
          dayPropGetter={renderDay}  // Custom render for today’s dot
        />
      </div>

      {/* Modal for Adding/Editing Event */}
      <Modal show={showModal} onHide={handleCloseModal}>
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
                disabled={!currentEvent.isEditable}  // Disable for Sundays
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={currentEvent.date}
                onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                disabled={!currentEvent.isEditable}  // Disable for Sundays
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentEvent.description}
                onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                disabled={!currentEvent.isEditable}  // Disable for Sundays
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {currentEvent.id && (
            <Button variant="danger" onClick={() => handleDeleteEvent(currentEvent.id)}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEvent} disabled={!currentEvent.isEditable}>
            {currentEvent.id ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
