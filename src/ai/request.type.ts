export type AIQueryRequest = {
  query: string;
  systemInfo?: systemInfo;
};

type systemInfo = {
  osVersion?: string;
  osName?: string;
  model?: string;
};
