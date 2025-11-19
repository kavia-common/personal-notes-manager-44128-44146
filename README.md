# personal-notes-manager-44128-44146

This workspace contains the Notes Frontend (React) implementing a split-view notes UI with the Ocean Professional theme.

Preview runs on port 3000. Persistence:
- If `REACT_APP_API_BASE` is set in the environment, the app persists notes to that backend.
- If not set, it stores notes in `localStorage` (no backend required).