export type AIQueryRequest = {
  query: string;
  systemInfo?: SystemInfo;
};

export type SystemInfo = {
  osVersion?: string;
  osName?: string;
  model?: string;
};

export type BodyResponse = {
  content: string;
  model: string;
};
