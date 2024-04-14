import { AIProvidable, MistralAIAdapter, OpenAIAdapter } from './api-providers';
import { ClaudeAIAdapter } from './api-providers/ClaudeAIAdapter';
import { config } from '../config';

export namespace AIService {
  // Initialize the AI provider. We can switch to different providers as needed
  // and enable the one we want
  export const pickAIProvider = (): AIProvidable => {
    if (config.mistralAiApiEnabled) {
      return new MistralAIAdapter(config.mistralAiApiKey, pickModelId(config.mistralAiModel));
    }

    if (config.openAiApiEnabled) {
      return new OpenAIAdapter(config.openAiApiKey, pickModelId(config.openAiModel));
    }

    if (config.claudeAiApiEnabled) {
      return new ClaudeAIAdapter(config.claudeAiApiKey, pickModelId(config.claudeAiModel));
    }

    throw new Error('No AI provider is enabled');
  };

  const pickModelId = (model: string): string => {
    const arrayModels = model.includes(',') ? model.split(',') : [model];
    const modelIndex = Math.floor(Math.random() * arrayModels.length);
    return arrayModels[modelIndex] || '';
  };
}
