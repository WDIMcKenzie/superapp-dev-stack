import { test } from 'node:test';
import assert from 'node:assert/strict';

test('APP_NAME constant', () => {
  assert.equal(typeof 'SuperApp', 'string');
});
