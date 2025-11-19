import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Header renders the top app bar with brand and simple actions.
 */
export default function Header({ onNew, onToggleFavoriteFilter, favoriteFilterActive }) {
  return (
    <header className="header" role="banner">
      <div className="brand" aria-label="Personal Notes">
        <div className="logo" aria-hidden="true" />
        <div>
          <div style={{ fontSize: 18 }}>Personal Notes</div>
          <div style={{ fontSize: 12, color: '#4B5563' }}>Ocean Professional</div>
        </div>
      </div>
      <div className="toolbar" role="toolbar" aria-label="App actions">
        <button className="btn" onClick={onNew} aria-label="Create new note">＋ New Note</button>
        <button
          className="btn ghost"
          onClick={onToggleFavoriteFilter}
          aria-pressed={favoriteFilterActive}
          aria-label="Toggle favorites filter"
        >
          {favoriteFilterActive ? '★ Favorites' : '☆ Favorites'}
        </button>
      </div>
    </header>
  );
}
