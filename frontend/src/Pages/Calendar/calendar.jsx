import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Make sure the CSS is imported
import Permission from "../../Shared modules/Context management/permissionCheck";  // Assuming this is where your Permission component is imported

// Initialize the localizer with moment
const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ name: '', date: '', description: '', is_editable: true });

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
    const url = currentEvent.id ? `/calendar/edit` : `/calendar/edit`;
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

  const handleDeleteEvent = async (id) => {
    try {
      await axiosInstance.delete(`/calendar/delete/${id}/`);
      setCalendarEvents(calendarEvents.filter(event => event.id !== id));
      handleCloseModal(); // Close the modal after deletion
    } catch (error) {
      alert(error.response?.data || "Error deleting calendar event.");
    }
  };

  const formattedEvents = calendarEvents.map(event => ({
    id: event.id,
    title: event.name,
    start: new Date(event.date),
    end: new Date(event.date),
    description: event.description,
  }));

  return (
    <div className="container mt-5">
      <h2>HR Calendar</h2>

      {/* Add Event Button wrapped in Permission component */}
      <Permission requiredPermission="edit_calendar" action="hide">
        <Button variant="primary" onClick={() => handleShowModal()}>Add Event</Button>
      </Permission>

      <BigCalendar
        localizer={localizer}  // Use the defined localizer here
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, marginTop: '20px' }}
        onSelectEvent={event => handleShowModal(event)}
      />

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
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={currentEvent.date}
                onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
              />
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
            <Button variant="danger" onClick={() => handleDeleteEvent(currentEvent.id)}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            {currentEvent.id ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
