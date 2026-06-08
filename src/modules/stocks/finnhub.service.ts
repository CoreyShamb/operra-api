const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

function getFinnhubApiKey() {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
        throw new Error("FINNHUB_API_KEY is not configured");
    }

    return apiKey;
}

async function requestFinnhub<T>(
    endpoint: string,
    params: Record<string, string> = {}
): Promise<T> {
    const apiKey = getFinnhubApiKey();

    const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    url.searchParams.append("token", apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Finnhub request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
}


export type FinnhubSearchResult = {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
};

export type FinnhubSearchResponse = {
    count: number;
    result: FinnhubSearchResult[];
};

export type FinnhubCompanyProfile = {
    country?: string;
    currency?: string;
    exchange?: string;
    ipo?: string;
    marketCapitalization?: number;
    name?: string;
    phone?: string;
    shareOutstanding?: number;
    ticker?: string;
    weburl?: string;
    logo?: string;
    finnhubIndustry?: string;
};

export type FinnhubCompanyNews = {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
};

export const finnhubService = {
    searchSymbols(query: string) {
        return requestFinnhub<FinnhubSearchResponse>("/search", {
            q: query,
        });
    },

    getCompanyProfile(symbol: string) {
        return requestFinnhub<FinnhubCompanyProfile>("/stock/profile2", {
            symbol,
        });
    },

    getCompanyNews(symbol: string, from: string, to: string) {
        return requestFinnhub<FinnhubCompanyNews[]>("/company-news", {
            symbol,
            from,
            to,
        });
    },
};

