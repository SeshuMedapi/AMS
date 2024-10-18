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
  const observer = useRef();

  const fetchNotifications = useCallback(async (pageNum) => {
    try {
      const response = await axiosInstance.get(`/notification?page=${pageNum}`);
      if (response.data.length > 0) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...response.data,
        ]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(page);
  }, [page, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notification/read/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      toast.success("Message read successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      refresh();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deactivateNotification = async (id) => {
    try {
      await axiosInstance.put(`/notification/deactive/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== id)
      );
      toast.success("Message deleted!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      refresh();
    } catch (error) {
      console.error("Error deactivating notification:", error);
    }
  };

  const readAll = async () => {
    try {
      await axiosInstance.put(`/notification/read/all`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, read: true }))
      );
      toast.success("All messages read successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      refresh();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deactivateAll = async () => {
    try {
      await axiosInstance.put(`/notification/deactive/all`);
      setNotifications([]);
      toast.success("All messages deleted!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      refresh();
    } catch (error) {
      console.error("Error deactivating all notifications:", error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${month}-${day}-${year} ${hours}:${minutes}`;
  };

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
        <div className="d-flex align-items-center OIC-Edit-Head">
          <h3 className="d-inline ms-4">Notifications</h3>
        </div>
        <div className="justify-content-end">
          <FontAwesomeIcon
            icon={faTimes}
            className="Restpass-x-icon"
            onClick={onCancel}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end mt-3 me-3">
        <button className="btn btn-dl me-2" onClick={readAll}>
          Read all
        </button>
        <button className="btn btn-dl" onClick={deactivateAll}>
          Delete all
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

                  <div className="col-11 justify-content-start">
                    <h6 className="card-text">{notification.message}</h6>
                  </div>
                </div>
                <div className="col-1 justify-content-end align-center-x me-2">
                  <div
                    className="xicon"
                    onClick={() => deactivateNotification(notification.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
