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

export default function AdBanner() {
  return null;
}

