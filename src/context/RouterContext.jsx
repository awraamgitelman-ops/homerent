import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
  // Normalize current browser path (convert any old hash URLs to clean paths)
  const getInitialPath = () => {
    if (typeof window !== 'undefined') {
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        const cleanFromHash = window.location.hash.replace(/^#/, '');
        try {
          window.history.replaceState(null, '', cleanFromHash || '/');
        } catch (e) {}
        return cleanFromHash || '/';
      }
      return window.location.pathname || '/';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    let cleanPath = String(path || '/').replace(/^#/, '');
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    try {
      if (window.location.pathname !== cleanPath) {
        window.history.pushState(null, '', cleanPath);
      }
    } catch (e) {}

    setCurrentPath(cleanPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
