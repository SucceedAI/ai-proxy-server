/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import axios from 'axios';

import { AIProvidable, PayloadProps, Role } from './api.type';
import { axiosError } from '../../logger/axios-error.helper';

export class ClaudeAIAdapter implements AIProvidable {
  private readonly providerName = 'claude';
  private readonly chatRole: Role = 'user';
  private readonly chatCompletionUrl: string = 'https://api.anthropic.com/v1/messages';

  constructor(
    private apiKey: string,
    private modelId: string
  ) {}

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
