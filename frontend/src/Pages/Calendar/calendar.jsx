import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Permission from "../../Shared modules/Context management/permissionCheck";
import './Calendar.css';  // Import custom CSS file

const localizer = momentLocalizer(moment);

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

  // const handleDeleteEvent = async (id) => {
  //   try {
  //     const response = await axiosInstance.delete(`/calendar/delete/${id}/`);
  //     if (response.status === 200) {
  //       setCalendarEvents(calendarEvents.filter(event => event.id !== id));
  //       handleCloseModal(); // Close modal after deletion
  //     } else {
  //       alert("Failed to delete the event.");
  //     }
  //   } catch (error) {
  //     alert(error.response?.data || "Error deleting calendar event.");
  //   }
  // };
  const handleDeleteEvent = async (id) => {
    try {
      const response = await axiosInstance.delete(`/calendar/delete/${id}/`);
      if (response.status === 200) {
        setCalendarEvents(calendarEvents.filter(event => event.id !== id));
        handleCloseModal(); // Close modal after deletion
      } else {
        alert("Failed to delete the event.");
      }
    } catch (error) {
      alert(error.response?.data || "Error deleting calendar event.");
    }
  };

  const generateColor = (event) => {
    // Color for Sundays (same color for all Sundays)
    const sundayColor = "#FFD700"; // You can choose any color for Sundays
    
    // If the event is on a Sunday, return the Sunday color
    if (new Date(event.date).getDay() === 0) {
      return sundayColor;
    }

    // Color based on event type (name, category, or other property)
    const eventType = event.name; // You can replace this with any other property, like event.type
    const hash = eventType.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `#${(hash % 16777215).toString(16).padStart(6, '0')}`; // Generate a color based on the hash of the event type
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return {
        style: {
          backgroundColor: '#f0f8ff', // Light color (AliceBlue)
          borderRadius: '5px',
        },
      };
    }
    return {};
  };

  const formattedEvents = calendarEvents.map(event => ({
    id: event.id,
    title: event.name,
    start: new Date(event.date),
    end: new Date(event.date),
    description: event.description,
    backgroundColor: generateColor(event),
  }));

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">{calendarTitle}</h2>

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
        style={{ height: 500, marginTop: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.backgroundColor,
            borderRadius: '5px',
            color: 'white',
            border: 'none',
            padding: '5px'
          }
        })}
        onSelectEvent={event => handleShowModal(event)}
        dayPropGetter={dayPropGetter}  // Apply light color for today
      />

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
