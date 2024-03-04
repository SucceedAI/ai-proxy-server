import { AIProvideable, MistralAIAdapter, OpenAIAdapter } from "./api-providers";

export namespace AIService {

    // Initialize the AI provider. We can switch to different providers as needed 
    // and enable the one we want
    export const pickAIProvider = (): AIProvideable => {
        if (process.env.MISTRAL_AI_API_ENABLED) {
            const apiKey = process.env.MISTRAL_AI_API_KEY || '';
            const modelId = process.env.MISTRAL_AI_API_KEY || '';

            return new MistralAIAdapter(process.env.MISTRAL_AI_API_KEY || '', pickModelId(modelId));
        }

        if (process.env.OPEN_AI_API_ENABLED) {
            const apiKey = process.env.OPEN_AI_API_KEY || '';
            const modelId = process.env.OPEN_AI_MODEL || '';

            return new OpenAIAdapter(process.env.MISTRAL_AI_API_KEY || '', pickModelId(modelId));
        }

        throw new Error('Not AI Provider Enabled');
    };

    const pickModelId = ((model: string): string => {
        const arrayModels = model.includes(',') ? model.split(',') : [model];
        const modelIndex = Math.floor(Math.random() * arrayModels.length);
        return arrayModels[modelIndex] || '';
    });

}
