import React, { useCallback, useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * NotesList renders a vertical list of notes with keyboard navigation.
 */
export default function NotesList({ notes, activeId, setActiveId, onDelete, onToggleFav }) {
  const listRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    const idx = notes.findIndex(n => n.id === activeId);
    if (e.key === 'ArrowDown') {
      const next = idx < notes.length - 1 ? notes[idx + 1]?.id : activeId;
      setActiveId(next);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      const prev = idx > 0 ? notes[idx - 1]?.id : activeId;
      setActiveId(prev);
      e.preventDefault();
    } else if (e.key === 'Delete') {
      if (activeId) onDelete(activeId);
    } else if (e.key.toLowerCase() === 'f' && (e.ctrlKey || e.metaKey)) {
      if (activeId) onToggleFav(activeId);
      e.preventDefault();
    }
  }, [notes, activeId, setActiveId, onDelete, onToggleFav]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="panel" role="region" aria-label="Notes list">
      <div className="panel-header">
        <strong>Notes</strong>
        <div className="badge">{notes.length}</div>
      </div>
      <div className="panel-body" ref={listRef} tabIndex={0}>
        {notes.length === 0 && <div style={{ color: '#6B7280' }}>No notes yet. Create one!</div>}
        <div role="list" aria-label="Notes">
          {notes.map(n => (
            <div
              key={n.id}
              role="listitem"
              className={`note-item ${activeId === n.id ? 'active' : ''}`}
              onClick={() => setActiveId(n.id)}
              onDoubleClick={() => setActiveId(n.id)}
              aria-selected={activeId === n.id}
            >
              <div>
                <div className="note-item-title">
                  {n.favorite ? '★ ' : ''}{n.title || 'Untitled'}
                </div>
                <div className="note-item-excerpt">{n.content?.slice(0, 100)}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="icon-btn"
                  title={n.favorite ? 'Unfavorite' : 'Favorite'}
                  aria-label={n.favorite ? 'Unfavorite' : 'Favorite'}
                  onClick={(e) => { e.stopPropagation(); onToggleFav(n.id); }}
                >{n.favorite ? '★' : '☆'}</button>
                <button
                  className="icon-btn"
                  title="Delete note"
                  aria-label="Delete note"
                  onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
