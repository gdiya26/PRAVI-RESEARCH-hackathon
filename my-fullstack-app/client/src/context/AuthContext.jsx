import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const USERS = [
  {
    username: 'executive',
    password: 'executive123',
    name: 'Dr. P. K. Sharma, IAS',
    title: 'Department Secretary',
    department: 'Roads & Buildings Department',
    role: 'executive',
    roleLabel: 'Executive View (Secretary)',
    defaultRoute: '/executive',
    view: 'executive'
  },
  {
    username: 'engineer',
    password: 'engineer123',
    name: 'Rajesh Varma, SE',
    title: 'Chief Superintending Engineer',
    department: 'Public Works Department (PWD)',
    role: 'engineer',
    roleLabel: 'Engineer View (Technical)',
    defaultRoute: '/',
    view: 'engineer'
  }
];

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gov_portal_auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse auth user', e);
    }
    // Default to executive or null? Let's check: user asked "make a login page"
    return null;
  });

  const login = (username, password) => {
    const trimmedUser = (username || '').trim().toLowerCase();
    const matched = USERS.find(
      (u) => u.username.toLowerCase() === trimmedUser && u.password === password
    );

    if (matched) {
      setUser(matched);
      localStorage.setItem('gov_portal_auth_user', JSON.stringify(matched));
      localStorage.setItem('app_view_mode', matched.view);
      navigate(matched.defaultRoute);
      return { success: true, user: matched };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please verify your username and password.'
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gov_portal_auth_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
