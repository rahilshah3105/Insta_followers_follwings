import React from 'react';
import { FaShieldAlt, FaCookieBite, FaUserLock, FaRegClock, FaHeart } from 'react-icons/fa';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <div className="privacy-title-group">
          <FaShieldAlt className="privacy-header-icon" />
          <h1>Privacy Policy</h1>
        </div>
        <p className="privacy-subtitle">
          Last Updated: June 2026. Your privacy and data security are our top priorities.
        </p>
      </header>

      <div className="privacy-content">
        {/* Section 1: Overview */}
        <section className="privacy-section">
          <h2>
            <FaUserLock className="section-icon" /> 1. Overview & Data Privacy
          </h2>
          <p>
            Welcome to <strong>InstaMint</strong> (Instagram Connections Analyzer). We are committed to protecting your personal information. 
            Because InstaMint operates as a <strong>purely client-side application</strong>, your uploaded files, processed connections data, and settings are parsed and handled entirely in your browser. 
            <strong>We do not upload, store, or transmit your Instagram data, usernames, or account lists to any external servers or databases.</strong> Your data remains strictly on your device.
          </p>
        </section>

        {/* Section 2: Google AdSense and Cookies */}
        <section className="privacy-section">
          <h2>
            <FaCookieBite className="section-icon" /> 2. Google AdSense & Cookies
          </h2>
          <div className="section-body">
            <p>
              We integrate third-party advertising services provided by Google AdSense to monetize our site. In compliance with Google AdSense policies, please note the following:
            </p>
            <ul>
              <li>
                Google and other third-party vendors use cookies to serve ads based on a user's prior visits to this or other websites.
              </li>
              <li>
                Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="privacy-link-item">Google Ads Settings</a> page or <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="privacy-link-item">www.aboutads.info</a>.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Data Storage */}
        <section className="privacy-section">
          <h2>
            <FaRegClock className="section-icon" /> 3. Data Storage & Local Persistence
          </h2>
          <p>
            Any buffered lists or status configurations are stored locally in your browser's <code className="privacy-code">localStorage</code>. 
            This data will remain on your machine to save you from re-uploading files on subsequent visits. 
            Clearing your browser cache or site data will completely wipe this local storage. You can also purge all local data instantly at any time by clicking the <strong>"Reset & Upload New Folder"</strong> button on the dashboard.
          </p>
        </section>

        {/* Section 4: Consent */}
        <section className="privacy-section">
          <h2>4. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </section>
      </div>

      <div className="privacy-footer-badge">
        <div className="india-badge">
          <span>Made with</span>
          <FaHeart className="heart-icon pulsing" />
          <span>in India</span>
        </div>
      </div>
    </div>
  );
}
