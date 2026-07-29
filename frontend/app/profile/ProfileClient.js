"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileClient() {
  const { user, loading, setUser } = useAuth();
  const [name, setName] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      window.location.href = '/login';
    } else if (user) {
      setName(user.name || '');
    }
  }, [user, loading]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setUser({ ...user, name });
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card glass-effect" style={{ maxWidth: '500px', width: '100%', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(111, 66, 193, 0.3)' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>My Profile</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your account details</p>
            </div>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '1rem 1.5rem', borderRadius: '12px', textAlign: 'center', minWidth: '120px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Credits</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#ec4899' }}>✨</span> {user.credits !== undefined ? user.credits : '-'}
            </div>
          </div>
        </div>

        {message.text && (
          <div style={{ 
            padding: '1rem', borderRadius: '8px', textAlign: 'center',
            background: message.type === 'error' ? 'rgba(255, 75, 75, 0.1)' : 'rgba(32, 201, 151, 0.1)',
            color: message.type === 'error' ? '#ff4b4b' : '#20c997',
            border: `1px solid ${message.type === 'error' ? 'rgba(255, 75, 75, 0.2)' : 'rgba(32, 201, 151, 0.2)'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address (Cannot be changed)</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              value={user.email || ''} 
              disabled 
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="name" className="input-label">Display Name</label>
            <input 
              type="text" 
              id="name" 
              className="input-field" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your name"
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

      </div>
    </div>
  );
}
