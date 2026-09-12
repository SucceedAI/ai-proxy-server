import assert from 'node:assert/strict';
import test from 'node:test';
import axios from 'axios';
import { isUserLicenseKeyValid } from '../src/user/license.service.ts';

function licenseResponse(status: string, key = 'fixture-license-key') {
  return { data: { data: { type: 'license-keys', id: '7', attributes: { key, status } } } };
}

test('active licenses are read from the JSON:API resource attributes', async (t) => {
  t.mock.method(axios, 'get', async (url: string, options: any) => {
    assert.equal(url, 'https://api.lemonsqueezy.com/v1/license-keys/7');
    assert.ok(options.timeout > 0);
    return licenseResponse('active');
  });
  assert.equal(await isUserLicenseKeyValid('7', 'fixture-license-key'), true);
});

test('wrong keys and non-active licenses are rejected', async (t) => {
  for (const status of ['inactive', 'expired', 'disabled']) {
    const mock = t.mock.method(axios, 'get', async () => licenseResponse(status));
    assert.equal(await isUserLicenseKeyValid('7', 'fixture-license-key'), false);
    mock.mock.restore();
  }
  t.mock.method(axios, 'get', async () => licenseResponse('active', 'different-key'));
  assert.equal(await isUserLicenseKeyValid('7', 'fixture-license-key'), false);
});

test('malformed license ids do not make an upstream request', async (t) => {
  let calls = 0;
  t.mock.method(axios, 'get', async () => {
    calls += 1;
    return licenseResponse('active');
  });
  for (const id of ['', '../users', '7/other', '7?include=order', '1.5']) {
    assert.equal(await isUserLicenseKeyValid(id, 'fixture-license-key'), false);
  }
  assert.equal(calls, 0);
});

test('malformed upstream responses fail closed', async (t) => {
  t.mock.method(axios, 'get', async () => ({ data: {} }));
  assert.equal(await isUserLicenseKeyValid('7', 'fixture-license-key'), false);
});
