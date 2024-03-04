import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AIQueryRequest } from "./request.type";
import { AIProvideable } from "./api-providers";
import { AIService } from "../AIService";

const router = express.Router();

let aiProvider: AIProvideable = AIService.pickAIProvider();

router.post("/query", async (req: Request, res: Response) => {
  const { query }: AIQueryRequest = req.body;
  try {
    const queryResult: string = await aiProvider.query(query);
    res.json({ response: queryResult });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "Error processing request" });
  }
});

export { router };
