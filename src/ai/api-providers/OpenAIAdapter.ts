/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import OpenAI from 'openai';

import { AIProvidable, PayloadProps } from './api.type';
import { logger } from '../../logger';

export class OpenAIAdapter implements AIProvidable {
  private readonly providerName = 'openai';
  private readonly instructions = [
    'You are SucceedAI, a macOS in-place writing assistant.',
    'Return only the final user-facing text requested by the user.',
    'Do not add prefaces, explanations, markdown fences, or quotes unless the user explicitly asks for them.',
  ].join(' ');
  private client: OpenAI;

  constructor(
    private apiKey: string,
    private modelId: string,
    private maxOutputTokens: number,
    timeoutMs: number
  ) {
    this.client = new OpenAI({
      apiKey: this.apiKey,
      timeout: timeoutMs,
    });
  }

  public async query(query: string): Promise<string> {
    try {
      const payload = this.buildPayload(query);
      const response = await this.client.responses.create(payload as OpenAI.Responses.ResponseCreateParamsNonStreaming);

      return response.output_text?.trim() || this.extractOutputText(response).trim();
    } catch (error: any) {
      logger.error('Error in OpenAiAdapter:', error);
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
      instructions: this.instructions,
      input: query,
      max_output_tokens: this.maxOutputTokens,
    };

    return payload;
  }

  private extractOutputText(response: OpenAI.Responses.Response): string {
    return response.output
      .flatMap((item: any) => item.content ?? [])
      .map((content: any) => content.text ?? '')
      .join('')
      .trim();
  }
}
