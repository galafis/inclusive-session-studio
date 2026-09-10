import {
  presetPlan,
  validatePlan,
  reorderActivity,
  createSession,
  tick,
  changeSession,
  formatTime,
  plannedMinutes,
} from './session.js';
import { downloadJSON, escapeHTML as esc, readJSONFile } from './browser.js';
const $ = (id) => document.getElementById(id),
  KEY = 'inclusive-session-studio.plan.v1';
const symbols = { settle: '○', explore: '◇', move: '↗', pause: '≈', close: '◡' };
let plan = presetPlan(),
  selected = 0,
  session = null,
  undo = [],
  lastTime = performance.now(),
  storageAvailable = true;
try {
  const stored = localStorage.getItem(KEY);
  if (stored) plan = validatePlan(JSON.parse(stored));
} catch {
  storageAvailable = false;
}
const active = () => session && !['finished', 'ended'].includes(session.status);
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(plan));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  $('save-status').textContent = storageAvailable
    ? 'Saved on this device'
    : 'Device storage unavailable · export to keep';
}
function mutate(next) {
  if (active()) return;
  const clean = validatePlan(next);
  undo.push(structuredClone(plan));
  if (undo.length > 20) undo.shift();
  plan = clean;
  selected = Math.min(selected, plan.activities.length - 1);
  session = null;
  save();
  render();
}
function renderEditor() {
  const activity = plan.activities[selected];
  $('activity-title').value = activity.title;
  $('activity-description').value = activity.description;
  $('minutes').value = activity.minutes;
  $('category').value = activity.category;
  $('up').disabled = selected === 0;
  $('down').disabled = selected === plan.activities.length - 1;
  $('remove').disabled = plan.activities.length === 1;
}
function renderPlayer() {
  const ended = session && ['finished', 'ended'].includes(session.status),
    i = session?.index ?? 0,
    activity = session?.plan.activities[i] ?? plan.activities[0];
  $('current-title').textContent = ended ? 'Your session is finished.' : activity.title;
  $('current-description').textContent = ended
    ? 'Thank you for choosing how to take part. You can rest, finish for today, or start again.'
    : activity.description;
  document.querySelector('.activity-symbol').textContent = ended ? '◡' : symbols[activity.category];
  $('next-title').textContent = ended
    ? 'Whatever you choose.'
    : ((session?.plan ?? plan).activities[i + 1]?.title ?? 'Finish the session, your way.');
  $('session-counter').textContent =
    session && !ended
      ? `Activity ${i + 1} of ${session.plan.activities.length}`
      : 'Ready when you are';
  $('player-note').textContent = ended
    ? 'There is nothing else you need to do.'
    : session?.status === 'paused'
      ? 'Paused. Take the time you need.'
      : session?.status === 'ready'
        ? 'The suggested time has passed. Stay here or choose the next step.'
        : session
          ? 'You can pause, skip, or finish at any time.'
          : 'There is no rush. Start whenever you choose.';
  $('start').hidden = Boolean(active());
  $('start').textContent = ended ? 'Start another session' : 'Start session';
  for (const id of ['pause', 'complete', 'skip', 'end']) $(id).hidden = !active();
  $('pause').textContent = session?.status === 'paused' ? 'Resume' : 'Pause';
  $('pause').disabled = session?.status === 'ready';
  $('complete').textContent = session?.status === 'ready' ? 'Next activity' : 'Done for now';
  $('timer').hidden = !plan.preferences.showTimer || Boolean(ended);
  $('timer').textContent = formatTime(session?.remaining ?? activity.minutes * 60);
}
function render() {
  $('print-plan').innerHTML =
    `<h1>${esc(plan.title)}</h1><p>A flexible activity plan. Pause, skip, or finish whenever you choose.</p><ol>${plan.activities.map((a) => `<li><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p><small>${a.minutes} suggested minutes</small></li>`).join('')}</ol>`;
  $('plan-title').value = plan.title;
  $('total-time').textContent = `${plannedMinutes(plan)} suggested min`;
  $('activities').innerHTML = plan.activities
    .map(
      (a, i) =>
        `<button class="activity-item" data-index="${i}" aria-pressed="${selected === i}" aria-label="Edit activity ${i + 1}: ${esc(a.title)}"><span class="number">${i + 1}</span><span>${esc(a.title)}</span><small>${a.minutes}m</small></button>`,
    )
    .join('');
  $('plan-controls').disabled = Boolean(active());
  $('editor-controls').disabled = Boolean(active());
  $('undo').disabled = !undo.length;
  $('add').disabled = plan.activities.length >= 12;
  $('show-timer').checked = plan.preferences.showTimer;
  $('high-contrast').checked = plan.preferences.highContrast;
  document.body.classList.toggle('high-contrast', plan.preferences.highContrast);
  $('save-status').textContent = storageAvailable
    ? 'Saved on this device'
    : 'Device storage unavailable · export to keep';
  renderEditor();
  renderPlayer();
}
$('activities').onclick = (event) => {
  const button = event.target.closest('[data-index]');
  if (!button || active()) return;
  selected = Number(button.dataset.index);
  render();
  $('activity-title').focus();
};
$('template').onchange = () => {
  selected = 0;
  mutate(presetPlan($('template').value));
  $('status').textContent = 'Template loaded. Adapt any activity to suit the person.';
};
$('plan-title').onchange = () => {
  try {
    mutate({ ...plan, title: $('plan-title').value });
  } catch (error) {
    $('status').textContent = error.message;
    $('plan-title').value = plan.title;
  }
};
$('editor').onsubmit = (event) => {
  event.preventDefault();
  try {
    const next = structuredClone(plan);
    next.activities[selected] = {
      ...next.activities[selected],
      title: $('activity-title').value,
      description: $('activity-description').value,
      minutes: Number($('minutes').value),
      category: $('category').value,
    };
    mutate(next);
    $('status').textContent = 'Activity saved.';
  } catch (error) {
    $('status').textContent = error.message;
  }
};
$('add').onclick = () => {
  const next = structuredClone(plan);
  let i = 1;
  while (next.activities.some((a) => a.id === `step-${i}`)) i++;
  next.activities.push({
    id: `step-${i}`,
    title: 'A new invitation',
    description: 'Choose an activity together, or take a pause.',
    minutes: 3,
    category: 'explore',
  });
  selected = next.activities.length - 1;
  mutate(next);
  $('activity-title').focus();
};
for (const [id, direction] of [
  ['up', -1],
  ['down', 1],
])
  $(id).onclick = () => {
    const next = reorderActivity(plan, selected, direction);
    selected += direction;
    mutate(next);
  };
