import { Request, Response } from "express";
import { generateAiResponse } from "./ai.service";
import { AiGenerateRequestBody } from "./ai.types";

export async function generateAiController(req: Request, res: Response) {
    try {
        const { prompt } = req.body as AiGenerateRequestBody;

        const result = await generateAiResponse(prompt);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("AI generation error:", error);

        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "AI request failed",
        });
    }
}