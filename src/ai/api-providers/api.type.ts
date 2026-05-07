/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

export type AIProvidable = {
  query(query: string): Promise<string>;
  getModel(): string;
  getProviderName(): string;
  buildPayload(query: string): PayloadProps;
};

export type Role = 'user' | 'system' | 'assistant';

export type PayloadProps = Record<string, unknown>;
