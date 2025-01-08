import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Permission from "../../Shared modules/Context management/permissionCheck";
import Dashboard from "../../assets/SideBarNav/HoverMenu/Dashboard.svg";
import Report from "../../assets/SideBarNav/HoverMenu/Report.svg";
import Invoices from "../../assets/SideBarNav/HoverMenu/Invoice.svg";
import UserManagement from "../../assets/SideBarNav/HoverMenu/User Management.svg";
import Calendar from "../../assets/calendar.svg";
import OIC from "../../assets/SideBarNav/oicIcon.svg";

import DashboardHover from "../../assets/SideBarNav/Menu/Dashboard.svg";
import ReportHover from "../../assets/SideBarNav/Menu/Report.svg";
import InvoicesHover from "../../assets/SideBarNav/Menu/Invoice.svg";
import UserManagementHover from "../../assets/SideBarNav/Menu/User Management.svg";
import OICHover from "../../assets/SideBarNav/oicIconHover.svg";

import { Tooltip, OverlayTrigger } from "react-bootstrap";

function Sidebar({ isOpen, onSidebarItemClick }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [hoverIndex, setHoverIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const navItems = [
    {
      name: "Dashboard",
      icon: Dashboard,
      hoverIcon: DashboardHover,
      permission: ["view_users", "view_company"],
      path: "/dashboard",
    },
    {
      name: "User Management",
      icon: UserManagement,
      hoverIcon: UserManagementHover,
      permission: ["view_users", "view_company"],
      path: "/user-management",
    },
    {
      name: "Calendar",
      icon: Calendar,
      hoverIcon: Calendar,
      permission: ["view_calendar"],
      path: "/calendar",
    },
  ];

  // Automatically set the active button based on the current URL
  useEffect(() => {
    const activePath = location.pathname;
    const activeIndex = navItems.findIndex((item) => item.path === activePath);
    setActiveIndex(activeIndex);
  }, [location.pathname]);

  const handleClick = (name, index) => {
    setActiveIndex(index); // Set active index for clicked button
    onSidebarItemClick(name);
    navigate(navItems[index].path);
  };

  const menuItemStyle = {
    transition: "width 0.3s ease",
  };

  return (
    <div>
      <div className="bg-color ms-3 mt-3">
        <div
          className={`d-flex flex-column ${isOpen ? "bg-color" : "bg-color"}`}
          style={{ width: isOpen ? "8rem" : "4rem" }}
        >
          {isOpen && (
            <div className="bg-color d-flex flex-column flex-grow-1 con-height">
              <ul className="nav flex-column" style={menuItemStyle}>
                {navItems.map((item, index) => (
                  <Permission key={index} requiredPermission={item.permission}>
                    <li className="text-center">
                      <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip id={`tooltip-${item.name}`}>{item.name}</Tooltip>}
                      >
                        <button
                          className={`nav-link btn-primary d-flex align-items-center justify-content-start mt-3 position-relative btn1 ${index === activeIndex ? "active" : ""} ${item.name
                            .replace(" ", "-")
                            .toLowerCase()}`}
                          onClick={() => handleClick(item.name, index)}
                          onMouseEnter={() => setHoverIndex(index)}
                          onMouseLeave={() => setHoverIndex(null)}
                        >
                          <img
                            src={
                              hoverIndex === index || activeIndex === index ? item.hoverIcon : item.icon
                            }
                            alt={item.name}
                            className="img-size"
                          />
                          <p className="ms-3 mt-3">{item.name}</p>
                        </button>
                      </OverlayTrigger>
                    </li>
                  </Permission>
                ))}
              </ul>
            </div>
          )}

          {!isOpen && (
            <div className="d-flex flex-column bg-color align-items-center n-close">
              <ul
                className="nav nav-pills nav-flush flex-column mb-auto d-flex align-items-center justify-content-center"
                style={menuItemStyle}
              >
                {navItems.map((item, index) => (
                  <Permission key={index} requiredPermission={item.permission}>
                    <li className="nav-item">
                      <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip id={`tooltip-${item.name}`}>{item.name}</Tooltip>}
                      >
                        <button
                          className={`nav-link btn-primary rounded-circle d-flex flex-column align-items-center justify-content-center mt-3 btn2 ${index === activeIndex ? "active" : ""} ${item.name
                            .replace(" ", "-")
                            .toLowerCase()}`}
                          type="button"
                          onClick={() => handleClick(item.name, index)}
                          onMouseEnter={() => setHoverIndex(index)}
                          onMouseLeave={() => setHoverIndex(null)}
                        >
                          <img
                            src={
                              hoverIndex === index || activeIndex === index ? item.hoverIcon : item.icon
                            }
                            alt={item.name}
                            className="img-con1"
                          />
                        </button>
                      </OverlayTrigger>
                    </li>
                  </Permission>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
