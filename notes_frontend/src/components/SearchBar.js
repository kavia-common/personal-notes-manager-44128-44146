import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchBar for filtering notes by title/content.
 */
export default function SearchBar({ query, setQuery }) {
  return (
    <input
      className="input"
      placeholder="Search notes..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Search notes"
    />
  );
}
