export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>About BGPhotoRemover</h1>
      <div className="glass-panel" style={{ fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1rem' }}>
          BGPhotoRemover is a state-of-the-art AI tool designed to automatically remove backgrounds from your images in seconds.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Whether you're an e-commerce owner, a designer, or just someone looking to create a cool profile picture, our tool provides seamless background removal with pixel-perfect accuracy.
        </p>
        <p>
          We pride ourselves on offering high-resolution downloads, including HD, 2K, and 4K outputs, ensuring your final images look stunning on any display.
        </p>
      </div>
    </div>
  );
}
