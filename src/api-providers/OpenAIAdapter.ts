import OpenAI from 'openai';
import {AIProvideable, PayloadProps } from './api.type';

export class OpenAIAdapter implements AIProvideable {
    private openai: OpenAI;

    constructor(private apiKey: string, private modelId: string) {
        this.openai = new OpenAI({
            apiKey: this.apiKey,
        });
    }

    async query(query: string): Promise<string> {
        try {
            const payload = this.buildPayload(query);
            const response = await this.openai.chat.completions.create(payload);

            return response?.choices[0]?.message?.content?.trim() || '';
        } catch (error: any) {
            console.error('Error in OpenAiAdapter:', error);
            throw new Error('Error processing AI query');
        }
    }

    public buildPayload(query: string): any {
        const payload = {
            messages: [{ role: 'system', content: query }],
            model: this.modelId,
        };

        return payload;
    }
}
