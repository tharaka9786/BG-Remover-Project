export default function TermsOfService() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Terms of Service</h1>
      <div className="glass-panel" style={{ fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1rem' }}>Welcome to BGPhotoRemover. By using our service, you agree to the following terms.</p>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>1. Usage Rights</h3>
        <p style={{ marginBottom: '1rem' }}>
          You retain all rights to the images you upload. By processing images through our service, you grant us a temporary license solely to process and return the image to you.
        </p>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>2. Acceptable Use</h3>
        <p style={{ marginBottom: '1rem' }}>
          You agree not to use our service for any illegal activities or to upload content that violates any laws.
        </p>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>3. Liability</h3>
        <p>
          BGPhotoRemover is provided "as is" without any warranties. We are not liable for any damages resulting from the use of our service.
        </p>
      </div>
    </div>
  );
}
