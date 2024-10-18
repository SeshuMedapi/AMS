import React, { useState } from "react";
import Sidebar from "../../../Pages/sideBar/SideNavBar";
import Header from "../../../Pages/Header/header";

function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [contentName, setContentName] = useState("Dashboard");

  const handleSidebarItemClick = (name) => {
    setContentName(name);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const sidebarWidth = isSidebarOpen ? "8rem" : "4rem";

  const sidebarStyle = {
    width: sidebarWidth,
    transition: "width 0.3s ease",
  };

  const contentStyle = {
    marginLeft: sidebarWidth,
    transition: "width 0.3s ease",
    padding: "20px",
    flex: 1,
  };

  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowX: "hidden",
  };

  const mainContentStyle = {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  };

  return (
    <div style={layoutStyle}>
      <Header
        isSidebarOpen={isSidebarOpen}
        contentName={contentName}
        toggleSidebar={toggleSidebar} // Pass toggleSidebar function to Header
      />
      <div style={mainContentStyle}>
        <div style={sidebarStyle}>
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={toggleSidebar}
            onSidebarItemClick={handleSidebarItemClick}
          />
        </div>
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
