import React, { useState } from "react";
import "./FloatingPunchButton.scss";

const FloatingPunchButton = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);

  const handlePunch = () => {
    setIsPunchedIn(!isPunchedIn);
  };

  return (
    <div className="floating-punch-container">
      <button
        className={`punch-button ${isPunchedIn ? "punched-in" : "punched-out"}`}
        onClick={handlePunch}
      >
        {isPunchedIn ? "Punch Out" : "Punch In"}
      </button>
    </div>
  );
};

export default FloatingPunchButton;
