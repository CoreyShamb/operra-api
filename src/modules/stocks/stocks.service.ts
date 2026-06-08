import axios from "axios";
import { finnhubService } from "./finnhub.service";

function getDateRange(daysBack = 7) {
    const to = new Date();
    const from = new Date();

    from.setDate(to.getDate() - daysBack);

    return {
        from: from.toISOString().split("T")[0],
        to: to.toISOString().split("T")[0],
    };
}

export const stocksService = {
    async searchStocks(query: string) {
        if (!query || query.trim().length < 1) {
            throw new Error("Search query is required");
        }

        const results = await finnhubService.searchSymbols(query.trim());

        return {
            count: results.count,
            results: results.result.map((item) => ({
                symbol: item.symbol,
                displaySymbol: item.displaySymbol,
                description: item.description,
                type: item.type,
            })),
        };
    },

    async getCompanyProfile(ticker: string) {
        if (!ticker || ticker.trim().length < 1) {
            throw new Error("Ticker is required");
        }

        const symbol = ticker.trim().toUpperCase();
        const profile = await finnhubService.getCompanyProfile(symbol);

        return {
            symbol,
            name: profile.name,
            country: profile.country,
            currency: profile.currency,
            exchange: profile.exchange,
            ipo: profile.ipo,
            marketCapitalization: profile.marketCapitalization,
            shareOutstanding: profile.shareOutstanding,
            website: profile.weburl,
            logo: profile.logo,
            industry: profile.finnhubIndustry,
            source: "Finnhub",
        };
    },

    async getCompanyNews(ticker: string) {
        if (!ticker || ticker.trim().length < 1) {
            throw new Error("Ticker is required");
        }

        const symbol = ticker.trim().toUpperCase();
        const { from, to } = getDateRange(7);

        const news = await finnhubService.getCompanyNews(symbol, from, to);

        return {
            symbol,
            from,
            to,
            source: "Finnhub",
            results: news.slice(0, 10).map((item) => ({
                id: item.id,
                headline: item.headline,
                summary: item.summary,
                source: item.source,
                category: item.category,
                url: item.url,
                image: item.image,
                datetime: item.datetime,
            })),
        };
    },

    async quote(ticker: string) {
        if (!ticker || ticker.trim().length < 1) {
            throw new Error("Ticker is required");
        }

        const symbol = ticker.trim().toUpperCase();

        const response = await axios.get("https://finnhub.io/api/v1/quote", {
            params: {
                symbol,
                token: process.env.FINNHUB_API_KEY,
            },
        });

        const quote = response.data;

        return {
            symbol,
            currentPrice: quote.c,
            change: quote.d,
            percentChange: quote.dp,
            highPrice: quote.h,
            lowPrice: quote.l,
            openPrice: quote.o,
            previousClose: quote.pc,
            timestamp: quote.t,
            source: "Finnhub",
        };
    },

    async quotes(symbolsInput: string) {
        if (!symbolsInput || symbolsInput.trim().length < 1) {
            throw new Error("Symbols query is required");
        }

        const symbols = symbolsInput
            .split(",")
            .map((symbol) => symbol.trim().toUpperCase())
            .filter(Boolean);

        if (symbols.length === 0) {
            throw new Error("At least one valid symbol is required");
        }

        const results = await Promise.all(
            symbols.map(async (symbol) => {
                const quote = await this.quote(symbol);

                return quote;
            })
        );

        return {
            count: results.length,
            source: "Finnhub",
            results,
        };
    },

    async getMarketMovers() {
        const symbols = [
            "AAPL",
            "MSFT",
            "NVDA",
            "TSLA",
            "AMZN",
            "GOOGL",
            "META",
            "AMD",
            "NFLX",
            "PLTR",
            "COIN",
            "AVGO",
            "CRM",
            "ORCL",
            "INTC",
        ];

        const quotes = await this.quotes(symbols.join(","));
        const results = quotes.results;

        const validResults = results.filter(
            (stock) =>
                typeof stock.percentChange === "number" &&
                typeof stock.change === "number"
        );

        const topGainers = [...validResults]
            .sort((a, b) => b.percentChange - a.percentChange)
            .slice(0, 5);

        const topLosers = [...validResults]
            .sort((a, b) => a.percentChange - b.percentChange)
            .slice(0, 5);

        const mostActive = [...validResults]
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
            .slice(0, 5);

        return {
            source: "Finnhub",
            timestamp: new Date().toISOString(),
            universe: symbols,
            topGainers,
            topLosers,
            mostActive,
        };
    },
};