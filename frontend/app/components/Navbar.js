"use client";
import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div>
        <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>BGPhotoRemover</a>
      </div>
      
      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <a href="/about" className="nav-link">About</a>
        <a href="/login" className="nav-link">Login</a>
        <a href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', marginLeft: '0.5rem' }}>Sign Up</a>
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
          <a href="/login" className="nav-link" style={{ textAlign: 'center', width: '100%', padding: '0.75rem' }} onClick={() => setIsOpen(false)}>Login</a>
          <a href="/register" className="btn btn-primary" style={{ textAlign: 'center', margin: '0.5rem auto 0', width: '100%' }} onClick={() => setIsOpen(false)}>Sign Up</a>
        </div>
      )}
    </nav>
  );
}
