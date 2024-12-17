import React, { useEffect, useRef, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  return (
    <div className="container shadow-sm" style={{
      backgroundColor: "rgba(248, 249, 250, 0.5)", // Light gray with 50% opacity
    }}>
      <div className="row mb-4">
        <p><b>Welcome</b></p>
      </div>
    </div>
  );
};

export default Dashboard;
