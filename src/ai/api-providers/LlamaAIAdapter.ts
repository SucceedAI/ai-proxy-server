/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import LlamaAPIClient from 'llama-api-client';

import type { AIProvidable, PayloadProps } from './api.type.ts';
import { logger } from '../../logger/index.ts';

export class LlamaAIAdapter implements AIProvidable {
  private readonly providerName = 'llama';
  private readonly apiKey: string;
  private readonly modelId: string;
  private readonly maxCompletionTokens: number;
  private readonly client: LlamaAPIClient;

  constructor(apiKey: string, modelId: string, maxCompletionTokens: number, timeoutMs: number) {
    this.apiKey = apiKey;
    this.modelId = modelId;
    this.maxCompletionTokens = maxCompletionTokens;
    this.client = new LlamaAPIClient({
      apiKey: this.apiKey,
      timeout: timeoutMs,
    });
  }

  public async query(query: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.modelId,
        messages: [{ role: 'user', content: query }],
        max_completion_tokens: this.maxCompletionTokens,
      });
      const content = response.completion_message.content;

      return (typeof content === 'string' ? content : content?.text || '').trim();
    } catch (error: unknown) {
      logger.error({ error }, 'LlamaAIAdapter error');
      throw new Error('Error processing AI query');
    }
  }

  public getModel(): string {
    return this.modelId;
  }

  public getProviderName(): string {
    return this.providerName;
  }

  public buildPayload(query: string): PayloadProps {
    return {
      model: this.modelId,
      messages: [{ role: 'user', content: query }],
      max_completion_tokens: this.maxCompletionTokens,
    };
  }
}
