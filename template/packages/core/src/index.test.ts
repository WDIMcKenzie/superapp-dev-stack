import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatHealthLabel } from './index.js';

test('formatHealthLabel', () => {
  assert.equal(formatHealthLabel(true), 'healthy');
  assert.equal(formatHealthLabel(false), 'unhealthy');
});
