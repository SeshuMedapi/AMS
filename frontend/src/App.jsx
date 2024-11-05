// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ResetPassword from "./Pages/Reset Password/Reset_password";
import LoginPage from './Pages/Login/login'
// import Register from './Pages/Login/AdminRegister'
import Dashboard from "./Pages/Dashboard/dashboard";
import Notification from "./Pages/Header/notification";
import Header from "./Pages/Header/header";
import Usermanagement from './Pages/UserManagement/UserManagement';
import AdminProfile from "./Pages/Profile/AdminProfile";
import PrivateRoute from "./Shared modules/Context management/privateRoutes";
import { AuthProvider } from "./Shared modules/Context management/authContext";
import SessionExpiredModal from "./View Components/Session components/SessionTimeoutModal";
function App() {
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
        const BASE_URL = window.location.origin;
        const handleStorageChange = (event) => {
            if (event.key === 'userLoggedIn' && event.newValue === 'true') {
                // Check if the current tab URL matches the base URL
                if (window.location.href.startsWith(BASE_URL)) {
                    window.location.reload();
                }
            }
            if (event.key === 'logout'  && event.newValue === 'true') {
              // Check if the current tab's URL matches the base URL
              if (window.location.href.startsWith(BASE_URL)) {
                console.log("logedout close")
                window.close(); // Close the current tab
              }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

  useEffect(() => {
    const checkSession = () => {

      const referrer = document.referrer;
      const appDomain = window.location.origin;

      // Function to safely create URL object
      const safeCreateURL = (urlString) => {
        try {
          return new URL(urlString);
        } catch (e) {
          console.error('Invalid URL:', urlString);
          return null;
        }
      };

      // Normalize referrer and appDomain to compare correctly
      const referrerUrl = referrer ? safeCreateURL(referrer) : null;
      const appDomainUrl = safeCreateURL(appDomain);

      // Determine if referrer is external or not
      const isExternalReferrer = !referrer || (referrerUrl && appDomainUrl && referrerUrl.hostname !== appDomainUrl.hostname);
      const sessionDurationExists =
        localStorage.getItem("sessionTime");

      if (isExternalReferrer) {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        const isSessionLoggedOut =
        localStorage.getItem("sessionLoggedOut") === "true";
        if (!isAuthenticated && isSessionLoggedOut && sessionDurationExists) {
          window.location.href = "/";
        }
      }
      else{
      const expiryTime = localStorage.getItem('expiryTime');
      if (sessionDurationExists && expiryTime && Date.now() > Number(expiryTime)) {
        // Session expired
        // setShowModal(true);
        localStorage.removeItem('token');
        localStorage.removeItem('permissions');
        localStorage.setItem("isAuthenticated", false);
        localStorage.removeItem('expiryTime');
        localStorage.setItem("sessionLoggedOut", true);
        // Apply blur effect to the background
        // document.body.classList.add('blurred');
        // setShowModal(true);
      }
    }
    };

    // Check session on component mount
    checkSession();

    // Set an interval to check the session every minute
    const intervalId = setInterval(checkSession, 100);

    return () => {
      document.body.classList.remove('blurred'); // Remove blur effect when unmounted
    };
  }, []);
    return (
        <AuthProvider>
        <div className="app">
        <SessionExpiredModal />
        {/* <Notification/> */}
        {/* <Header/> */}
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
                <Route element={<PrivateRouteWithLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/notification" element={<Notification />} />
                  <Route path="/AdminProfile" element={<AdminProfile />} />
                  <Route path="/User-Management" element={<Usermanagement />} />
                  </Route>
            </Routes>
        </Router>
        </div>
        </AuthProvider>
    );
};

function PrivateRouteWithLayout() {
  return <PrivateRoute />;
}

export default App;
