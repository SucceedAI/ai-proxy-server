import { jwt } from "jsonwebtoken";
require("dotenv").config();

interface ConfigProps {
  // App Server
  port: string | number;
  jwtToken: string;

  // Mistral AI
  mistralAiApiEnabled: boolean;
  mistralAiApiKey: string;
  mistralAiModel: string;

  // OpenAI
  openAiApiEnabled: boolean;
  openAiApiKey: string;
  openAiModel: string;
}

const config: ConfigProps = {
  port: process.env.APP_PORT || 3000,
  jwtToken: process.env.JWT_SECRET || "jwt-secret",

  mistralAiApiEnabled: !!process.env.MISTRAL_AI_API_ENABLED,
  mistralAiApiKey: process.env.MISTRAL_AI_API_KEY || "",
  mistralAiModel: process.env.MISTRAL_AI_MODEL || "",

  openAiApiEnabled: !!process.env.OPEN_AI_API_ENABLED,
  openAiApiKey: process.env.OPEN_AI_API_KEY || "",
  openAiModel: process.env.OPEN_AI_MODEL || "",
};

export { config };
