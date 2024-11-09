import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import hamburger from "../../assets/SideBarNav/burger-menu-svgrepo-com.svg";
import LogoMark from "../../../src/assets/login/jivass-logo.png";
import ProfilePic from "../../assets/Profile/Profile.svg";

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [userName, setUserName] = useState("Name"); // Placeholder for name
  const [userRole, setUserRole] = useState("Role"); // Placeholder for role
  const [activeElement, setActiveElement] = useState(null);

  const navigate = useNavigate();
  const sidebarWidth = isSidebarOpen ? "8rem" : "4rem";

  const profileRef = useRef(null);
  const hamburgerRef = useRef(null);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <div className="d-flex align-items-center ms-2 me-2 mt-1">
              {/* Display User Name and Role as Text to the Left */}
              <div className="user-info me-2">
                <div className="user-name">{userName}</div>
                <div className="user-role text-muted">{userRole}</div>
              </div>
              <img
                src={ProfilePic}
                alt="Profile"
                className={`navbar-profile-img ${activeElement === "profile" ? "active" : ""}`}
                onClick={NavAdmin}
                ref={profileRef}
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;