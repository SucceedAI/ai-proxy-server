import axios, { AxiosError } from 'axios';
import { AIProvidable, PayloadProps, Role } from './api.type';
import { logger } from 'src/logger';

export class ClaudeAIAdapter implements AIProvidable {
  private readonly chatRole: Role = 'user';
  private readonly chatCompletionUrl: string = 'https://api.anthropic.com/v1/messages';

  constructor(
    private apiKey: string,
    private modelId: string
  ) {}

  public async query(query: string): Promise<string> {
    const payload = this.buildPayload(query);

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
        headers: {
          'x-api-key': `${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return content?.trim() || '';
    } catch (e: any | AxiosError) {
      console.error('ClaudeAiAdapter Error:', axios.isAxiosError(e) ? e?.response?.data?.message : e.message);
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
    };

    return payload;
  }
}
