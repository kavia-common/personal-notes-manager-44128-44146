import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteEditor displays and edits a note with autosave debounce and undo for unsaved changes.
 */
export default function NoteEditor({ note, onChange, onSave, onDelete, onToggleFav }) {
  const [draft, setDraft] = useState(note);
  const [lastSaved, setLastSaved] = useState(note);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    setDraft(note);
    setLastSaved(note);
  }, [note?.id]); // reset on switching notes

  useEffect(() => {
    setDraft(note);
  }, [note]);

  // Debounced autosave
  useEffect(() => {
    if (!draft) return;
    if (!onSave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const changed = hasChanges(lastSaved, draft);
      if (changed) {
        try {
          setSaving(true);
          const saved = await onSave(draft);
          setLastSaved(saved);
          setSaving(false);
        } catch (e) {
          setSaving(false);
        }
      }
    }, 600);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [draft, lastSaved, onSave]);

  const update = (patch) => {
    const next = { ...draft, ...patch, updatedAt: Date.now() };
    setDraft(next);
    onChange?.(next);
  };

  const undo = () => setDraft(lastSaved);

  if (!note) {
    return (
      <div className="panel" role="region" aria-label="Editor">
        <div className="panel-header">
          <strong>Editor</strong>
        </div>
        <div className="panel-body" style={{ color: '#6B7280' }}>
          Select a note to view or edit, or create a new note.
        </div>
      </div>
    );
  }

  return (
    <div className="panel" role="region" aria-label="Editor">
      <div className="panel-header">
        <div className="toolbar">
          <strong>Editor</strong>
          <span className="badge" aria-live="polite">{saving ? 'Saving…' : 'Saved'}</span>
        </div>
        <div className="toolbar">
          <button
            className="btn ghost"
            onClick={() => onToggleFav(note.id)}
            aria-label={note.favorite ? 'Unfavorite' : 'Favorite'}
          >
            {note.favorite ? '★ Favorited' : '☆ Favorite'}
          </button>
          <button className="btn ghost" onClick={undo} aria-label="Undo unsaved changes">↩ Undo</button>
          <button
            className="btn"
            onClick={() => onSave(draft)}
            aria-label="Save"
            title="Save"
          >💾 Save</button>
          <button
            className="btn secondary"
            onClick={() => { if (window.confirm('Delete this note?')) onDelete(note.id); }}
            aria-label="Delete"
          >🗑️ Delete</button>
        </div>
      </div>
      <div className="panel-body">
        <input
          className="input"
          value={draft.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Title"
          aria-label="Title"
        />
        <div style={{ height: 12 }} />
        <textarea
          className="textarea"
          value={draft.content}
          onChange={(e) => update({ content: e.target.value })}
          placeholder="Write your note..."
          aria-label="Content"
        />
      </div>
    </div>
  );
}

function hasChanges(a, b) {
  if (!a || !b) return false;
  return a.title !== b.title || a.content !== b.content || a.favorite !== b.favorite;
}
