import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Free AI Background Remover - BGPhotoRemover",
  description: "Quickly edit photos online with AI-powered features. Remove backgrounds, add elements, retouch, and enhance images.",
};

import { AuthProvider } from './context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
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
        </AuthProvider>
      </body>
    </html>
  );
}
