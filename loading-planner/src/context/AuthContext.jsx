import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // User object: { username: string, role: 'admin' | 'user' } | null
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Hardcoded credentials for now
  const CREDENTIALS = {
    admin: { password: 'AdminSDS', role: 'admin' },
    user: { password: 'UserSDS', role: 'user' }
  };

  const login = (username, password) => {
    const userCreds = CREDENTIALS[username.toLowerCase()];

    if (userCreds && userCreds.password === password) {
      const userData = { username, role: userCreds.role };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, userRole: user?.role }}>
      {children}
    </AuthContext.Provider>
  );
};
