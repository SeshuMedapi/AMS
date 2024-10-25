import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Permission from "../../Shared modules/Context management/permissionCheck";
import Dashboard from "../../assets/SideBarNav/HoverMenu/Dashboard.svg";
import Report from "../../assets/SideBarNav/HoverMenu/Report.svg";
import Invoices from "../../assets/SideBarNav/HoverMenu/Invoice.svg";
import UserManagement from "../../assets/SideBarNav/HoverMenu/User Management.svg";
import OIC from "../../assets/SideBarNav/oicIcon.svg";

import DashboardHover from "../../assets/SideBarNav/Menu/Dashboard.svg";
import ReportHover from "../../assets/SideBarNav/Menu/Report.svg";
import InvoicesHover from "../../assets/SideBarNav/Menu/Invoice.svg";
import UserManagementHover from "../../assets/SideBarNav/Menu/User Management.svg";
import OICHover from "../../assets/SideBarNav/oicIconHover.svg";

import { Tooltip, OverlayTrigger } from 'react-bootstrap';

function Sidebar({ isOpen, onSidebarItemClick }) {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

  const navItems = [
    {
      name: "Dashboard",
      icon: Dashboard,
      hoverIcon: DashboardHover,
      permission: ["view_user","view_company"],
    },
    {
      name: "User Management",
      icon: UserManagement,
      hoverIcon: UserManagementHover,
      permission: ["view_user","view_company"],
    }
  ];

  const handleClick = (name) => {
    onSidebarItemClick(name);
    navigate(`/${name.toLowerCase().replace(" ", "-")}`);
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
                          className={`nav-link btn-primary d-flex align-items-center justify-content-start mt-3 position-relative btn1 ${item.name
                            .replace(" ", "-")
                            .toLowerCase()}`}
                          onClick={() => handleClick(item.name)}
                          onMouseEnter={() => setHoverIndex(index)}
                          onMouseLeave={() => setHoverIndex(null)}
                        >
                          <img
                            src={
                              hoverIndex === index ? item.hoverIcon : item.icon
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
                          className={`nav-link btn-primary rounded-circle d-flex flex-column align-items-center justify-content-center mt-3 btn2 ${item.name
                            .replace(" ", "-")
                            .toLowerCase()}`}
                          type="button"
                          onClick={() => handleClick(item.name)}
                          onMouseEnter={() => setHoverIndex(index)}
                          onMouseLeave={() => setHoverIndex(null)}
                        >
                          <img
                            src={
                              hoverIndex === index ? item.hoverIcon : item.icon
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