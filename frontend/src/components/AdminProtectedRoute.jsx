import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const userJson = localStorage.getItem("skillnestUser");
  
  if (!userJson) {
    return <Navigate to="/admin/login" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(userJson);
  } catch (e) {
    console.error("Invalid stored session:", e);
  }

  if (user?.role?.toUpperCase() !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
