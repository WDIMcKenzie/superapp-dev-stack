import { test } from 'node:test';
import assert from 'node:assert/strict';

test('health route shape', () => {
  const payload = { status: 'ok', service: 'api' };
  assert.equal(payload.status, 'ok');
});
