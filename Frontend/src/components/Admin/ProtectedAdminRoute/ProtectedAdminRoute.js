import React from "react";
import { useAuth } from "../../../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser || !isAdmin) {
    return <div style={{display:'flex',height:'100vh',justifyContent:'center',alignItems:'center'}}>You are not authorized to access this page.</div>; // Or redirect to an error page
  }

  return children;
};

export default ProtectedAdminRoute;
