import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { loginSchema, registerSchema } from "./auth.schemas";
import { AuthService } from "./auth.service";
import { AuthRequest } from "./auth.middleware";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const validatedBody = registerSchema.parse(req.body);

        const user = await authService.registerUser(validatedBody);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Registration failed";

        return res.status(400).json({
            success: false,
            message,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validatedBody = loginSchema.parse(req.body);

        const user = await authService.loginUser(
            validatedBody.email,
            validatedBody.password
        );

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Login failed";

        return res.status(401).json({
            success: false,
            message,
        });
    }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user?.userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        return res.json({
            success: true,
            data: user,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};
