import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import hamburger from "../../assets/SideBarNav/burger-menu-svgrepo-com.svg";
import LogoMark from "../../../src/assets/login/jivass-logo.png";
import ProfilePic from "../../assets/Profile/Profile.svg";

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [showPage, setShowPage] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [readonly, setReadOnly] = useState("");
  const [showNoResults, setShowNoResults] = useState(false);
  const [dropdownHovered, setDropdownHovered] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();
  const sidebarWidth = isSidebarOpen ? "8rem" : "4rem";

  const dropdownRef = useRef(null);

  const formatResult = (item, index) => (
    <span
      key={item.id}
      style={{
        display: "block",
        textAlign: "left",
        backgroundColor:
          highlightedIndex === index ? "#e0e0e0" : "transparent",
      }}
    >
      {item.name}
    </span>
  );

  const NavAdmin = () => {
    navigate("/AdminProfile");
  };

  const handleHamburgerClick = () => {
    setIsActive(!isActive); // Toggle active state
    toggleSidebar(); // Call the toggleSidebar function
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-col"
      style={{ "--sidebar-width": sidebarWidth }}
    >
      <div className="container-fluid tooltip-container">
        <div className="d-flex align-items-center">
          <div className="burger-icon" onClick={handleHamburgerClick}>
            <img
              src={hamburger}
              alt="hamburger"
              className={`hamburger ${isActive ? "active" : ""}`}
              style={{
                transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
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
          <form
            className="d-flex position-relative"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="search ms-2 position-relative">
              <div className="input-container">
                {/* Search input goes here */}
              </div>

              {isDropdownOpen && items.length > 0 && (
                <ul
                  className="search-results list-unstyled position-absolute start-0"
                  onMouseEnter={() => setDropdownHovered(true)}
                  onMouseLeave={() => setDropdownHovered(false)}
                  ref={dropdownRef}
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {items.map((item, index) => (
                    <li
                      key={item.id}
                      onClick={() => handleSearchSelect(item)}
                      className="search-result-item"
                    >
                      {formatResult(item, index)}
                    </li>
                  ))}
                </ul>
              )}

              {isDropdownOpen && showNoResults && searchQuery.trim() !== "" && (
                <div className="no-results-item">No results found</div>
              )}
            </div>
            <img
              src={ProfilePic}
              alt="Profile"
              className="navbar-profile-img ms-2 me-2 mt-1"
              onClick={NavAdmin}
            />
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
