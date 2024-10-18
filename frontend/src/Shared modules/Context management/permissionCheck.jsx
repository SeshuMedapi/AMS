import React, { useContext } from "react";
import AuthContext from "./authContext";

const Permission = ({
  requiredPermission,
  action = "hide",
  fallback = null,
  children,
}) => {
  const { permissions } = useContext(AuthContext);
  const requiredPermissions = Array.isArray(requiredPermission)
    ? requiredPermission
    : [requiredPermission];

  const hasPermission = requiredPermissions.some((permission) =>
    permissions.includes(permission)
  );

  if (!permissions || !hasPermission) {
    if (action === "hide") {
      return null;
    } else if (action === "disable") {
      return React.cloneElement(children, { disabled: true });
    }
    return fallback;
  }

  return <>{children}</>;
};

export default Permission;
