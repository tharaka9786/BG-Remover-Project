"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileClient() {
  const { user, loading, setUser } = useAuth();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      window.location.href = '/login';
    } else if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || null);
    }
  }, [user, loading]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = { name };
      if (avatar !== user.avatar) payload.avatar = avatar;
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setUser({ ...user, name, avatar: data.user.avatar || avatar });
        setCurrentPassword('');
        setNewPassword('');
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
            <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(111, 66, 193, 0.3)', overflow: 'hidden' }}>
              {avatar ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
              
              <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', textAlign: 'center', padding: '0.2rem 0', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}>
                Edit
              </label>
              <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>
            
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>My Profile</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your account details</p>
            </div>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '1rem 1.5rem', borderRadius: '16px', textAlign: 'center', minWidth: '140px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Available Credits</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textShadow: '0 2px 10px rgba(255,255,255,0.2)' }}>
              <span style={{ color: '#ec4899', filter: 'drop-shadow(0 0 8px rgba(236,72,153,0.6))' }}>✨</span> {user.credits !== undefined ? user.credits : '-'}
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

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }} />
          
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Change Password (Optional)</h3>

          <div className="input-group">
            <label htmlFor="currentPassword" className="input-label">Current Password</label>
            <input 
              type="password" 
              id="currentPassword" 
              className="input-field" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              placeholder="Leave blank to keep current"
            />
          </div>

          <div className="input-group">
            <label htmlFor="newPassword" className="input-label">New Password</label>
            <input 
              type="password" 
              id="newPassword" 
              className="input-field" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="Leave blank to keep current"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={isSaving}>
            {isSaving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </form>

      </div>
    </div>
  );
}
