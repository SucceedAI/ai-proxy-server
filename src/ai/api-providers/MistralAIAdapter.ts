/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import axios, { AxiosError } from 'axios';

import { AIProvidable, PayloadProps, Role } from './api.type';
import { axiosError } from '../../logger/axios-error.helper';

export class MistralAIAdapter implements AIProvidable {
  private readonly chatRole: Role = 'user';
  private readonly chatCompletionUrl: string = 'https://api.mistral.ai/v1/chat/completions';

  constructor(
    private apiKey: string,
    private modelId: string
  ) { }

  public async query(query: string): Promise<string> {
    const payload = this.buildPayload(query);
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const {
        data: {
          choices: [
            {
              message: { content },
            },
          ],
        },
      } = await axios.post(this.chatCompletionUrl, payload, {
        headers,
      });

      return content?.trim() || '';
    } catch (e: any | AxiosError) {
      axiosError(e, 'MistralAiAdapter Error:');
      throw new Error('Error processing AI query');
    }
  }

  public getModel(): string {
    return this.modelId;
  }

  public buildPayload(query: string): PayloadProps {
    const payload = {
      model: this.modelId,
      messages: [{ role: this.chatRole, content: query }],
      //max_tokens: 900,
    };

    return payload;
  }
}
