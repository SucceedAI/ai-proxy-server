import axios from 'axios';
import { AIProvideable, PayloadProps } from './api.type';

export class MistralAIAdapter implements AIProvideable {
    private readonly endpoint: string = 'https://api.mistralai.com/v1/chat/completions';

    constructor(private apiKey: string, private modelId: string) {}

    async query(query: string): Promise<string> {
       const payload = this.buildPayload(query);

        try {
            const response = await axios.post(this.endpoint, payload, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data; // Adjust based on the response format of MistralAI
        } catch (error: any) {
            console.error('Error in MistralAiAdapter:', error);
            throw new Error('Error processing AI query');
        }
    }

    public buildPayload(query: string): PayloadProps {
        const payload = {
            messages: [{role: "system", content: query}],
            model: this.modelId
        };

        return payload;
    }
}
