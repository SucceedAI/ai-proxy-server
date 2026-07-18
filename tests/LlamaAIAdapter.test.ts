import assert from 'node:assert/strict';
import test from 'node:test';

import { LlamaAIAdapter } from '../src/ai/api-providers/LlamaAIAdapter.ts';

test('LlamaAIAdapter builds a Meta Llama chat-completion payload', () => {
  const adapter = new LlamaAIAdapter('test-key', 'test-model', 1200, 45_000);

  assert.deepEqual(adapter.buildPayload('Improve this sentence'), {
    model: 'test-model',
    messages: [{ role: 'user', content: 'Improve this sentence' }],
    max_completion_tokens: 1200,
  });
  assert.equal(adapter.getProviderName(), 'llama');
  assert.equal(adapter.getModel(), 'test-model');
});
