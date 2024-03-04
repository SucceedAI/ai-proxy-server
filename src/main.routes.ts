import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config";

const router = express.Router();

router.post("/token-generator", (req, res) => {
  // Authentication logic here...

  const token = jwt.sign(
    {
      /* user data */
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h", // expires in 1 hour
    }
  );

  res.send({ token });
});

router.get("/health", async (req: Request, res: Response) => {
  res.json({ health: true });
});

router.get("/version", async (req: Request, res: Response) => {
  // get version from package.json

  res.json({ version: 1.0 });
});

export { router };
