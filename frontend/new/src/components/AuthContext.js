// src/components/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        setUser(decoded.userId); // Assume the user ID is stored in the token
      } catch (error) {
        console.error('Failed to decode token:', error);
        logout(); // Log out if the token is invalid
      }
    } else {
      setUser(null);
    }
  }, [authToken]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5057/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'Login failed');
      }

      const result = await response.json();
      localStorage.setItem('authToken', result.token); // Store token
      setAuthToken(result.token); // Update token in state

      const decoded = jwtDecode(result.token);
      setUser(decoded.userId); // Set user based on the decoded token
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(authToken); // Check if user is authenticated

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
