import { AIProvideable, MistralAIAdapter, OpenAIAdapter } from './ai/api-providers';
import { config } from './config';

export namespace AIService {
  // Initialize the AI provider. We can switch to different providers as needed
  // and enable the one we want
  export const pickAIProvider = (): AIProvideable => {
    if (config.mistralAiApiEnabled) {
      return new MistralAIAdapter(config.mistralAiApiKey, pickModelId(config.mistralAiModel));
    }

    if (config.openAiApiEnabled) {
      return new OpenAIAdapter(config.openAiApiKey, pickModelId(config.openAiModel));
    }

    throw new Error('Not AI Provider Enabled');
  };

  const pickModelId = (model: string): string => {
    const arrayModels = model.includes(',') ? model.split(',') : [model];
    const modelIndex = Math.floor(Math.random() * arrayModels.length);
    return arrayModels[modelIndex] || '';
  };
}
