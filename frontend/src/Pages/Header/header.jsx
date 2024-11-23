import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  const [activeElement, setActiveElement] = useState(null);
  const [profileImage, setProfileImage] = useState(ProfileImage);

  const navigate = useNavigate();
  const sidebarWidth = isSidebarOpen ? "8rem" : "4rem";

  const profileRef = useRef(null);
  const hamburgerRef = useRef(null);

  const handleShowChangePage = () => {
    setShowPage(true);
  };

  const handleCancel = () => {
    setShowPage(false);
  };

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

  const NavAdmin = () => {
    setActiveElement("profile");
    navigate("/AdminProfile");
  };

  const handleHamburgerClick = () => {
    setActiveElement("hamburger");
    toggleSidebar();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setActiveElement(null);
      }
    };
    fetchProfileImage();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfileImage = async () => {
    try {
      const response = await axiosInstance.get("/profile_picture");
      if (response.status == 200) {
        setProfileImage('http://127.0.0.1:8080' + response.data.url);
      } else {
        setProfileImage(ProfileImage);
      }
    } catch (error) {
      setApiError("Failed to fetch profile image: " + error.message);
    }
  };

  const firstname = localStorage.getItem("firstname")
  const lastname = localStorage.getItem("lastname")
  const role = localStorage.getItem("role")

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-col"
      style={{ "--sidebar-width": sidebarWidth }}
    >
      <div className="container-fluid tooltip-container">
        <div className="d-flex align-items-center">
          <div
            className="burger-icon"
            onClick={handleHamburgerClick}
            ref={hamburgerRef}
          >
            <img
              src={hamburger}
              alt="hamburger"
              className={`hamburger ${activeElement === "hamburger" ? "active" : ""}`}
              style={{
                transform: activeElement === "hamburger" ? "rotate(90deg)" : "rotate(0deg)",
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
          <form className="d-flex position-relative" onSubmit={(event) => event.preventDefault()}>
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
                <div className="user-name">{firstname} {lastname}</div>
                <div className="user-role text-muted">{role}</div>
              </div>
              <img
                src={profileImage}
                alt="Profile"
                className={`navbar-profile-img ${activeElement === "profile" ? "active" : ""}`}
                onClick={NavAdmin}
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