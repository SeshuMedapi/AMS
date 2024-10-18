import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Shared modules/Web Service/axiosConfig";
import Notification from "./notification";
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

  const navigate = useNavigate();
  const sidebarWidth = isSidebarOpen ? "8rem" : "4rem";

  const dropdownRef = useRef(null);

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

  const fetchSuggestions = async (query) => {
    try {
      const response = await axiosInstance.get(
        `/claim_global_search?claim_policy_filter_string=${query}`
      );

      setReadOnly(response.data[0].read_only);

      const formattedItems = response.data.map((item) => ({
        id: item.id,
        name: item.claim_number,
        readOnly: item.read_only,
      }));

      return formattedItems;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  const handleSearchSelect = (item) => {
    const claim = item.id;

    localStorage.setItem("readonly", readonly);

    window.open(`/ClaimLayout?claim=${claim}`, "_blank");

    setSearchQuery("");
    setItems([]);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = async (event) => {
    const queryString = event.target.value;
    setSearchQuery(queryString);

    if (queryString.length > 0) {
      const suggestions = await fetchSuggestions(queryString);
      setItems(suggestions);
      setShowNoResults(suggestions.length === 0);
      setHighlightedIndex(-1);
      setIsDropdownOpen(true);
    } else {
      setItems([]);
      setShowNoResults(false);
      setHighlightedIndex(-1);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      if (items.length > 0) {
        setHighlightedIndex((prevIndex) => {
          const newIndex = prevIndex < items.length - 1 ? prevIndex + 1 : 0;
          scrollIntoView(newIndex);
          return newIndex;
        });
      } else {
        setShowNoResults(true);
        setHighlightedIndex(-1);
      }
    } else if (event.key === "ArrowUp") {
      if (items.length > 0) {
        setHighlightedIndex((prevIndex) => {
          const newIndex = prevIndex > 0 ? prevIndex - 1 : items.length - 1;
          scrollIntoView(newIndex);
          return newIndex;
        });
      } else {
        setShowNoResults(true);
        setHighlightedIndex(-1);
      }
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0 && items.length > 0) {
        handleSearchSelect(items[highlightedIndex]);
      } else if (items.length === 0 && searchQuery.trim() !== "") {
        handleSearchSelect(items[0]);
      } else if (event.key === "Enter" && items.length > 0) {
        handleSearchSelect(items[0]);
      }
    }
  };

  const handleBlur = () => {
    if (!dropdownHovered) {
      setSearchQuery("");
      setItems([]);
      setShowNoResults(false);
      setIsDropdownOpen(false);
    }
  };

  const scrollIntoView = (index) => {
    if (dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const itemHeight = dropdown.children[0]?.offsetHeight;
      const scrollPosition = dropdown.scrollTop;
      const dropdownHeight = dropdown.clientHeight;
      const itemOffsetTop = index * itemHeight;

      if (itemOffsetTop < scrollPosition) {
        dropdown.scrollTop = itemOffsetTop;
      } else if (itemOffsetTop + itemHeight > scrollPosition + dropdownHeight) {
        dropdown.scrollTop = itemOffsetTop - dropdownHeight + itemHeight;
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setItems([]);
    setShowNoResults(false);
    setIsDropdownOpen(false);
  };

  const formatResult = (item, index) => (
    <span
      key={item.id}
      style={{
        display: "block",
        textAlign: "left",
        backgroundColor: highlightedIndex === index ? "#e0e0e0" : "transparent",
      }}
    >
      {item.name}
    </span>
  );

  const NavAdmin = () => {
    navigate("/AdminProfile");
  };

  const handleShowChangePage = () => {
    setShowPage(true);
  };

  const handleCancel = () => {
    setShowPage(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-col"
      style={{ "--sidebar-width": sidebarWidth }}
    >
      <div className="container-fluid tooltip-container">
        <div className="d-flex align-items-center">
          <div className="burger-icon" onClick={toggleSidebar}>
            <img src={hamburger} alt="hamburger" className="hamburger" />
          </div>
          <a className="navbar-brand ms-5" href="#">
            <img src={LogoMark} alt="logo" />
          </a>
        </div>
        <div className="d-flex align-items-center ms-auto">
          <form
            className="d-flex position-relative"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="search ms-2 position-relative">
              <div className="input-container">
                
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
              className="ms-2 me-2 mt-1"
              onClick={NavAdmin}
            />
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
