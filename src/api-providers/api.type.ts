export interface AIProvideable {
    query(query: string): Promise<string>;
    buildPayload(query: string): PayloadProps;
}

export interface PayloadProps {
    model: string;
    messages: Array<{role: string, content: string}>;
}
