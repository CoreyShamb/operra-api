export { };

declare global {
    namespace Express {
        interface Request {
            apiKeyAuth?: {
                apiKeyId: string;
                organizationId: string;
                keyPrefix: string;
            };
        }
    }
}
