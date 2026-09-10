import test from 'node:test';
import assert from 'node:assert/strict';
import {
  presetPlan,
  validatePlan,
  reorderActivity,
  createSession,
  tick,
  changeSession,
  formatTime,
  plannedMinutes,
} from '../src/session.js';
import { escapeHTML } from '../src/browser.js';
test('all templates satisfy the public plan contract', () => {
  for (const name of ['gentle', 'movement', 'observation'])
    assert.deepEqual(validatePlan(presetPlan(name)), presetPlan(name));
});
test('timers and contrast begin as opt-in preferences', () =>
  assert.deepEqual(presetPlan().preferences, { showTimer: false, highContrast: false }));
test('zero does not force the next activity', () => {
  const state = tick(createSession(presetPlan()), 10000);
  assert.equal(state.status, 'ready');
  assert.equal(state.index, 0);
  assert.equal(state.remaining, 0);
  assert.deepEqual(state.history, []);
});
test('paused sessions do not consume elapsed time', () => {
  const paused = changeSession(tick(createSession(presetPlan()), 10), 'pause');
  assert.deepEqual(tick(paused, 120), paused);
});
test('resume continues the same activity with remaining time', () => {
  const state = changeSession(
    changeSession(tick(createSession(presetPlan()), 30), 'pause'),
    'resume',
  );
  assert.equal(state.remaining, 150);
  assert.equal(tick(state, 10).remaining, 140);
});
test('finishing an activity early is a valid choice', () => {
  const state = changeSession(tick(createSession(presetPlan()), 5), 'complete');
  assert.equal(state.index, 1);
  assert.equal(state.history[0].outcome, 'completed');
  assert.equal(state.history[0].elapsed, 5);
});
test('skipping advances without a penalty or score', () => {
  const state = changeSession(createSession(presetPlan()), 'skip');
  assert.equal(state.index, 1);
  assert.equal(state.history[0].outcome, 'skipped');
  assert.equal('score' in state, false);
});
test('ending immediately is valid', () => {
  const state = changeSession(createSession(presetPlan()), 'end');
  assert.equal(state.status, 'ended');
  assert.equal(state.index, 0);
  assert.equal(state.history[0].outcome, 'ended');
});
test('last activity finishes without an out-of-range index', () => {
  const plan = presetPlan();
  let state = createSession(plan);
  for (const a of plan.activities) state = changeSession(state, 'complete');
  assert.equal(state.status, 'finished');
  assert.equal(state.index, plan.activities.length - 1);
  assert.equal(state.history.length, plan.activities.length);
});
test('finished sessions reject new actions', () =>
  assert.throws(() => changeSession(changeSession(createSession(presetPlan()), 'end'), 'resume')));
test('session snapshot is isolated from later plan edits', () => {
  const plan = presetPlan(),
    state = createSession(plan);
  plan.activities[0].title = 'Changed';
  assert.notEqual(state.plan.activities[0].title, 'Changed');
});
test('ticks and actions never mutate input state', () => {
  const state = createSession(presetPlan()),
    before = structuredClone(state);
  tick(state, 20);
  changeSession(state, 'skip');
  assert.deepEqual(state, before);
});
test('invalid clock inputs are rejected', () => {
  const state = createSession(presetPlan());
  for (const n of [-1, NaN, Infinity]) assert.throws(() => tick(state, n));
});
test('fractional ticks conserve elapsed time', () => {
  const state = tick(tick(createSession(presetPlan()), 0.25), 0.75);
  assert.equal(state.remaining, 179);
  assert.equal(state.elapsed, 1);
});
test('ready and ended sessions ignore further time', () => {
  const ready = tick(createSession(presetPlan()), 180);
  assert.deepEqual(tick(ready, 90), ready);
  const ended = changeSession(ready, 'end');
  assert.deepEqual(tick(ended, 90), ended);
});
test('reordering preserves identity and copies the plan', () => {
  const plan = presetPlan(),
    next = reorderActivity(plan, 0, 1);
  assert.equal(next.activities[1].id, plan.activities[0].id);
  assert.equal(plan.activities[0].id, 'step-1');
});
test('reordering cannot wrap around list boundaries', () => {
  assert.throws(() => reorderActivity(presetPlan(), 0, -1));
  assert.throws(() => reorderActivity(presetPlan(), 3, 1));
  assert.throws(() => reorderActivity(presetPlan(), 0, 2));
});
test('empty, oversized, and unsupported plans are rejected', () => {
  assert.throws(() => validatePlan({ ...presetPlan(), activities: [] }));
  assert.throws(() =>
    validatePlan({ ...presetPlan(), activities: Array(13).fill(presetPlan().activities[0]) }),
  );
  assert.throws(() => validatePlan({ ...presetPlan(), version: 2 }));
  assert.throws(() => validatePlan(null));
});
test('duration bounds, categories, and identifiers are validated', () => {
  for (const patch of [
    { minutes: 0 },
    { minutes: 1.5 },
    { minutes: 31 },
    { category: 'unknown' },
    { id: '' },
  ]) {
    const p = presetPlan();
    Object.assign(p.activities[0], patch);
    assert.throws(() => validatePlan(p));
  }
  const p = presetPlan();
  p.activities[1].id = p.activities[0].id;
  assert.throws(() => validatePlan(p));
});
test('text length and preference types are validated', () => {
  assert.throws(() => validatePlan({ ...presetPlan(), title: ' '.repeat(3) }));
  assert.throws(() => validatePlan({ ...presetPlan(), title: 'x'.repeat(101) }));
  assert.throws(() => validatePlan({ ...presetPlan(), preferences: { showTimer: 'yes' } }));
});
test('unknown imported fields are discarded', () => {
  const clean = validatePlan({ ...presetPlan(), participantName: 'not retained' });
  assert.equal(clean.participantName, undefined);
});
test('time formatting handles boundaries without a negative display', () => {
  assert.equal(formatTime(60), '1:00');
  assert.equal(formatTime(0.1), '0:01');
  assert.equal(formatTime(-1), '0:00');
  assert.equal(plannedMinutes(presetPlan()), 12);
});
test('text displayed through templates escapes markup and attributes', () =>
  assert.equal(
    escapeHTML('<img src="x" onerror=\'alert(1)\'>&'),
    '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt;&amp;',
  ));
test('invalid action transitions cannot silently reset state', () => {
  const state = createSession(presetPlan());
  assert.throws(() => changeSession(state, 'resume'));
  assert.throws(() => changeSession(state, 'unknown'));
});
