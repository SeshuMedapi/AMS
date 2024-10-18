import React, { createContext, useState, useEffect } from "react";
import { showModal } from "../../View Components/Session components/SessionController";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedPermissions = localStorage.getItem("permissions");

    if (token) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("sessionLoggedOut", false);
      if (storedPermissions) {
        setPermissions(JSON.parse(storedPermissions));
      }
    }
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const isSessionLoggedOut =
        localStorage.getItem("sessionLoggedOut") === "true";
      const sessionDurationExists =
        localStorage.getItem("sessionTime");
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
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

      if (!isAuthenticated && isSessionLoggedOut && sessionDurationExists) {
        if (isExternalReferrer) {
          // Redirect to login page if accessed directly from the browser
          window.location.href = "/";
        } else {
          // Show modal if accessed within the app
          showModal();
        }
      }
    };

    checkSession();

    const intervalId = setInterval(checkSession, 100);

    return () => { 
      document.body.classList.remove('blurred');
    };
  }, []);

  const login = (token, userPermissions, session_time) => {
    localStorage.setItem("token", token);
    localStorage.setItem("permissions", JSON.stringify(userPermissions));
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", true);

    const expiryTime = Date.now() + session_time * 1000;
    localStorage.setItem("expiryTime", expiryTime);
    localStorage.setItem("sessionTime", session_time);
    localStorage.setItem("sessionLoggedOut", false);

    setPermissions(userPermissions);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.setItem("sessionLoggedOut", false);
    localStorage.removeItem('expiryTime');
    setIsAuthenticated(false);
    setPermissions([]);
    localStorage.setItem('logout', 'true');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, permissions, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
