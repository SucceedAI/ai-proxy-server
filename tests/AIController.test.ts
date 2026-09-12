import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request, Response } from 'express';
import { query } from '../src/ai/ai.controller.ts';

function response() {
  const result = { status: 0, body: undefined as unknown };
  const res = {
    status(code: number) {
      result.status = code;
      return this;
    },
    send(body: unknown) {
      result.body = body;
      return this;
    },
    json(body: unknown) {
      result.body = body;
      return this;
    },
  } as unknown as Response;
  return { result, res };
}

test('malformed queries return 400 instead of rejecting the Express handler', async () => {
  for (const body of [
    undefined,
    null,
    {},
    { query: 42 },
    { query: true },
    { query: [] },
    { query: {} },
    { query: '' },
    { query: '  ' },
  ]) {
    const { result, res } = response();
    await query({ body } as Request, res);
    assert.equal(result.status, 400);
  }
});

test('oversized queries return 413 before provider selection', async () => {
  const { result, res } = response();
  await query({ body: { query: 'a'.repeat(12_001) } } as Request, res);
  assert.equal(result.status, 413);
});
