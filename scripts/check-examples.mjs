import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';
import * as domain from '../src/session.js';
const root = new URL('../', import.meta.url);
export const examples = JSON.parse(await readFile(new URL('examples/index.json', root), 'utf8'));
export async function verifyExample(entry) {
  const input = JSON.parse(await readFile(new URL('examples/' + entry.file, root), 'utf8'));
  const expected = JSON.parse(await readFile(new URL('examples/' + entry.expected, root), 'utf8'));
  let actual;
  const plan = domain.validatePlan(input),
    initial = domain.createSession(plan),
    ready = domain.tick(initial, initial.remaining + 60),
    next = domain.changeSession(ready, 'complete');
  actual = {
    version: 1,
    activities: plan.activities.length,
    totalMinutes: domain.plannedMinutes(plan),
    initialRemaining: initial.remaining,
    afterDeadline: { index: ready.index, status: ready.status, remaining: ready.remaining },
    afterChoice: { index: next.index, status: next.status, remaining: next.remaining },
  };
  const portuguese = domain.validatePlan(
    JSON.parse(await readFile(new URL('examples/' + entry.id + '.pt.json', root), 'utf8')),
  );
  assert.equal(domain.plannedMinutes(portuguese), actual.totalMinutes);
  assert.deepEqual(
    portuguese.activities.map((a) => [a.id, a.minutes, a.category]),
    plan.activities.map((a) => [a.id, a.minutes, a.category]),
  );
  assert.deepEqual(actual, expected, entry.id);
  return actual;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const entry of examples) await verifyExample(entry);
  console.log(examples.length + ' verified examples / exemplos verificados.');
}
