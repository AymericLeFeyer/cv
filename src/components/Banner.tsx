import { useState } from 'react';
import type { Profile } from '../types';
import { exportToPdfBlob } from '../utils/exportPdf';

export function Banner({ profile: _ }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);

  async function handlePdf() {
    if (loading) return;
    setLoading(true);
    // On ouvre la fenêtre de façon synchrone pour éviter le blocage popup de Safari iOS
    const newWindow = window.open('', '_blank');
    try {
      const url = await exportToPdfBlob('cv-print');
      if (newWindow) {
        newWindow.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch {
      newWindow?.close();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="banner">
      <span className="banner-label">Découvrez aussi mon profil sous d'autres formes</span>
      <div className="banner-links">
        <button onClick={handlePdf} className="banner-link banner-link--btn" style={{ opacity: loading ? 0.4 : 1 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          PDF
        </button>
        <span className="banner-dot">·</span>
        <a
          href="https://timelife.aymeric.lefeyer.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="banner-link"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Time Life
        </a>
        <span className="banner-dot">·</span>
        <a
          href="https://ayphone.aymeric.lefeyer.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="banner-link"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" />
          </svg>
          AyPhone
        </a>
      </div>
    </div>
  );
}
