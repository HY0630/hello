# Team Launch Checklist

A single-file web app for tracking a product launch across four sections: **Planning**, **Content**, **Approvals**, and **Launch Day**.

No build step, no dependencies, no server required — it's one HTML file.

## Features

- Four preloaded sections with sensible default tasks
- Check items off, with per-section counts and an overall progress bar
- Assign an owner to any task
- Add your own tasks or remove ones you don't need
- Progress saves automatically in your browser (`localStorage`)
- Export / import the checklist as JSON so you can share it or move it between machines
- Print-friendly view for meetings
- "Reset checkboxes" clears completion; "Restore defaults" rebuilds the whole checklist

## Open it locally

### Option 1 — just open the file (easiest)

Clone the repo and double-click `launch-checklist/index.html`, or open it from the terminal:

```bash
git clone https://github.com/HY0630/hello.git
cd hello/launch-checklist
```

Then:

- **Windows:** `start index.html`
- **macOS:** `open index.html`
- **Linux:** `xdg-open index.html`

### Option 2 — serve it over a local web server

Some browsers treat `file://` pages restrictively. If anything misbehaves, serve the folder instead:

```bash
cd hello/launch-checklist

# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then visit <http://localhost:8000> in your browser.

## Saving and sharing your progress

Data lives in your own browser, so teammates won't see your checkmarks automatically. To share:

1. Click **Export JSON** to download `launch-checklist.json`.
2. Send that file to a teammate (or commit it to the repo).
3. They click **Import JSON** and pick the file.

## Customizing the default tasks

Open `index.html` and edit the `DEFAULTS` array near the top of the `<script>` block. Each section has an `id`, a `title`, and a list of task strings. After editing, click **Restore defaults** in the app to load your new list.
