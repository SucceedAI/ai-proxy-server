import MistralClient from '@mistralai/mistralai';
import { AIProvideable, PayloadProps, Role } from './api.type';

export class MistralAIAdapter implements AIProvideable {
  private readonly chatRole: Role = 'user';
  private client: MistralClient;

  constructor(
    private apiKey: string,
    private modelId: string
  ) {
    this.client = new MistralClient(this.apiKey);
  }

  async query(query: string): Promise<string> {
    const payload = this.buildPayload(query);

    try {
      const response = await this.client.chat(payload);
      return response.choices[0].message.content; // Adjust based on the response format of MistralAI
    } catch (error: any) {
      console.error('Error in MistralAiAdapter:', error);
      throw new Error('Error processing AI query');
    }
  }

  public buildPayload(query: string): PayloadProps {
    const payload = {
      model: this.modelId,
      messages: [{ role: this.chatRole, content: query }],
    };

    return payload;
  }
}
