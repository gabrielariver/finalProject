import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar estado de autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/user`, {
        credentials: 'include', // Importante para enviar cookies de sesión
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      setError('Error verificando autenticación');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Redirigir a la autenticación OAuth
    window.location.href = `${API_URL}/auth/github`;
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUser(null);
        // Opcional: redirigir a página de login
        window.location.reload();
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (err) {
      console.error('Error during logout:', err);
      setError('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    clearError,
    isAuthenticated: !!user,
  };
};
