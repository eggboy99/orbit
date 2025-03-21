import { createContext, useState } from "react";
import { useCallback } from "react";
import PropTypes from "prop-types";

const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isAuthenticated, setAuthentication] = useState(false);
  const [user, setUser] = useState(null);

  // Retrieve the Authentication from the backend server and set the value as the state of isAuthenticated
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/status", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const fetchedData = await response.json();
      setAuthentication(fetchedData.isAuthenticated);
      setUser(fetchedData.user.id);
    } catch (error) {
      setAuthentication(false);
    }
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        setAuthentication,
        checkAuthStatus,
        user,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticationContext;
