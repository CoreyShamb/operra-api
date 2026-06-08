import { prisma } from "../../database/prisma";
import { stocksService } from "../stocks/stocks.service";

export const watchlistService = {
    async add(userId: string, symbol: string) {
        return prisma.watchlistItem.upsert({
            where: {
                userId_symbol: {
                    userId,
                    symbol: symbol.toUpperCase(),
                },
            },
            update: {},
            create: {
                userId,
                symbol: symbol.toUpperCase(),
            },
        });
    },

   async getAll(userId: string) {
    const items = await prisma.watchlistItem.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    if (items.length === 0) {
        return {
            count: 0,
            results: [],
        };
    }

    const symbols = items.map((item) => item.symbol).join(",");

    const quotes = await stocksService.quotes(symbols);

    return {
        count: items.length,
        results: quotes.results.map((quote) => ({
            ...quote,
            watchlistItemId: items.find((item) => item.symbol === quote.symbol)?.id,
            addedAt: items.find((item) => item.symbol === quote.symbol)?.createdAt,
        })),
    };
},

    async remove(userId: string, symbol: string) {
        return prisma.watchlistItem.delete({
            where: {
                userId_symbol: {
                    userId,
                    symbol: symbol.toUpperCase(),
                },
            },
        });
    },
};