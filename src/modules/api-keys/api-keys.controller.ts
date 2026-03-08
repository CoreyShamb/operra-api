import { Request, Response } from "express";
import { ApiKeysService } from "./api-keys.service";

const apiKeysService = new ApiKeysService();

export const createApiKey = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.params as { organizationId: string };
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "API key name is required",
            });
        }

        const result = await apiKeysService.createApiKey(organizationId, name);

        return res.status(201).json({
            success: true,
            message: "API key created successfully",
            data: result,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create API key";

        return res.status(500).json({
            success: false,
            message,
        });
    }
};

export const getApiKeys = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.params as { organizationId: string };

        const apiKeys = await apiKeysService.getOrganizationApiKeys(organizationId);

        return res.json({
            success: true,
            data: apiKeys,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to fetch API keys";

        return res.status(500).json({
            success: false,
            message,
        });
    }
};

export const revokeApiKey = async (req: Request, res: Response) => {
    try {
        const { organizationId, apiKeyId } = req.params as { organizationId: string; apiKeyId: string };

        await apiKeysService.revokeApiKey(apiKeyId, organizationId);

        return res.json({
            success: true,
            message: "API key revoked successfully",
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to revoke API key";

        return res.status(500).json({
            success: false,
            message,
        });
    }
};