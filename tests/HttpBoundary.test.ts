import assert from 'node:assert/strict';
import axios from 'axios';
import { once } from 'node:events';
import test from 'node:test';
import type { AddressInfo } from 'node:net';

import { createApp } from '../src/app.ts';
import { config } from '../src/config/index.ts';
import { OpenAIAdapter } from '../src/ai/api-providers/OpenAIAdapter.ts';

// Node 20 type declarations do not export their callback context directly.
type TestContext = Parameters<NonNullable<Parameters<typeof test>[0]>>[0];

async function startServer(t: TestContext, overrides: Partial<typeof config> = {}) {
  const previous = { ...config };
  t.after(() => Object.assign(config, previous));
  Object.assign(config, {
    jwtToken: 'fixture-bearer-token',
    browserExtensionSecret: '',
    openAiApiEnabled: true,
    openAiApiKey: 'fixture-provider-key',
    openAiModel: 'fixture-model',
    licenseCheckEnabled: false,
    trustProxyHops: 0,
    rateLimitMax: 100,
    ...overrides,
  });
  t.mock.method(OpenAIAdapter.prototype, 'query', async () => 'Offline fixture result');
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  });
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

test('the actual HTTP query route authenticates before returning a fixture prediction', async (t) => {
  const base = await startServer(t);
  const payload = {
    method: 'POST',
    body: JSON.stringify({ query: 'Improve this' }),
    headers: { 'Content-Type': 'application/json' },
  };
  const denied = await fetch(`${base}/v1/ai/query`, payload);
  assert.equal(denied.status, 401);
  await denied.text();
  const allowed = await fetch(`${base}/v1/ai/query`, {
    ...payload,
    headers: { ...payload.headers, Authorization: 'Bearer fixture-bearer-token' },
  });
  assert.equal(allowed.status, 200);
  assert.deepEqual(await allowed.json(), {
    content: 'Offline fixture result',
    model: 'fixture-model',
    provider: 'openai',
  });
});

test('unconfigured authentication fails closed while health remains available', async (t) => {
  const base = await startServer(t, { jwtToken: '', browserExtensionSecret: '' });
  const response = await fetch(`${base}/v1/ai/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  assert.equal(response.status, 503);
  await response.text();
  const health = await fetch(`${base}/v1/health`);
  assert.equal(health.status, 200);
  await health.json();
});

test('invalid JSON and body size errors return generic JSON without payload contents', async (t) => {
  const base = await startServer(t);
  for (const [body, status] of [
    ['{"private-marker":', 400],
    [JSON.stringify({ query: 'a'.repeat(70_000) }), 413],
  ] as const) {
    const response = await fetch(`${base}/v1/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    assert.equal(response.status, status);
    const text = await response.text();
    assert.doesNotThrow(() => JSON.parse(text));
    assert.ok(!text.includes('private-marker'));
    assert.ok(!text.includes('stack'));
  }
});

test('legacy token minting is explicitly unavailable', async (t) => {
  const base = await startServer(t);
  const response = await fetch(`${base}/v1/token-generator`, { method: 'POST' });
  assert.equal(response.status, 410);
  assert.equal('token' in (await response.json()), false);
});

test('spoofed forwarded addresses cannot bypass a direct-access rate limit', async (t) => {
  const base = await startServer(t, { rateLimitMax: 2 });
  for (let index = 0; index < 3; index++) {
    const response = await fetch(`${base}/v1/health`, { headers: { 'X-Forwarded-For': `192.0.2.${index + 1}` } });
    assert.equal(response.status, index < 2 ? 200 : 429);
    await response.text();
  }
});

test('enabled licensing accepts only an exact active license header', async (t) => {
  const base = await startServer(t, { licenseCheckEnabled: true, lemonSqueezyApiKey: 'fixture-license-api-key' });
  let calls = 0;
  t.mock.method(axios, 'get', async () => {
    calls += 1;
    return { data: { data: { attributes: { status: 'active', key: 'fixture-license-key' } } } };
  });
  for (const [license, status] of [
    ['', 401],
    ['7:fixture-license-key:extra', 401],
    ['7:fixture-license-key', 200],
  ] as const) {
    const response = await fetch(`${base}/v1/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer fixture-bearer-token', License: license },
      body: JSON.stringify({ query: 'Improve this' }),
    });
    assert.equal(response.status, status);
    await response.text();
  }
  assert.equal(calls, 1);
});
