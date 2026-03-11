import "express";

declare global {
    namespace Express {
        interface Request {
            organization?: {
                id: string;
                name: string;
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

export { };