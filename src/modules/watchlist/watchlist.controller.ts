import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import { watchlistService } from "./watchlist.service";

export const watchlistController = {
    async add(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const { symbol } = req.body;

            const item = await watchlistService.add(userId, symbol);

            return res.status(201).json(item);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to add watchlist item",
            });
        }
    },

    async getAll(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const items = await watchlistService.getAll(userId);

            return res.status(200).json(items);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch watchlist",
            });
        }
    },

    async remove(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            const symbolParam = req.params.symbol;
            const symbol = Array.isArray(symbolParam) ? symbolParam[0] : symbolParam;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            if (!symbol) {
                return res.status(400).json({
                    success: false,
                    message: "Symbol is required",
                });
            }

            await watchlistService.remove(userId, symbol);

            return res.status(200).json({
                success: true,
                message: "Watchlist item removed",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to remove watchlist item",
            });
        }
    },
};