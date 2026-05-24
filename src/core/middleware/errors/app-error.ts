import { ErrorCode, ErrorCodes } from "./error-codes";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: ErrorCode;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, code: ErrorCode) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message: string) {
        return new AppError(message, 400, ErrorCodes.BAD_REQUEST);
    }

    static unauthorized(message = "Authentication required") {
        return new AppError(message, 401, ErrorCodes.UNAUTHORIZED);
    }

    static forbidden(message = "You do not have permission to perform this action") {
        return new AppError(message, 403, ErrorCodes.FORBIDDEN);
    }

    static notFound(message: string) {
        return new AppError(message, 404, ErrorCodes.NOT_FOUND);
    }

    static conflict(message: string) {
        return new AppError(message, 409, ErrorCodes.CONFLICT);
    }

    static rateLimitExceeded(message = "Rate limit exceeded") {
        return new AppError(message, 429, ErrorCodes.RATE_LIMIT_EXCEEDED);
    }

    static internal(message = "Internal server error") {
        return new AppError(message, 500, ErrorCodes.INTERNAL_SERVER_ERROR);
    }
}
