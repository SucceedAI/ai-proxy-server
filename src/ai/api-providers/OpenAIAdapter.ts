import OpenAI from 'openai';
import { AIProvideable, PayloadProps, Role } from './api.type';
import { logger } from '../../logger';

export class OpenAIAdapter implements AIProvideable {
  private readonly chatRole: Role = 'user';
  private client: OpenAI;

  constructor(
    private apiKey: string,
    private modelId: string
  ) {
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  async query(query: string): Promise<string> {
    try {
      const payload = this.buildPayload(query);
      const response = await this.client.chat.completions.create(payload);

      return response?.choices[0]?.message?.content?.trim() || '';
    } catch (error: any) {
      logger.error('Error in OpenAiAdapter:', error);
      throw new Error('Error processing AI query');
    }
  }

  public buildPayload(query: string): PayloadProps {
    const payload = {
      messages: [{ role: this.chatRole, content: query }],
      model: this.modelId,
    };

    return payload;
  }
}
