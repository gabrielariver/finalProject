import { useState } from 'react';

function getClientId(){
  let id = localStorage.getItem('clientId')
  if(!id){ id = crypto.randomUUID(); localStorage.setItem('clientId', id) }
  return id
}

const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function api(path, options={}){
  const res = await fetch(`${base}${path}`, {
    headers: { 
      'Content-Type':'application/json', 
      'X-Client-Id': getClientId(), 
      ...(options.headers||{}) 
    },
    credentials: 'include',
    ...options
  })
  
  if(!res.ok){
    let msg = 'Error'
    try{ 
      const errorData = await res.json();
      msg = errorData?.error || errorData?.message || msg;
    }catch{}
    
    if(res.status === 401) {
      msg = 'No autenticado. Por favor, inicia sesión.';
    }
    
    throw new Error(msg)
  }
  
  const ct = res.headers.get('content-type')||''
  return ct.includes('application/json') ? res.json() : res.text()
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (path, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api(path, options);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    request,
    loading,
    error,
    clearError,
  };
}
