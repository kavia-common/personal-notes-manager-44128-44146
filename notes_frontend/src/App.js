import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './theme.css';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import { ToastProvider, useToasts } from './components/Toasts';
import { createNotesRepository, createNote } from './data/client';

/**
/ PUBLIC_INTERFACE
/ App entry: renders the notes application using the Ocean Professional theme.
/ - Provides layout: header, sidebar, split view (list + editor).
/ - Features: create/view/edit/delete notes, search/filter, favorites.
/ - Persistence: API if REACT_APP_API_BASE is set, otherwise localStorage.
/ - Accessibility: keyboard navigation for list, focus styles, ARIA roles.
*/
function AppShell() {
  const repo = useMemo(() => createNotesRepository(), []);
  const { push } = useToasts();

  const [section, setSection] = useState('all');
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const activeNote = useMemo(() => notes.find(n => n.id === activeId) || null, [notes, activeId]);

  const load = useCallback(async () => {
    try {
      const list = await repo.list();
      // Ensure newest first by updatedAt desc if available
      list.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
      setNotes(list);
      if (list.length && !activeId) setActiveId(list[0].id);
    } catch (e) {
      push(`Failed to load notes: ${e.message}`, { type: 'error', timeout: 4000 });
    }
  }, [repo, activeId, push]);

  useEffect(() => { load(); }, [load]);

  // PUBLIC_INTERFACE
  const createNew = async () => {
    const n = createNote({ title: 'Untitled', content: '' });
    try {
      const saved = await repo.upsert(n);
      setNotes(prev => [saved, ...prev]);
      setActiveId(saved.id);
      push('Note created');
    } catch (e) {
      push(`Create failed: ${e.message}`, { type: 'error' });
    }
  };

  // PUBLIC_INTERFACE
  const saveNote = async (note) => {
    try {
      const saved = await repo.upsert(note);
      setNotes(prev => {
        const idx = prev.findIndex(x => x.id === saved.id);
        const next = [...prev];
        if (idx >= 0) next[idx] = saved;
        else next.unshift(saved);
        // sort by updatedAt desc
        next.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
        return next;
      });
      return saved;
    } catch (e) {
      push(`Save failed: ${e.message}`, { type: 'error', timeout: 4000 });
      throw e;
    }
  };

  // PUBLIC_INTERFACE
  const deleteNote = async (id) => {
    try {
      await repo.remove(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      if (activeId === id) {
        setActiveId(notes.find(n => n.id !== id)?.id || null);
      }
      push('Note deleted');
    } catch (e) {
      push(`Delete failed: ${e.message}`, { type: 'error' });
    }
  };

  // PUBLIC_INTERFACE
  const toggleFavorite = async (id) => {
    const n = notes.find(x => x.id === id);
    if (!n) return;
    await saveNote({ ...n, favorite: !n.favorite, updatedAt: Date.now() });
  };

  // Derived filtered view
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = notes;
    if (favoriteFilter || section === 'favorites') {
      list = list.filter(n => n.favorite);
    }
    if (q) {
      list = list.filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [notes, query, favoriteFilter, section]);

  return (
    <div className="app-shell">
      <Header
        onNew={createNew}
        onToggleFavoriteFilter={() => setFavoriteFilter(x => !x)}
        favoriteFilterActive={favoriteFilter}
      />
      <main className="main">
        <Sidebar section={section} setSection={setSection} />
        <div className="content" role="main">
          <div className="panel" role="region" aria-label="List panel">
            <div className="panel-header">
              <SearchBar query={query} setQuery={setQuery} />
              <div className="toolbar">
                <button className="icon-btn" onClick={createNew} title="New note" aria-label="New note">＋</button>
              </div>
            </div>
            <div className="panel-body">
              <NotesList
                notes={filtered}
                activeId={activeId}
                setActiveId={setActiveId}
                onDelete={deleteNote}
                onToggleFav={toggleFavorite}
              />
            </div>
          </div>
          <NoteEditor
            note={activeNote}
            onChange={(n) => setNotes(prev => prev.map(x => x.id === n.id ? n : x))}
            onSave={saveNote}
            onDelete={deleteNote}
            onToggleFav={toggleFavorite}
          />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}
