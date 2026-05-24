import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "./errors/app-error";
import { ErrorCodes } from "./errors/error-codes";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
    console.error("[errorMiddleware]", error);

    if (res.headersSent) {
        return;
    }

    if (error instanceof AppError) {
        return void res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message,
        });
    }

    if (error instanceof ZodError) {
        return void res.status(400).json({
            success: false,
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Validation failed",
            errors: error.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }

    const message =
        error instanceof Error ? error.message : "Internal server error";

    res.status(500).json({
        success: false,
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message,
    });
};
