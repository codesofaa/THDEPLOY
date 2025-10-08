import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Simulate fetching authentication status (e.g., from localStorage or API)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Assuming token has user role information or decode token to get role
      setIsAuthenticated(true);
      // Fetch role from token or API if needed
    }
  }, []);

  const login = (role) => {
    setIsAuthenticated(true);
    setUserRole(role); // Set role based on login response
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    localStorage.removeItem('token'); // Example: Remove token on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
