import axios from 'axios';
import { AIProvidable, PayloadProps, Role } from './api.type';

export class MistralAIAdapter implements AIProvidable {
  private readonly chatRole: Role = 'user';
  private readonly chatCompletionUrl: string = 'https://api.mistral.ai/v1/chat/completions';

  constructor(
    private apiKey: string,
    private modelId: string
  ) {}

  async query(query: string): Promise<string> {
    const payload = this.buildPayload(query);

    try {
      const response = await axios.post(this.chatCompletionUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data.choices[0].message.content;
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
