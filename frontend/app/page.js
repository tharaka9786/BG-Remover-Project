"use client";
import React, { useState } from 'react';
import ImageComparison from './components/ImageComparison';

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolution, setResolution] = useState("original");
  const [dragActive, setDragActive] = useState(false);

  const processFilesSelection = (files) => {
    if (!files || files.length === 0) return;
    
    let filesArr = Array.from(files);
    if (filesArr.length > 5) {
      alert("You can only upload a maximum of 5 images at once. Using the first 5.");
      filesArr = filesArr.slice(0, 5);
    }
    
    setSelectedFiles(filesArr);
    setProcessedImages([]); // Reset processed view
    setActiveIndex(0);
  };

  const handleFileChange = (e) => {
    processFilesSelection(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      processFilesSelection(e.dataTransfer.files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    
    try {
      // Process all images in parallel
      const results = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("resolution", resolution);

          try {
            const response = await fetch(`/api/remove-bg`, {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const blob = await response.blob();
              return {
                name: file.name,
                originalUrl: URL.createObjectURL(file),
                processedUrl: URL.createObjectURL(blob),
              };
            } else {
              console.error(`Failed to process ${file.name}`);
              return null;
            }
          } catch (err) {
            console.error(`Network error for ${file.name}:`, err);
            return null;
          }
        })
      );

      const successfulResults = results.filter(r => r !== null);
      
      if (successfulResults.length > 0) {
        setProcessedImages(successfulResults);
        setActiveIndex(0); // Show first image by default
      } else {
        alert("Error processing images. Make sure the Python backend is running.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Make sure the Python backend is running on port 8000.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Text Section */}
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Free AI image enhancer.
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', maxWidth: '800px', margin: '0 auto' }}>
          Quickly edit photos online with AI-powered features. Remove backgrounds, add elements, retouch, and enhance images.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          *Some AI-powered features require generative credits.
        </p>
      </div>

      {processedImages.length === 0 ? (
        <>
          {/* Animated Hero Image Section */}
          <div style={{ position: 'relative', margin: '3rem 0', width: '300px', height: '300px' }}>
            <div style={{ 
              width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', zIndex: 2 
            }}>
              <img 
                src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Woman eating ice cream" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            {/* Floating Badge 1 */}
            <div className="animate-float" style={{ 
              position: 'absolute', top: '40%', right: '-40px', zIndex: 3,
              background: '#000', color: '#fff', padding: '0.5rem 1rem', 
              borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)'
            }}>
              Remove background
            </div>

            {/* Floating Badge 2 (App Icon) */}
            <div className="animate-float-delayed" style={{ 
              position: 'absolute', bottom: '10%', left: '-20px', zIndex: 3,
              background: '#1e1e1e', width: '60px', height: '60px', 
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4L28 26H4L16 4Z" fill="url(#paint0_linear)"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="16" y1="4" x2="16" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f43f5e"/>
                    <stop offset="0.5" stopColor="#a855f7"/>
                    <stop offset="1" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Upload Box Section */}
          <div 
            style={{ 
              width: '100%', maxWidth: '700px', margin: '2rem 2rem 4rem 2rem', padding: '1rem',
              background: 'var(--surface-color)', borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}
          >
            <div 
              className={`drag-drop-box ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                Drag and drop up to 5 images <br/>
                <span style={{ color: 'var(--primary-color)' }}>or browse to upload.</span>
              </h2>

              <label 
                htmlFor="file-upload" 
                className="btn btn-primary"
                style={{ padding: '1rem 3rem', fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1rem' }}
              >
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} image(s) selected` 
                  : "Upload your photo(s)"}
              </label>
              <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                multiple
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />

              {/* Show selected file names if any */}
              {selectedFiles.length > 0 && (
                <div style={{ margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'left', maxWidth: '300px', marginInline: 'auto' }}>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {selectedFiles.map((f, i) => (
                      <li key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        ✓ {f.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem', marginTop: selectedFiles.length > 0 ? '0' : '2rem' }}>
                File must be JPEG, JPG, PNG or WebP and less than 40MB
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#ec4899' }}>✔</span> Free to use
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#ec4899' }}>✔</span> No credit card required
                </span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4rem' }}>
            By uploading your image or video, you agree to the BGPhotoRemover <a href="/terms-of-service">Terms of use</a> and <a href="/privacy-policy">Privacy Policy</a>
          </p>

          {/* Action Button if File Selected */}
          {selectedFiles.length > 0 && (
            <div style={{ marginBottom: '4rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select 
                className="input-field" 
                value={resolution} 
                onChange={(e) => setResolution(e.target.value)}
                style={{ cursor: 'pointer', width: 'auto', display: 'inline-block' }}
              >
                <option value="original">Original Size</option>
                <option value="HD">HD (1080p)</option>
                <option value="2K">2K</option>
                <option value="4K">4K</option>
              </select>

              <button 
                className="btn btn-primary" 
                style={{ opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                onClick={handleUpload}
                disabled={isProcessing}
              >
                {isProcessing ? `Processing ${selectedFiles.length} image(s)...` : "Remove Background Now"}
              </button>
            </div>
          )}

          {/* How To Section */}
          <div className="bg-gradient-banner" style={{ width: '100%', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
              How to improve your photo with the AI image enhancer.
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px' }}>
              
              <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', color: 'var(--text-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2rem' }}>↑</div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Select image.</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Add images from your device or browse thousands of free stock images to find the perfect photo for your project.</p>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', color: 'var(--text-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2rem' }}>✨</div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Enhance photos.</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Select your photo, then use the picture enhancer tools within our photo editor to auto enhance, remove backgrounds, and more.</p>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', color: 'var(--text-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2rem' }}>✏️</div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Continue editing.</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Instantly download your newly enhanced photo to share with your friends, family, and followers, or keep editing.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      ) : (
        <div style={{ maxWidth: '900px', margin: '4rem auto', width: '100%', padding: '0 2rem' }}>
          
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Before & After ({activeIndex + 1} of {processedImages.length})
          </h3>
          
          {/* Main Viewer for the active image */}
          <ImageComparison 
            beforeImage={processedImages[activeIndex].originalUrl} 
            afterImage={processedImages[activeIndex].processedUrl} 
          />
          
          {/* Thumbnail Gallery */}
          {processedImages.length > 1 && (
            <div style={{ 
              marginTop: '2rem', display: 'flex', gap: '1rem', overflowX: 'auto', 
              padding: '1rem', background: 'var(--surface-color)', borderRadius: '16px',
              border: '1px solid var(--border-color)', justifyContent: 'center'
            }}>
              {processedImages.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    width: '80px', height: '80px', borderRadius: '8px', cursor: 'pointer',
                    overflow: 'hidden', border: activeIndex === idx ? '3px solid var(--primary-color)' : '3px solid transparent',
                    transition: 'border 0.2s', opacity: activeIndex === idx ? 1 : 0.6
                  }}
                  title={img.name}
                >
                  <img 
                    src={img.processedUrl} 
                    alt={`Thumbnail ${idx}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button 
              className="btn" 
              style={{ background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              onClick={() => {
                setSelectedFiles([]);
                setProcessedImages([]);
              }}
            >
              Upload More
            </button>
            <a 
              href={processedImages[activeIndex].processedUrl} 
              download={`bg-removed-${resolution}-${processedImages[activeIndex].name}`}
              className="btn btn-primary"
            >
              Download Current Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
