// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ResetPassword from "./Pages/Reset Password/Reset_password";
import LoginPage from "./Pages/Login/login";
import Dashboard from "./Pages/Dashboard/dashboard";
import Usermanagement from "./Pages/UserManagement/UserManagement";
import Calendar from "./Pages/Calendar/calendar";
import AdminProfile from "./Pages/Profile/AdminProfile";
import LandingPage from "./Pages/Dashboard/landingpage";
import PrivateRoute from "./Shared modules/Context management/privateRoutes";
import { AuthProvider } from "./Shared modules/Context management/authContext";
import SessionExpiredModal from "./View Components/Session components/SessionTimeoutModal";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <AuthProvider>
            <Router> {/* Move the Router here */}
                <MainApp />
            </Router>
        </AuthProvider>
    );
}

function MainApp() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = () => {
            const expiryTime = localStorage.getItem("expiryTime");
            if (!expiryTime || Date.now() > Number(expiryTime)) {
                localStorage.removeItem("token");
                localStorage.removeItem("permissions");
                localStorage.setItem("isAuthenticated", "false");
                localStorage.removeItem("expiryTime");
                navigate("/login");
            }
        };

        checkSession();
        const intervalId = setInterval(checkSession, 5000); // Check every minute

        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div className="app">
            <SessionExpiredModal />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route element={<PrivateRouteWithLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/AdminProfile" element={<AdminProfile />} />
                    <Route path="/User-Management" element={<Usermanagement />} />
                    <Route path="/calendar" element={<Calendar />} />
                </Route>
            </Routes>
        </div>
    );
}

function PrivateRouteWithLayout() {
    return <PrivateRoute />;
}

export default App;
