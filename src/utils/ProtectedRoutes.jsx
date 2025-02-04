import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const [authenticationStatus, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchedAuthStatus() {
      try {
        const request = await fetch("http://localhost:3000/api/auth/status", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const response = await request.json();
        if (response.user) {
          setStatus(true);
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchedAuthStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return authenticationStatus ? <Outlet /> : <Navigate to="/authentication" />;
};

export default ProtectedRoutes;
