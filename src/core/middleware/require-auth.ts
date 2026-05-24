import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "./auth.middleware";

// Drop-in middleware that requires a valid JWT. Delegates to verifyJwt and
// returns 401 if the token is missing or invalid.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    return verifyJwt(req, res, next);
}
