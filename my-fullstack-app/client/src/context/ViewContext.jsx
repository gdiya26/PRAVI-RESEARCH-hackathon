import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewContext = createContext({
  view: 'engineer',
  setView: () => {},
  switchView: () => {}
});

export function ViewProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('app_view_mode');
    if (saved === 'executive' || saved === 'engineer') return saved;
    // Default based on current URL path
    return window.location.pathname.startsWith('/executive') ? 'executive' : 'engineer';
  });

  // Sync view mode when path explicitly targets executive or engineer dashboard
  useEffect(() => {
    if (location.pathname.startsWith('/executive')) {
      setView('executive');
      localStorage.setItem('app_view_mode', 'executive');
    }
  }, [location.pathname]);

  const switchView = (newView) => {
    setView(newView);
    localStorage.setItem('app_view_mode', newView);
    if (newView === 'executive') {
      navigate('/executive');
    } else {
      navigate('/');
    }
  };

  return (
    <ViewContext.Provider value={{ view, setView, switchView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  return useContext(ViewContext);
}

export default ViewContext;
