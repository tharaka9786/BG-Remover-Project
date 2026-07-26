import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Free AI Background Remover - BGPhotoRemover",
  description: "Quickly edit photos online with AI-powered features. Remove backgrounds, add elements, retouch, and enhance images.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div>
            <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>BGPhotoRemover</a>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a href="/about" className="nav-link">About</a>
            <a href="/login" className="nav-link">Login</a>
            <a href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', marginLeft: '0.5rem' }}>Sign Up</a>
          </div>
        </nav>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
          <p>&copy; {new Date().getFullYear()} BGPhotoRemover. All rights reserved.</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <a href="/privacy-policy" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Privacy Policy</a>
            <a href="/terms-of-service" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Terms of Service</a>
            <a href="/contact" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contact Us</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
