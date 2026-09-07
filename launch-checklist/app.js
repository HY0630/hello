const STORAGE_KEY = 'team-launch-checklist/v1';

const DEFAULT_SECTIONS = [
  {
    id: 'planning',
    title: 'Planning',
    tasks: [
      'Define launch goal and success metrics',
      'Confirm launch date and freeze window',
      'Name the DRI for each workstream',
      'List target audiences and channels',
      'Write the risk / rollback plan'
    ]
  },
  {
    id: 'content',
    title: 'Content',
    tasks: [
      'Draft announcement blog post',
      'Write release notes and changelog',
      'Prepare social and email copy',
      'Produce screenshots, demo video, and assets',
      'Update docs and in-product help'
    ]
  },
  {
    id: 'approvals',
    title: 'Approvals',
    tasks: [
      'Engineering sign-off on release build',
      'Design review of final assets',
      'Legal and brand review of copy',
      'Security / privacy review complete',
      'Exec go / no-go recorded'
    ]
  },
  {
    id: 'launch-day',
    title: 'Launch Day',
    tasks: [
      'Deploy release and verify smoke tests',
      'Publish blog, social, and email',
      'Enable feature flags for all users',
      'Staff support channels and monitoring',
      'Post-launch retro scheduled'
    ]
  }
];

function newId() {
  return 'a' + Math.random().toString(36).slice(2, 10);
}

function seedState() {
  return {
    sections: DEFAULT_SECTIONS.map(s => ({
      id: s.id,
      title: s.title,
      tasks: s.tasks.map(text => ({ id: newId(), text, done: false }))
    }))
  };
}

function isValidState(value) {
  return Boolean(
    value &&
    Array.isArray(value.sections) &&
    value.sections.every(s =>
      s && typeof s.title === 'string' && Array.isArray(s.tasks) &&
      s.tasks.every(t => t && typeof t.text === 'string')
    )
  );
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!isValidState(parsed)) return seedState();
    parsed.sections.forEach(s => {
      s.id = s.id || newId();
      s.tasks.forEach(t => {
        t.id = t.id || newId();
        t.done = Boolean(t.done);
      });
    });
    return parsed;
  } catch (err) {
    console.warn('Could not read saved checklist, starting fresh.', err);
    return seedState();
  }
}

let state = loadState();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save checklist.', err);
  }
}

const board = document.getElementById('board');
const template = document.getElementById('section-template');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');

function renderProgress() {
  const all = state.sections.flatMap(s => s.tasks);
  const done = all.filter(t => t.done).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  progressFill.style.width = pct + '%';
  progressLabel.textContent = `${done} of ${all.length} complete (${pct}%)`;
}

function render() {
  board.textContent = '';

  state.sections.forEach(section => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.card');
    const doneCount = section.tasks.filter(t => t.done).length;

    card.querySelector('h2').textContent = section.title;
    card.querySelector('.count').textContent = `${doneCount}/${section.tasks.length}`;

    const list = card.querySelector('.tasks');
    if (section.tasks.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'Nothing here yet — add your first task.';
      list.after(empty);
    }

    section.tasks.forEach(task => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');

      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = task.done;
      box.id = `t-${task.id}`;
      box.addEventListener('change', () => {
        task.done = box.checked;
        save();
        render();
      });

      const label = document.createElement('label');
      label.htmlFor = box.id;
      label.textContent = task.text;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove';
      remove.title = 'Remove task';
      remove.setAttribute('aria-label', `Remove ${task.text}`);
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        section.tasks = section.tasks.filter(t => t.id !== task.id);
        save();
        render();
      });

      li.append(box, label, remove);
      list.append(li);
    });

    const form = card.querySelector('.add-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const input = form.querySelector('input');
      const text = input.value.trim();
      if (!text) return;
      section.tasks.push({ id: newId(), text, done: false });
      input.value = '';
      save();
      render();
    });

    board.append(node);
  });

  renderProgress();
}

document.getElementById('export-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'launch-checklist.json';
  link.click();
  URL.revokeObjectURL(url);
});

const importFile = document.getElementById('import-file');
document.getElementById('import-btn').addEventListener('click', () => importFile.click());
importFile.addEventListener('change', () => {
  const file = importFile.files && importFile.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!isValidState(parsed)) throw new Error('Unexpected file shape');
      state = parsed;
      state.sections.forEach(s => {
        s.id = s.id || newId();
        s.tasks.forEach(t => {
          t.id = t.id || newId();
          t.done = Boolean(t.done);
        });
      });
      save();
      render();
    } catch (err) {
      alert('That file could not be imported: ' + err.message);
    }
  };
  reader.readAsText(file);
  importFile.value = '';
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (!confirm('Reset the checklist back to the default template?')) return;
  state = seedState();
  save();
  render();
});

render();
