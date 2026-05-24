export type EndpointSummary = {
    path: string;
    count: number;
};

export type StatusCodeSummary = {
    statusCode: number;
    count: number;
};

export type UsageAnalytics = {
    todayRequests: number;
    monthRequests: number;
    topEndpoints: EndpointSummary[];
    statusCodes: StatusCodeSummary[];
};

export type DailyUsagePoint = {
    date: string;
    count: number;
};

export type EndpointDailyUsagePoint = {
    date: string;
    path: string;
    count: number;
};

export type StatusCodeDailyPoint = {
    date: string;
    statusCode: number;
    count: number;
};

export type DailyUsageQueryParams = {
    days?: number;
};

export type EndpointDailyUsageQueryParams = {
    days?: number;
    path?: string;
};

export type StatusCodeDailyQueryParams = {
    days?: number;
    statusCode?: number;
};
