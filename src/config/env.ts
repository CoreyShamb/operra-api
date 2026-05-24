import "dotenv/config";

function requireEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
}

function optionalEnv(key: string, defaultValue?: string): string | undefined {
    return process.env[key] ?? defaultValue;
}

// Critical vars are validated at startup — the app will not boot if missing.
// Integration vars (Stripe, Mailgun, Twilio) are optional here and validated
// lazily inside each integration service when first used.
export const env = {
    // Server
    NODE_ENV: (optionalEnv("NODE_ENV", "development") as "development" | "production" | "test"),
    PORT: parseInt(optionalEnv("PORT", "3000")!, 10),
    FRONTEND_URL: optionalEnv("FRONTEND_URL", "http://localhost:3000")!,

    // Database
    DATABASE_URL: requireEnv("DATABASE_URL"),

    // Auth
    JWT_SECRET: requireEnv("JWT_SECRET"),

    // Redis
    REDIS_URL: requireEnv("REDIS_URL"),

    // Stripe
    STRIPE_SECRET_KEY: optionalEnv("STRIPE_SECRET_KEY"),
    STRIPE_WEBHOOK_SECRET: optionalEnv("STRIPE_WEBHOOK_SECRET"),
    STRIPE_PRICE_STARTER: optionalEnv("STRIPE_PRICE_STARTER"),
    STRIPE_PRICE_GROWTH: optionalEnv("STRIPE_PRICE_GROWTH"),
    STRIPE_PRICE_BUSINESS: optionalEnv("STRIPE_PRICE_BUSINESS"),
    STRIPE_PRICE_PROFESSIONAL: optionalEnv("STRIPE_PRICE_PRO") ?? optionalEnv("STRIPE_PRICE_PROFESSIONAL"),

    // Mailgun
    MAILGUN_API_KEY: optionalEnv("MAILGUN_API_KEY"),
    MAILGUN_DOMAIN: optionalEnv("MAILGUN_DOMAIN"),
    MAILGUN_FROM_EMAIL: optionalEnv("MAILGUN_FROM_EMAIL"),

    // Twilio
    TWILIO_ACCOUNT_SID: optionalEnv("TWILIO_ACCOUNT_SID"),
    TWILIO_AUTH_TOKEN: optionalEnv("TWILIO_AUTH_TOKEN"),
    TWILIO_PHONE_NUMBER: optionalEnv("TWILIO_PHONE_NUMBER"),

    // AWS Bedrock
    AWS_REGION: optionalEnv("AWS_REGION", "us-east-1")!,
    AWS_BEDROCK_MODEL_ID: optionalEnv("AWS_BEDROCK_MODEL_ID", "us.anthropic.claude-sonnet-4-6")!,

    get isProduction() {
        return this.NODE_ENV === "production";
    },

    get isDevelopment() {
        return this.NODE_ENV === "development";
    },
};
