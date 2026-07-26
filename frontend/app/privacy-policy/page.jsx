export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Privacy Policy</h1>
      <div className="glass-panel" style={{ fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>1. Data Collection</h3>
        <p style={{ marginBottom: '1rem' }}>
          We only collect the data necessary to provide you with our background removal services, which includes the images you upload and basic account information if you choose to register.
        </p>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>2. Data Usage</h3>
        <p style={{ marginBottom: '1rem' }}>
          Your uploaded images are processed temporarily and are not used to train our AI models without your explicit consent. Images are automatically deleted from our servers shortly after processing.
        </p>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>3. Security</h3>
        <p>
          We take the security of your data seriously and implement industry-standard encryption for data transmission and storage.
        </p>
      </div>
    </div>
  );
}
