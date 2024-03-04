export interface AIProvideable {
    sendQuery(query: string): Promise<string>;
}
