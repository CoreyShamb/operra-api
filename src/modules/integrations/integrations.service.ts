import {
    ConnectIntegrationInput,
    DisconnectIntegrationInput,
    Integration,
} from "./integrations.types";

export async function getIntegrationsByOrganization(
    organizationId: string
): Promise<{ data: Integration[] }> {
    return {
        data: [
            {
                provider: "stripe",
                status: "connected",
                organizationId,
                connectedAt: new Date(),
                updatedAt: new Date(),
            },
            {
                provider: "twilio",
                status: "disconnected",
                organizationId,
                connectedAt: null,
                updatedAt: new Date(),
            },
            {
                provider: "mailgun",
                status: "disconnected",
                organizationId,
                connectedAt: null,
                updatedAt: new Date(),
            },
            {
                provider: "webhook",
                status: "pending",
                organizationId,
                connectedAt: null,
                updatedAt: new Date(),
            },
        ],
    };
}

export async function connectIntegration(input: ConnectIntegrationInput) {
    return {
        success: true,
        message: `${input.provider} integration connected`,
        data: {
            provider: input.provider,
            status: "connected",
            organizationId: input.organizationId,
            connectedAt: new Date(),
            updatedAt: new Date(),
        },
    };
}

export async function disconnectIntegration(input: DisconnectIntegrationInput) {
    return {
        success: true,
        message: `${input.provider} integration disconnected`,
        data: {
            provider: input.provider,
            status: "disconnected",
            organizationId: input.organizationId,
            connectedAt: null,
            updatedAt: new Date(),
        },
    };
}