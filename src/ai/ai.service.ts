/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import { AIProvidable, MistralAIAdapter, OpenAIAdapter } from './api-providers';
import { ClaudeAIAdapter } from './api-providers/ClaudeAIAdapter';
import { config } from '../config';

export namespace AIService {
  export const pickAIProvider = (): AIProvidable => {
    const providerFactories = [
      {
        enabled: config.openAiApiEnabled,
        apiKey: config.openAiApiKey,
        model: config.openAiModel,
        create: () =>
          new OpenAIAdapter(
            config.openAiApiKey,
            pickModelId(config.openAiModel),
            config.openAiMaxOutputTokens,
            config.openAiTimeoutMs
          ),
      },
      {
        enabled: config.mistralAiApiEnabled,
        apiKey: config.mistralAiApiKey,
        model: config.mistralAiModel,
        create: () => new MistralAIAdapter(config.mistralAiApiKey, pickModelId(config.mistralAiModel)),
      },
      {
        enabled: config.claudeAiApiEnabled,
        apiKey: config.claudeAiApiKey,
        model: config.claudeAiModel,
        create: () => new ClaudeAIAdapter(config.claudeAiApiKey, pickModelId(config.claudeAiModel)),
      },
    ];

    const providerFactory = providerFactories.find(
      ({ enabled, apiKey, model }) => enabled && apiKey.length > 0 && model.length > 0
    );

    if (!providerFactory) {
      throw new Error('No AI provider is enabled with both an API key and a model.');
    }

    return providerFactory.create();
  };

  const pickModelId = (model: string): string => {
    const arrayModels = model
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const modelIndex = Math.floor(Math.random() * arrayModels.length);
    return arrayModels[modelIndex] || '';
  };
}
