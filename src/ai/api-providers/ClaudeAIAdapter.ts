/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import axios from 'axios';

import type { AIProvidable, PayloadProps, Role } from './api.type.ts';
import { axiosError } from '../../logger/axios-error.helper.ts';

export class ClaudeAIAdapter implements AIProvidable {
  private readonly providerName = 'claude';
  private readonly chatRole: Role = 'user';
  private readonly chatCompletionUrl: string = 'https://api.anthropic.com/v1/messages';

  private readonly apiKey: string;
  private readonly modelId: string;

  constructor(apiKey: string, modelId: string) {
    this.apiKey = apiKey;
    this.modelId = modelId;
  }

  public async query(query: string): Promise<string> {
    const payload = this.buildPayload(query);

    try {
      const { data } = await axios.post(this.chatCompletionUrl, payload, {
        headers: {
          'x-api-key': `${this.apiKey}`,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      });

      return (
        data.content
          ?.filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join('')
          .trim() || ''
      );
    } catch (e: any) {
      axiosError(e, 'ClaudeAiAdapter Error:');
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
    const payload = {
      model: this.modelId,
      max_tokens: 1200,
      messages: [{ role: this.chatRole, content: query }],
    };

    return payload;
  }
}
