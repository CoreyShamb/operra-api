import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";


type RequestSource = "body" | "query" | "params";

export function validate(schema: ZodType, source: RequestSource = "body") {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues.map((e: { path: PropertyKey[]; message: string }) => ({
                    field: e.path.map(String).join("."),
                    message: e.message,
                })),
            });
        }

        req[source] = result.data;
        return next();
    };
}
