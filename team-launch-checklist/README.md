# Team Launch Checklist

A single-file web app for tracking a product or feature launch across four sections:

- **Planning** — goals, dates, owners, dependencies, risks
- **Content** — announcement, assets, site, docs, enablement
- **Approvals** — legal, brand, security, pricing, exec go/no-go
- **Launch Day** — ship, publish, notify, monitor, recap

## Features

- Check items off with a live progress bar and per-section counts
- Assign an owner to any task
- Add your own tasks to any section, or remove ones you don't need
- Everything is saved to your browser's `localStorage`, so it persists between visits
- **Export JSON** to download the current checklist state
- **Print** for a paper or PDF copy
- **Reset all** to restore the default tasks

No build step, no dependencies, no network access required.

## Open it locally

### Option 1 — just open the file

Clone the repo and open the HTML file in your browser:

```bash
git clone https://github.com/HY0630/hello.git
cd hello/team-launch-checklist
open index.html          # macOS
# xdg-open index.html    # Linux
# start index.html       # Windows
```

You can also double-click `index.html` in your file browser.

### Option 2 — serve it over localhost

Some browsers treat `file://` pages conservatively. If you prefer a local server:

```bash
cd hello/team-launch-checklist
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

With Node.js installed you can instead run:

```bash
npx serve .
```

## Notes

- Data is stored per browser and per origin. Opening via `file://` and via `http://localhost:8000` will keep **separate** checklists.
- To share progress with teammates, use **Export JSON** and send the file, or commit it to the repo.
- To change the default tasks, edit the `DEFAULT_DATA` array near the top of the `<script>` block in `index.html`, then click **Reset all**.
