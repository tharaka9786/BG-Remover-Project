"use client";
import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send this to an API
  };

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)', textAlign: 'center' }}>Contact Us</h1>
      <div className="glass-panel">
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Message Sent!</h3>
            <p>Thank you for reaching out. We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" className="input-field" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea className="input-field" rows="5" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
