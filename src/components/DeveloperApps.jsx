import React from 'react';
import { FaExternalLinkAlt, FaClipboardList, FaFont, FaKey, FaNewspaper, FaCode } from 'react-icons/fa';

const APPS = [
  {
    title: 'Code Formatter',
    description: 'Format your code snippets with a simple interface supporting multiple languages and themes.',
    url: 'https://devmint-tools.vercel.app/',
    tag: 'Developer',
    icon: <FaClipboardList size={22} className="app-icon-blue" />
  },
  {
    title: 'Word Utils',
    description: 'A handy suite of text and word utilities for quick formatting, cleanup, and content edits.',
    url: 'https://textmint.netlify.app/',
    tag: 'Text Helper',
    icon: <FaFont size={20} className="app-icon-purple" />
  },
  {
    title: 'Task Manager',
    description: 'Plan your day with a clean task board for creating, tracking, and completing daily to-dos.',
    url: 'https://taskmint-tools.vercel.app/',
    tag: 'Productivity',
    icon: <FaClipboardList size={22} className="app-icon-blue" />
  },
  {
    title: 'Password Manager',
    description: 'Generate secure passwords and manage them in a local vault with simple import/export support.',
    url: 'https://passgen-tools.vercel.app/',
    tag: 'Security',
    icon: <FaKey size={20} className="app-icon-emerald" />
  },
  {
    title: 'NewsPulse',
    description: 'Read latest headlines by category with a responsive news reader featuring bookmarks and dark mode.',
    url: 'https://getyournewspulse.netlify.app/',
    tag: 'Information',
    icon: <FaNewspaper size={20} className="app-icon-amber" />
  },
  {
    title: 'Bing Cypress Search',
    description: 'A Cypress automation project for validating Bing search flows and end-to-end browser scenarios.',
    url: 'https://github.com/rahilshah3105/bing-cypress-search',
    tag: 'Automation',
    icon: <FaCode size={20} className="app-icon-rose" />
  },
];

export default function DeveloperApps() {
  return (
    <div className="apps-page">
      <header className="apps-header">
        <h2>Recommended Apps</h2>
        <p>A curated list of external tools and platforms that pair nicely with your productivity stack.</p>
      </header>

      <div className="apps-grid">
        {APPS.map((app, idx) => (
          <a
            key={idx}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="app-card"
          >
            <div className="app-card-header">
              <div className="app-card-header-left">
                <div className="app-card-icon-wrapper">
                  {app.icon}
                </div>
                <div className="app-card-title-group">
                  <span className="app-card-tag">
                    {app.tag}
                  </span>
                  <h3 className="app-card-title">
                    {app.title}
                  </h3>
                </div>
              </div>
              <FaExternalLinkAlt size={14} className="app-card-external-icon" />
            </div>

            <p className="app-card-description">
              {app.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
