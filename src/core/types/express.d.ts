export { };

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
            apiKeyAuth?: {
                apiKeyId: string;
                organizationId: string;
                keyPrefix: string;
            };
            organization?: {
                id: string;
                name: string;
                plan: string;
                subscriptionStatus: string | null;
                stripeCustomerId: string | null;
                stripeSubscriptionId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            apiKey?: {
                id: string;
                prefix: string;
                organizationId: string;
            };
        }
    }
}
