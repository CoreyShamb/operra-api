export function isSupportedIntegration(provider: string) {
    return ["stripe", "twilio", "mailgun", "webhook"].includes(provider);
}