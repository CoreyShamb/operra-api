import { Request, Response } from "express";
import { stocksService } from "./stocks.service";

export const stocksController = {
    async search(req: Request, res: Response) {
        try {
            const query = req.query.q as string;

            const results = await stocksService.searchStocks(query);

            return res.status(200).json(results);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error ? error.message : "Failed to search stocks",
            });
        }
    },

    async profile(req: Request, res: Response) {
        try {
            const symbol = Array.isArray(req.params.symbol)
                ? req.params.symbol[0]
                : req.params.symbol;

            if (!symbol) {
                throw new Error("Symbol parameter is required");
            }

            const profile = await stocksService.getCompanyProfile(symbol);

            return res.status(200).json(profile);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch company profile",
            });
        }
    },

    async news(req: Request, res: Response) {
        try {
            const symbol = Array.isArray(req.params.symbol)
                ? req.params.symbol[0]
                : req.params.symbol;

            if (!symbol) {
                throw new Error("Symbol parameter is required");
            }

            const news = await stocksService.getCompanyNews(symbol);

            return res.status(200).json(news);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch company news",
            });
        }
    },

    async quote(req: Request, res: Response) {
        try {
            const symbol = Array.isArray(req.params.symbol)
                ? req.params.symbol[0]
                : req.params.symbol;

            if (!symbol) {
                throw new Error("Symbol parameter is required");
            }

            const data = await stocksService.quote(symbol);

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch stock quote",
            });
        }
    },

    async quotes(req: Request, res: Response) {
        try {
            const symbols = req.query.symbols as string;

            const data = await stocksService.quotes(symbols);

            return res.status(200).json(data);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch stock quotes",
            });
        }
    },

    async movers(req: Request, res: Response) {
        try {
            const svc: any = stocksService;
            const getMovers = svc.getMarketMovers || svc.movers;
            if (!getMovers) {
                throw new Error("Market movers method is not implemented on stocksService");
            }

            const data = await getMovers.call(svc);

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch market movers",
            });
        }
    },
};