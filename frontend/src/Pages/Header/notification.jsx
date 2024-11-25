import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = ({ onCancel, refresh }) => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false); // Ensures actions are not repeated

  // Fetch notifications from the server
  const fetchNotifications = useCallback(
    async (pageNum) => {
      try {
        const response = await axiosInstance.get(`/notification?page=${pageNum}`);
        if (response.data.length > 0) {
          setNotifications((prevNotifications) => {
            const combinedNotifications = [...prevNotifications, ...response.data];
            return combinedNotifications.filter(
              (notif, index, self) =>
                index === self.findIndex((n) => n.id === notif.id) // Ensure uniqueness
            );
          });
        } else {
          setHasMore(false); // No more notifications to load
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications. Please try again.");
      }
    },
    []
  );

  // Fetch notifications on component mount and page change
  useEffect(() => {
    fetchNotifications(page);
  }, [page, fetchNotifications]);

  // Mark a notification as read
  const markAsRead = async (id, shouldDelete = false) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await axiosInstance.put(`/notification/read/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      if (shouldDelete) {
        deactivateNotification(id, true);
      } else {
        toast.success("Message marked as read!");
      }
      refresh();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark the message as read.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete a single notification
  const deactivateNotification = async (id, skipToast = false) => {
    try {
      await axiosInstance.put(`/notification/deactive/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== id)
      );
      if (!skipToast) {
        toast.success("Message deleted!");
      }
      refresh();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete the message.");
    }
  };

  // Mark all notifications as read
  const readAll = async () => {
    if (notifications.length === 0) {
      toast.info("No messages to mark as read.");
      return;
    }

    try {
      await axiosInstance.put(`/notification/read/all`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, read: true }))
      );
      toast.success("All messages marked as read!");
      refresh();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all messages as read.");
    }
  };

  // Delete all notifications
  const deactivateAll = async () => {
    if (notifications.length === 0) {
      toast.info("No messages to delete.");
      return;
    }

    try {
      await axiosInstance.put(`/notification/deactive/all`);
      setNotifications([]);
      toast.success("All messages deleted!");
      refresh();
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast.error("Failed to delete all messages.");
    }
  };

  // Format date for display
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}-${day}-${year} ${hours}:${minutes}`;
  };

  // Infinite scrolling logic
  const lastNotificationElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div className="position-fixed top-0 end-0 bg-white Side-popup">
      <ToastContainer />
      <div className="d-flex align-items-center border-0 border-bottom Popup-Header">
        <h3 className="d-inline ms-4">Notifications</h3>
        <FontAwesomeIcon
          icon={faTimes}
          className="Restpass-x-icon"
          onClick={onCancel}
        />
      </div>
      <div className="d-flex justify-content-end mt-3 me-3">
        <button className="btn btn-dl me-2" onClick={readAll}>
          Read All
        </button>
        <button className="btn btn-dl" onClick={deactivateAll}>
          Delete All
        </button>
      </div>
      <div className="p-3">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            ref={
              index === notifications.length - 1
                ? lastNotificationElementRef
                : null
            }
            className={`notification-item ${
              notification.read ? "read" : "unread"
            }`}
          >
            <div className="card shadow rounded mb-2">
              <div
                className="col-12 d-flex"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="card-body">
                  <h5 className="card-title">{notification.title}</h5>
                  <p className="card-subtitle mb-2 text-muted font-weight-light">
                    {formatDateTime(notification.datetime)}
                  </p>
                  <h6 className="card-text">{notification.message}</h6>
                </div>
                <div className="col-1 text-end">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="xicon"
                    onClick={() => deactivateNotification(notification.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p>No notifications available.</p>}
      </div>
    </div>
  );
};

export default Notification;
