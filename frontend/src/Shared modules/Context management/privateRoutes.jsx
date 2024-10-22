import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "./authContext";
import Layout from "../../View Components/Navigation & route/sideBarAndHeader/layout";

const PrivateRoute = ({ requiredPermission }) => {
  const { isAuthenticated, permissions } = useContext(AuthContext);
  const auth = localStorage.getItem("isAuthenticated");
  if (!auth) {
    return <Navigate to="/" />;
  }
  
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;
