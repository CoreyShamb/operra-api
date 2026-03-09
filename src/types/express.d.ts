export interface ApiKeyAuthContext {
    apiKeyId: string;
    organizationId: string;
    keyPrefix: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
            apiKeyAuth?: ApiKeyAuthContext;
        }
    }
}