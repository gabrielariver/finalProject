import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (res.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        setError(null);                
        return;
      }

      if (!res.ok) throw new Error('network');

      const data = await res.json();
      setUser(data.user || null);
      setIsAuthenticated(!!data.authenticated);
      setError(null);
    } catch (err) {
      setError('Error de conexión con el servidor');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

const logout = async () => {
  try {
    setLoading(true);
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include' 
    });
  } catch (err) {
    console.error('Error during logout:', err);
  } finally {
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }
};

  const clearError = () => setError(null);

  useEffect(() => { checkAuthStatus(); }, []);

  return { user, loading, error, login, logout, isAuthenticated, clearError };
}
