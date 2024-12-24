import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "react-bootstrap";
import "animate.css/animate.min.css";
import Notification from "./notification";
import Notificationwithicon from "../../../src/assets/notification/Notification-1.svg";
import Noticeicon from "../../../src/assets/notification/Notification.svg";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import hamburger from "../../assets/SideBarNav/burger-menu-svgrepo-com.svg";
import LogoMark from "../../../src/assets/login/jivass-logo.png";
import ProfileImage from "../../assets/Profile/contactProfile.png";

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [showPage, setShowPage] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState(ProfileImage);
  const [timeLeft, setTimeLeft] = useState(""); // State to hold countdown timer

  const navigate = useNavigate();
  const location = useLocation();
  const sidebarWidth = isSidebarOpen ? "8rem" : "4rem";

  const profileRef = useRef(null);
  const hamburgerRef = useRef(null);

  const Expirytime = localStorage.getItem("expiryTime");

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const remainingTime = Expirytime - now;

    if (remainingTime <= 0) {
      return "00:00:00";
    }

    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleShowChangePage = () => setShowPage(true);
  const handleCancel = () => setShowPage(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/notification?page=1`);
      setHasNotifications(response.data.length > 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 900000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleNavigation = (path) => navigate(path);
  const isActive = (path) => location.pathname === path;

  const fetchProfileImage = async () => {
    try {
      const response = await axiosInstance.get("/profile_picture");
      if (response.status === 200) {
        setProfileImage("http://127.0.0.1:8080" + response.data.url);
      } else {
        setProfileImage(ProfileImage);
      }
    } catch (error) {
      console.error("Failed to fetch profile image:", error.message);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const firstname = localStorage.getItem("firstname");
  const lastname = localStorage.getItem("lastname");
  const role = localStorage.getItem("role");

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-col"
      style={{ "--sidebar-width": sidebarWidth }}
    >
      <div className="container-fluid tooltip-container">
        <div className="d-flex align-items-center">
          <div
            className={`burger-icon ${isActive("dashboard") ? "active" : ""}`}
            onClick={() => {
              toggleSidebar();
              // handleNavigation("dashboard");
            }}
            ref={hamburgerRef}
          >
            <img
              src={hamburger}
              alt="hamburger"
              className="hamburger"
              style={{
                transform: isSidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          <a
            className="navbar-brand ms-5 logo-link"
            href="https://jivass.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <img height={70} width={70} src={LogoMark} alt="Jivass Logo" />
            <span className="company-name">JIVASS TECHNOLOGIES</span>
          </a>
        </div>
        <div className="d-flex align-items-center ms-auto">
        <div className="timer-container me-3 mt-2 d-flex align-items-center">
          <span className="timer-text me-2">Logout in:</span>
          <Badge
            bg="primary"
            className="timer-badge text-light animate__animated animate__pulse"
          >
            {timeLeft}
          </Badge>
        </div>
          <form
            className="d-flex position-relative"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="head-notification me-2 mt-3">
              <div className="notification" onClick={handleShowChangePage}>
                <img
                  src={hasNotifications ? Notificationwithicon : Noticeicon}
                  alt="Notification"
                />
              </div>
            </div>
            <div className="d-flex align-items-center ms-2 me-2 mt-1">
              <div className="user-info me-2">
                <div className="user-name">
                  {firstname} {lastname}
                </div>
                <div className="user-role text-muted">{role}</div>
              </div>
              <img
                src={profileImage}
                alt="Profile"
                className={`navbar-profile-img ${
                  isActive("/AdminProfile") ? "active" : ""
                }`}
                onClick={() => handleNavigation("/AdminProfile")}
                ref={profileRef}
              />
            </div>
          </form>
        </div>
      </div>
      {showPage && <div className="overlay" onClick={handleCancel}></div>}
      {showPage && (
        <Notification onCancel={handleCancel} refresh={fetchNotifications} />
      )}
    </nav>
  );
};

export default Header;
