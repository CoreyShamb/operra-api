export type IntegrationProvider =
    | "stripe"
    | "twilio"
    | "mailgun"
    | "webhook";

export type IntegrationStatus =
    | "connected"
    | "disconnected"
    | "pending"
    | "error";

export type Integration = {
    provider: IntegrationProvider;
    status: IntegrationStatus;
    organizationId: string;
    connectedAt?: Date | null;
    updatedAt?: Date | null;
};

export type ConnectIntegrationInput = {
    organizationId: string;
    provider: IntegrationProvider;
};

export type DisconnectIntegrationInput = {
    organizationId: string;
    provider: IntegrationProvider;
};

export type IntegrationQueryParams = {
    organizationId: string;
};

export type IntegrationListResponse = {
    data: Integration[];
};