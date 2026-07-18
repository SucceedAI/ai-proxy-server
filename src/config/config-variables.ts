/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import dotenv from 'dotenv';

// load environment variables from .env file
dotenv.config();

interface ConfigProps {
  // App Server
  port: string | number;
  nodeEnv: string;
  requestBodyLimit: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  jwtToken: string;
  browserExtensionSecret: string;
  jwtTokenExpiryTime: string;

  // Mistral AI
  mistralAiApiEnabled: boolean;
  mistralAiApiKey: string;
  mistralAiModel: string;

  // OpenAI
  openAiApiEnabled: boolean;
  openAiApiKey: string;
  openAiModel: string;
  openAiMaxOutputTokens: number;
  openAiTimeoutMs: number;

  // Claude AI
  claudeAiApiEnabled: boolean;
  claudeAiApiKey: string;
  claudeAiModel: string;

  // Meta Llama API
  llamaApiEnabled: boolean;
  llamaApiKey: string;
  llamaModel: string;
  llamaMaxCompletionTokens: number;
  llamaTimeoutMs: number;

  // Lemon Squeezy API
  licenseCheckEnabled: boolean;
  lemonSqueezyApiKey: string;
}

const readEnv = (...names: string[]): string => {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value?.length) {
      return value;
    }
  }

  return '';
};

const parseBoolean = (value: string, fallback = false): boolean => {
  if (!value.length) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const parseNumber = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const config: ConfigProps = {
  port: readEnv('PORT', 'APP_PORT') || 3000,
  nodeEnv: readEnv('NODE_ENV') || 'development',
  requestBodyLimit: readEnv('REQUEST_BODY_LIMIT') || '64kb',
  rateLimitWindowMs: parseNumber(readEnv('RATE_LIMIT_WINDOW_MS'), 15 * 60 * 1000),
  rateLimitMax: parseNumber(readEnv('RATE_LIMIT_MAX'), 100),
  jwtToken: readEnv('JWT_SECRET'),
  browserExtensionSecret: readEnv('BROWSER_EXTENSION_SECRET'),
  jwtTokenExpiryTime: readEnv('JWT_TOKEN_EXPIRY_TIME') || '3h',

  mistralAiApiEnabled: parseBoolean(readEnv('MISTRAL_AI_API_ENABLED'), false),
  mistralAiApiKey: readEnv('MISTRAL_AI_API_KEY'),
  mistralAiModel: readEnv('MISTRAL_AI_MODEL') || 'mistral-large-latest',

  openAiApiEnabled: parseBoolean(readEnv('OPENAI_API_ENABLED', 'OPEN_AI_API_ENABLED'), true),
  openAiApiKey: readEnv('OPENAI_API_KEY', 'OPEN_AI_API_KEY'),
  openAiModel: readEnv('OPENAI_MODEL', 'OPEN_AI_MODEL') || 'gpt-5.2',
  openAiMaxOutputTokens: parseNumber(readEnv('OPENAI_MAX_OUTPUT_TOKENS', 'OPEN_AI_MAX_OUTPUT_TOKENS'), 1200),
  openAiTimeoutMs: parseNumber(readEnv('OPENAI_TIMEOUT_MS', 'OPEN_AI_TIMEOUT_MS'), 45_000),

  claudeAiApiEnabled: parseBoolean(readEnv('CLAUDE_AI_API_ENABLED'), false),
  claudeAiApiKey: readEnv('CLAUDE_AI_API_KEY'),
  claudeAiModel: readEnv('CLAUDE_AI_MODEL') || 'claude-3-5-sonnet-latest',

  llamaApiEnabled: parseBoolean(readEnv('LLAMA_API_ENABLED'), false),
  llamaApiKey: readEnv('LLAMA_API_KEY'),
  llamaModel: readEnv('LLAMA_MODEL'),
  llamaMaxCompletionTokens: parseNumber(readEnv('LLAMA_MAX_COMPLETION_TOKENS'), 1200),
  llamaTimeoutMs: parseNumber(readEnv('LLAMA_TIMEOUT_MS'), 45_000),

  licenseCheckEnabled: parseBoolean(readEnv('LICENSE_CHECK_ENABLED'), false),
  lemonSqueezyApiKey: readEnv('LEMON_SQUEEZY_API_KEY'),
};

export { config };
