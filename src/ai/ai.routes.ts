import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AIQueryRequest } from "./request.type";
import { AIProvideable } from "./api-providers";
import { AIService } from "../AIService";
import { logger } from '../logger';

const router = express.Router();

let aiProvider: AIProvideable = AIService.pickAIProvider();

router.post("/query", async (req: Request, res: Response) => {
  const { query, systemInfo }: AIQueryRequest = req.body;

  logger.info("Request System Info", systemInfo);

  try {
    const queryResult: string = await aiProvider.query(query);

    res.json({ response: queryResult });
  } catch (error) {
    logger.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "Error processing request" });
  }
});

export { router };
