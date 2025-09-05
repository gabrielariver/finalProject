import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({ user, onLogout, rightSlot = null }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <>
      <nav className="nav">
        <div className="nav__brand">🎯 Hábitos & Rachas</div>
        <div className="nav__spacer" />
        
        {user ? (
          <div className="user-menu-container" ref={menuRef} style={{ position: 'relative' }}>
            <div className="user-info" onClick={toggleUserMenu}>
              <img 
                src={user.avatar_url || '/default-avatar.png'} 
                alt={user.name || user.username}
                className="user-avatar"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: 'white', marginRight: '8px', cursor: 'pointer' }}>
                {user.name || user.username}
              </span>
              <svg 
                className="dropdown-icon" 
                viewBox="0 0 24 24" 
                width="16" 
                height="16"
                style={{ fill: 'white', cursor: 'pointer' }}
              >
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
            
            {showUserMenu && (
              <div className="user-dropdown" style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  marginBottom: '8px'
                }}>
                  <img 
                    src={user.avatar_url || '/default-avatar.png'} 
                    alt={user.name || user.username}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      marginRight: '12px'
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                      {user.name || user.username}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      @{user.username}
                    </div>
                  </div>
                </div>
                
                <button 
                  className="logout-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e0e0e0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f5f5f5';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '8px' }}>
                    <path fill="currentColor" d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z"/>
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          rightSlot
        )}
      </nav>
    </>
  );
}
