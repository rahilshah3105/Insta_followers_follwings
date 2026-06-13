import React, { useEffect, useRef } from 'react';

function loadAdSenseScript(client) {
  if (!client || typeof document === 'undefined') {
    return;
  }

  // Prevent loading the script multiple times
  const existingScript = document.querySelector('script[data-instamint-adsense="true"]');
  if (existingScript) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.setAttribute('data-ad-client', client);
  script.setAttribute('data-instamint-adsense', 'true');
  document.head.appendChild(script);
}

export default function AdBanner({ client, slot, mode = 'light', className = '', ariaLabel = 'Advertisement', minHeight = '90px' }) {
  const adRef = useRef(null);

  useEffect(() => {
    // Only push ads if keys are present
    if (!client || !slot || typeof window === 'undefined') {
      return;
    }

    loadAdSenseScript(client);

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      // Ad scripts can fail silently in dev or without a valid account.
      console.warn('Google AdSense error or blocked:', e);
    }
  }, [client, slot]);

  // Fallback / Placeholder when environment variables are missing or are placeholder values
  const isPlaceholder = !client || !slot || client.includes('YOUR_PUBLISHER_ID') || slot === '1234567890' || slot === '0987654321';

  if (isPlaceholder) {
    return (
      <div
        className={`ad-banner ad-banner--placeholder ${className}`.trim()}
        role="note"
        aria-label={ariaLabel}
        style={{
          border: `1px dashed ${mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
          borderRadius: '16px',
          padding: '16px',
          minHeight,
          background: mode === 'dark' ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : '#718096',
          maxWidth: '728px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          margin: '1.5rem auto',
          boxShadow: mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.2)' : '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
        }}
      >
        <strong style={{ display: 'block', marginBottom: '4px', color: mode === 'dark' ? '#fff' : '#2d3748' }}>
          Ad Space Reserved
        </strong>
        <span style={{ fontSize: '12px' }}>
          Configure `VITE_ADSENSE_CLIENT_ID` and slots in your environment to load live ads.
        </span>
      </div>
    );
  }

  // Live Google Ad
  return (
    <div className={`ad-banner ${className}`.trim()} aria-label={ariaLabel} style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '1.5rem auto' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight, width: '100%', maxWidth: '728px' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
