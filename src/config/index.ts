import dotenv from 'dotenv';

// load environment variables from .env file
dotenv.config();

interface ConfigProps {
  // App Server
  port: string | number;
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

  // Claude AI
  claudeAiApiEnabled: boolean;
  claudeAiApiKey: string;
  claudeAiModel: string;

  // Lemon Squeezy API
  lemonSqueezyApiKey: string;
}

const config: ConfigProps = {
  port: process.env.APP_PORT || 3000,
  jwtToken: process.env.JWT_SECRET || 'jwt-secret',
  browserExtensionSecret: process.env.BROWSER_EXTENSION_SECRET || 'browser-secret',
  jwtTokenExpiryTime: process.env.JWT_TOKEN_EXPIRY_TIME || '1h',

  mistralAiApiEnabled: !!process.env.MISTRAL_AI_API_ENABLED,
  mistralAiApiKey: process.env.MISTRAL_AI_API_KEY || '',
  mistralAiModel: process.env.MISTRAL_AI_MODEL || '',

  openAiApiEnabled: !!process.env.OPEN_AI_API_ENABLED,
  openAiApiKey: process.env.OPEN_AI_API_KEY || '',
  openAiModel: process.env.OPEN_AI_MODEL || '',

  claudeAiApiEnabled: !!process.env.CLAUDE_AI_API_ENABLED,
  claudeAiApiKey: process.env.CLAUDE_AI_API_KEY || '',
  claudeAiModel: process.env.CLAUDE_AI_MODEL || '',

  lemonSqueezyApiKey: process.env.LEMON_SQUEEZY_API_KEY || '',
};

export { config };
