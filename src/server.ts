import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import MistralAiAdapter from './MistralAiAdapter'; // Import your Mistral AI Adapter
import AIProvideable from './AIProvideable';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize your AI provider here. You can switch to different providers as needed.
const aiProvider: AIProvideable = new MistralAiAdapter(process.env.AI_API_KEY);

app.use(bodyParser.json());

app.post('/query', async (req, res) => {
    try {
        const { query } = req.body;
        const response = await aiProvider.sendQuery(query);
        res.json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing your request');
    }
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
