import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { AIProvideable } from './api-providers';
import { AIService } from './AiService';

// load env variables
dotenv.config();

const port: string | number = process.env.APP_PORT || 3000;

const app: Express = express();

let aiProvider: AIProvideable = AIService.pickAIProvider();

app.use(express.json());

interface AIQueryRequest {
    query: string;
}

app.post('/query', async (req: Request, res: Response) => {
    const { query }: AIQueryRequest = req.body;
    try {
        const queryResult: string = await aiProvider.query(query);
        res.json({ response: queryResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Error processing request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
