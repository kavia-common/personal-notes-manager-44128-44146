import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation. Tags are optional and non-functional placeholders for now.
 */
export default function Sidebar({ section, setSection }) {
  const items = [
    { id: 'all', label: 'All Notes', icon: '🗒️' },
    { id: 'favorites', label: 'Favorites', icon: '⭐' },
    { id: 'tags', label: 'Tags', icon: '🏷️' }
  ];
  return (
    <aside className="sidebar" aria-label="Sidebar">
      {items.map(it => (
        <div
          key={it.id}
          role="button"
          tabIndex={0}
          className={`nav-item ${section === it.id ? 'active' : ''}`}
          onClick={() => setSection(it.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSection(it.id)}
          aria-current={section === it.id ? 'page' : undefined}
        >
          <span aria-hidden="true">{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
      <div className="separator" style={{ margin: '8px 0' }} />
      <div className="badge">API mode: {process.env.REACT_APP_API_BASE ? 'API' : 'Local'}</div>
    </aside>
  );
}
