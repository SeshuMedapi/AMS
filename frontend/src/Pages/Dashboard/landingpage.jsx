import React from 'react';
import "./landingpage.css"
import LandingPageLogo from "../../assets/Landingpage/logo2.png";
import LandingPageImg from "../../assets/Landingpage/lnp2.png";


const LandingPage = () => {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to bottom right, #8E7AB5, #B784B7, #E493B3, #EEA5A6)",
        

      }}
    >
      <div id="lp_navbar">
        <div className="lp_container">
          <nav id="lp_nav">
            <div>
              <img src={LandingPageLogo} alt="lp_logo" className="lp_logo" />
              <span className="lp_nav-text">AttenDo</span>
            </div>
            <ul id="lp_sidemenu">
              <li><a href="#header">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="login" className='lp_button'>Login</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>

      <div id="lp_header">
        <div className="header-left">
          <img src={LandingPageImg} alt="Landing Image" className="lp_header-image" />
        </div>
        <div className="lp_header-right">
          <h1>ATTENDANCE & TASK MANAGEMENT SYSTEM</h1>
          <p>Efficiently track attendance and manage tasks with our smart system, designed to boost productivity and streamline workflow in real-time.</p>
          <a href="#" className="lp_btn">Get Started</a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
