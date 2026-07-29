"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, loading, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div>
        <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>BGPhotoRemover</a>
      </div>
      
      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        
        <button 
          onClick={toggleTheme}
          style={{ 
            background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)', 
            color: 'var(--text-primary)', width: '40px', height: '40px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'transform 0.3s ease', fontSize: '1.2rem'
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <a href="/about" className="nav-link">About</a>
        
        {!loading && !user && (
          <>
            <a href="/login" className="nav-link">Login</a>
            <a href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Sign Up</a>
          </>
        )}

        {!loading && user && (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="animate-slide-down"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 1rem 0.4rem 0.4rem', borderRadius: '50px',
                color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden' }}>
                {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
              </div>
              <span>Welcome, <strong>{user.name || 'User'}</strong>!</span>
            </button>

            {dropdownOpen && (
              <div className="animate-slide-down" style={{ position: 'absolute', top: '120%', right: 0, background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '180px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 10 }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Credits Remaining</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{user.credits !== undefined ? user.credits : '-'}</div>
                </div>
                <a href="/profile" className="nav-link" style={{ padding: '0.75rem 1rem', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>👤 My Profile</a>
                <button onClick={handleLogout} style={{ padding: '0.75rem 1rem', textAlign: 'left', background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer', fontSize: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,75,75,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>🚪 Logout</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        className={`mobile-menu-btn menu-icon-btn ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}
        aria-label="Toggle menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="mobile-dropdown animate-slide-down" style={{ 
          position: 'absolute', top: '100%', left: 0, right: 0, 
          background: 'var(--surface-color)', padding: '1.5rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
          {!loading && user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden' }}>
                {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Welcome, {user.name || 'User'}!</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '600' }}>✨ {user.credits !== undefined ? user.credits : '-'} Credits Remaining</div>
              </div>
            </div>
          )}

          <a href="/about" className="nav-link" style={{ textAlign: 'left', width: '100%', padding: '0.75rem' }} onClick={() => setIsOpen(false)}>About BGPhotoRemover</a>
          
          <button 
            onClick={toggleTheme}
            className="btn"
            style={{ textAlign: 'left', width: '100%', border: '1px solid var(--border-color)', justifyContent: 'flex-start', paddingLeft: '1rem', background: 'transparent', color: 'var(--text-primary)' }}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          
          {!loading && !user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <a href="/login" className="btn" style={{ textAlign: 'center', width: '100%', border: '1px solid var(--border-color)' }} onClick={() => setIsOpen(false)}>Login</a>
              <a href="/register" className="btn btn-primary" style={{ textAlign: 'center', width: '100%' }} onClick={() => setIsOpen(false)}>Sign Up</a>
            </div>
          )}

          {!loading && user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="/profile" className="btn" style={{ textAlign: 'left', width: '100%', border: '1px solid var(--border-color)', justifyContent: 'flex-start', paddingLeft: '1rem' }} onClick={() => setIsOpen(false)}>👤 My Profile</a>
              <button 
                onClick={(e) => {
                  setIsOpen(false);
                  handleLogout(e);
                }} 
                className="btn" 
                style={{ textAlign: 'left', width: '100%', border: '1px solid #ff4b4b', color: '#ff4b4b', justifyContent: 'flex-start', paddingLeft: '1rem' }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
