import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../../modules/auth/auth.types";

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Missing or invalid Authorization header",
        });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JWTPayload;

        req.user = { userId: payload.userId, email: payload.email };

        return next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}
