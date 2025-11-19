# Notes Frontend – Ocean Professional

A lightweight React client for personal notes with a split-view layout and the Ocean Professional theme.

## Features
- Create, view, edit, delete notes
- Search/filter by title/content
- Favorite notes and filter favorites
- Keyboard navigation in notes list (Arrow Up/Down, Delete, Ctrl/Cmd+F for favorite toggle)
- Autosave and manual Save, undo for unsaved edits
- Persistence via API if `REACT_APP_API_BASE` is set, else localStorage

## Running
- `npm start` — dev server at http://localhost:3000

## Persistence Modes
The app selects persistence at runtime:
- API mode: if `REACT_APP_API_BASE` is defined and non-empty.
  - Endpoints expected:
    - GET `${REACT_APP_API_BASE}/notes` -> returns array of notes
    - POST `${REACT_APP_API_BASE}/notes` -> creates note
    - PUT `${REACT_APP_API_BASE}/notes/:id` -> updates note
    - DELETE `${REACT_APP_API_BASE}/notes/:id` -> deletes note
- Local mode: if `REACT_APP_API_BASE` is empty/undefined.
  - Notes stored in `localStorage` under `notes.v1`

You can see the current mode in the sidebar badge.

## Environment Variables
The app reads these env vars (prefixed with REACT_APP_):
- `API_BASE` (preferred for persistence switching)
- `BACKEND_URL`, `FRONTEND_URL`, `WS_URL`, `NODE_ENV`, `ENABLE_SOURCE_MAPS`,
  `PORT`, `LOG_LEVEL`, `HEALTHCHECK_PATH`, `FEATURE_FLAGS`, `EXPERIMENTS_ENABLED`

Set them in the container .env; CRA exposes vars beginning with `REACT_APP_`.

## Theming
Theme tokens live in `src/theme.css`. Colors:
- primary #2563EB, secondary/success #F59E0B, error #EF4444
- background #f9fafb, surface #ffffff, text #111827

Focus rings, radii, and shadows are consistent across components.

## Notes Shape
```
{
  id: string,
  title: string,
  content: string,
  createdAt: number,
  updatedAt: number,
  favorite?: boolean,
  tags?: string[]
}
```

## Testing
A basic smoke test is included in `src/App.test.js`.

