# Commonplace

Commonplace is Ryan's private learning library: a quiet, structured home for technical review, reading notes, projects, and durable ideas.

## What is included

- A Gruvbox-inspired dark interface with responsive desktop and mobile navigation.
- Technical and personal libraries, each composed from reusable collections and notes.
- Rich note blocks for prose, formulas, diagrams, tables, callouts, code, checklists, active recall, and sources.
- A keyboard-accessible library search (`Cmd/Ctrl + K`).
- Container packaging for ARM64 Raspberry Pi and x86-64 hosts.
- A Tailscale Serve deployment that keeps the web app off the public internet.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content architecture

All library structure and note content lives in `content/library.ts`. The UI reads the same typed model for navigation, search, library pages, note pages, related content, and sources. Adding a collection or note does not require a new page component.

The main layers are:

- `content/library.ts` — library, collection, note, block, and source data.
- `components/AppShell.tsx` — navigation, responsive shell, and search.
- `components/LibraryUI.tsx` — reusable collection and note cards.
- `components/NoteRenderer.tsx` — reusable rich learning blocks.
- `app/` — route composition and metadata.

## Checks

```bash
npm run lint
npm test
```

## Raspberry Pi deployment

See [`docs/raspberry-pi.md`](docs/raspberry-pi.md) for the complete Docker Compose and Tailscale-only setup.
