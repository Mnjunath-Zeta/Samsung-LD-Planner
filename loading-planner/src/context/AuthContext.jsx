import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Roles: 'admin', 'user'
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || 'admin';
  });

  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  const toggleRole = () => {
    setUserRole(prev => prev === 'admin' ? 'user' : 'admin');
  };

  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, toggleRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
