import assert from 'node:assert/strict';
import test from 'node:test';
import { AxiosError } from 'axios';
import { axiosError } from '../src/logger/axios-error.helper.ts';
import { logger } from '../src/logger/index.ts';

test('provider failures log status without response bodies, credentials or error messages', (t) => {
  const calls: unknown[] = [];
  t.mock.method(logger, 'error', (...args: unknown[]) => calls.push(args));
  const error = new AxiosError('private-prompt-marker');
  Object.assign(error, {
    response: { status: 502, data: { message: 'private-response-marker' } },
    config: { headers: { Authorization: 'private-credential-marker' } },
  });
  axiosError(error, 'Upstream failed');
  assert.deepEqual(calls, [[{ status: 502 }, 'Upstream failed']]);
  assert.ok(!JSON.stringify(calls).includes('private-'));
});
