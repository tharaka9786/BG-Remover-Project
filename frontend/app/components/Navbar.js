"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, loading, setUser } = useAuth();

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
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', 
                border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '50px',
                color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {user.name || 'User'}
            </button>

            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                <a href="/profile" className="nav-link" style={{ padding: '0.5rem', textAlign: 'left', borderRadius: '8px' }}>My Profile</a>
                <button onClick={handleLogout} style={{ padding: '0.5rem', textAlign: 'left', background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer', fontSize: '1rem', borderRadius: '8px' }}>Logout</button>
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
          background: 'var(--surface-color)', padding: '1.5rem 2rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
          <a href="/about" className="nav-link" style={{ textAlign: 'center', width: '100%', padding: '0.75rem' }} onClick={() => setIsOpen(false)}>About</a>
          
          {!loading && !user && (
            <>
              <a href="/login" className="nav-link" style={{ textAlign: 'center', width: '100%', padding: '0.75rem' }} onClick={() => setIsOpen(false)}>Login</a>
              <a href="/register" className="btn btn-primary" style={{ textAlign: 'center', margin: '0.5rem auto 0', width: '100%' }} onClick={() => setIsOpen(false)}>Sign Up</a>
            </>
          )}

          {!loading && user && (
            <>
              <a href="/profile" className="nav-link" style={{ textAlign: 'center', width: '100%', padding: '0.75rem' }} onClick={() => setIsOpen(false)}>My Profile</a>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ textAlign: 'center', margin: '0.5rem auto 0', width: '100%', color: '#ff4b4b', borderColor: '#ff4b4b' }} onClick={() => setIsOpen(false)}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
