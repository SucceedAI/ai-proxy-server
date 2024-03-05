export type AIProvidable = {
  query(query: string): Promise<string>;
  buildPayload(query: string): PayloadProps;
}

export type Role = 'user' | 'system' | 'assistant';

export type PayloadProps = {
  model: string;
  messages: Array<{ role: Role; content: string }>;
}
