# Team Launch Checklist

A small, dependency-free web app for tracking a product launch across four sections:
**Planning**, **Content**, **Approvals**, and **Launch Day**.

## Features

- Four pre-filled sections with a starter checklist for each
- Check items off; per-section counts and an overall progress bar update live
- Add your own tasks, or remove ones that don't apply
- Progress is saved automatically in your browser's `localStorage`
- **Export JSON** to share the checklist with a teammate, **Import JSON** to load it back
- **Reset** restores the default template

## Open it locally

The app is plain HTML/CSS/JS — no build step, no dependencies.

### Option 1: just open the file

Double-click `launch-checklist/index.html`, or from the repo root:

```bash
# macOS
open launch-checklist/index.html

# Windows (PowerShell)
Start-Process launch-checklist\index.html

# Linux
xdg-open launch-checklist/index.html
```

### Option 2: run a local server (recommended)

Serving over `http://` keeps `localStorage` stable across sessions and matches how it
would behave when hosted.

```bash
cd launch-checklist

# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then visit <http://localhost:8000>.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and the section template |
| `styles.css` | Dark theme and responsive card grid |
| `app.js` | Default checklist data, rendering, persistence, import/export |

## Customizing the default checklist

Edit the `DEFAULT_SECTIONS` array at the top of `app.js` to change section names or
starter tasks. Click **Reset** in the app to pick up your new defaults (this clears
saved progress).
