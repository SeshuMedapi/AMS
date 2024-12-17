import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "./authContext";
import Layout from "../../View Components/Navigation & route/sideBarAndHeader/layout";
import FloatingPunchButton from "../../Pages/PunchButton/FloatingPunchButton"
import Permission from "../../Shared modules/Context management/permissionCheck";

const PrivateRoute = ({ requiredPermission }) => {
  const { isAuthenticated, permissions } = useContext(AuthContext);
  const auth = localStorage.getItem("isAuthenticated");
  if (!auth) {
    return <Navigate to="/" />;
  }
  
  return (

    <Layout>
      <Permission requiredPermission="punch_in" action="hide">
        <FloatingPunchButton />
      </Permission>
      <Outlet />
    </Layout>
    
  );
};

export default PrivateRoute;
