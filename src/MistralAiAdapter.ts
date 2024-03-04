import axios from 'axios';
import { AIProvideable } from './AIProvideable';

export class MistralAiAdapter implements AIProvideable {
    private readonly endpoint: string = 'https://api.mistralai.com/query';

    constructor(private apiKey: string) {}

    async sendQuery(query: string): Promise<string> {
        try {
            const response = await axios.post(this.endpoint, { query }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data; // Adjust based on the response format of MistralAI
        } catch (error) {
            console.error('Error in MistralAiAdapter:', error);
            throw new Error('Error processing AI query');
        }
    }
}