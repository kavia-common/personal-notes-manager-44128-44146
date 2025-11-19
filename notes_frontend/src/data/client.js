const API_BASE = process.env.REACT_APP_API_BASE;

/**
 * Note data shape
 * { id: string, title: string, content: string, createdAt: number, updatedAt: number, favorite?: boolean, tags?: string[] }
 */

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// PUBLIC_INTERFACE
export function getPersistenceMode() {
  /** Returns 'api' if REACT_APP_API_BASE is truthy, otherwise 'local' */
  return API_BASE ? 'api' : 'local';
}

/* LocalStorage implementation */
const LS_KEY = 'notes.v1';
const Local = {
  // PUBLIC_INTERFACE
  async list() {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return arr;
  },
  // PUBLIC_INTERFACE
  async saveAll(notes) {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
    return true;
  },
  // PUBLIC_INTERFACE
  async upsert(note) {
    const arr = await Local.list();
    const idx = arr.findIndex((n) => n.id === note.id);
    if (idx >= 0) arr[idx] = note;
    else arr.unshift(note);
    await Local.saveAll(arr);
    return note;
  },
  // PUBLIC_INTERFACE
  async remove(id) {
    const arr = await Local.list();
    const next = arr.filter((n) => n.id !== id);
    await Local.saveAll(next);
    return true;
  }
};

/* Minimal API implementation (if backend exists, use standard REST shape) */
const Api = {
  base() { return API_BASE?.replace(/\/+$/, ''); },
  headers() {
    return { 'Content-Type': 'application/json' };
  },
  async handle(res) {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  },
  // PUBLIC_INTERFACE
  async list() {
    const res = await fetch(`${Api.base()}/notes`, { headers: Api.headers() });
    return Api.handle(res);
  },
  // PUBLIC_INTERFACE
  async upsert(note) {
    const method = note.id ? 'PUT' : 'POST';
    const url = note.id ? `${Api.base()}/notes/${encodeURIComponent(note.id)}` : `${Api.base()}/notes`;
    const res = await fetch(url, { method, headers: Api.headers(), body: JSON.stringify(note) });
    return Api.handle(res);
  },
  // PUBLIC_INTERFACE
  async remove(id) {
    const res = await fetch(`${Api.base()}/notes/${encodeURIComponent(id)}`, { method: 'DELETE', headers: Api.headers() });
    return Api.handle(res);
  }
};

// PUBLIC_INTERFACE
export function createNotesRepository() {
  if (getPersistenceMode() === 'api') {
    return {
      list: Api.list,
      upsert: Api.upsert,
      remove: Api.remove,
      mode: 'api'
    };
  }
  return {
    list: Local.list,
    upsert: Local.upsert,
    remove: Local.remove,
    mode: 'local'
  };
}

// PUBLIC_INTERFACE
export function createNote({ title = '', content = '' } = {}) {
  const now = Date.now();
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${now}-${Math.random().toString(36).slice(2)}`,
    title: title || 'Untitled',
    content,
    createdAt: now,
    updatedAt: now,
    favorite: false,
    tags: []
  };
}