$('remove').onclick = () => {
  const next = structuredClone(plan);
  next.activities.splice(selected, 1);
  mutate(next);
  $('status').textContent = 'Activity removed. Undo is available.';
};
$('undo').onclick = () => {
  if (!undo.length || active()) return;
  plan = undo.pop();
  selected = Math.min(selected, plan.activities.length - 1);
  session = null;
  save();
  render();
  $('status').textContent = 'Previous plan restored.';
};
$('start').onclick = () => {
  session = createSession(plan);
  lastTime = performance.now();
  render();
  $('status').textContent = `Session started. ${session.plan.activities[0].title}.`;
  $('pause').focus();
};
function advance(action) {
  try {
    session = changeSession(session, action);
    lastTime = performance.now();
    render();
    $('status').textContent = ['finished', 'ended'].includes(session.status)
      ? 'Session ended. You can finish for today.'
      : session.status === 'paused'
        ? 'Session paused.'
        : `${session.plan.activities[session.index].title}. ${session.status === 'running' ? 'Choose your pace.' : ''}`;
    if (!active()) $('start').focus();
  } catch (error) {
    $('status').textContent = error.message;
  }
}
$('pause').onclick = () => advance(session.status === 'paused' ? 'resume' : 'pause');
$('complete').onclick = () => advance('complete');
$('skip').onclick = () => advance('skip');
$('end').onclick = () => advance('end');
for (const [id, key] of [
  ['show-timer', 'showTimer'],
  ['high-contrast', 'highContrast'],
])
  $(id).onchange = () => {
    plan.preferences[key] = $(id).checked;
    save();
    render();
  };
$('export').onclick = () => downloadJSON('inclusive-session-plan.json', plan);
$('print').onclick = () => window.print();
$('import').onclick = async () => {
  try {
    const next = validatePlan(await readJSONFile($('import-file').files[0]));
    selected = 0;
    mutate(next);
    $('status').textContent = 'Plan imported. Review each invitation before starting.';
  } catch (error) {
    $('status').textContent = `Could not import: ${error.message}`;
  }
};
setInterval(() => {
  const now = performance.now(),
    seconds = (now - lastTime) / 1000;
  lastTime = now;
  if (session?.status === 'running') {
    const prior = session.status;
    session = tick(session, seconds);
    $('timer').textContent = formatTime(session.remaining);
    if (session.status !== prior) {
      renderPlayer();
      $('status').textContent = 'Suggested time reached. Stay here or choose the next step.';
    }
  }
}, 250);
render();
