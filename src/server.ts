import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { MistralAiAdapter } from './MistralAiAdapter';
import { AIProvideable } from './AIProvideable';

dotenv.config();

// Now you can use process.env to access your environment variables
const port: string | number = process.env.PORT || 3000;

// Initialize your AI provider here. You can switch to different providers as needed.
const aiProvider: AIProvideable = new MistralAiAdapter(process.env.AI_API_KEY || '');

const app: Express = express();

app.use(express.json());

interface AIQueryRequest {
    query: string;
}

app.post('/query', async (req: Request, res: Response) => {
    const { query }: AIQueryRequest = req.body;
    try {
        const queryResult: string = await aiProvider.sendQuery(query);
        res.json({ response: queryResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Error processing request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
