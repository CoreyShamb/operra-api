import { Request, Response } from "express";
import {
  createApiKey as createApiKeyService,
  listApiKeys as listApiKeysService,
  revokeApiKey as revokeApiKeyService,
} from "./api-keys.service";

export const createApiKey = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params as { organizationId: string };
    const { name, expiresAt } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "API key name is required",
      });
    }

    const result = await createApiKeyService({
      organizationId,
      name,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

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

    const apiKeys = await listApiKeysService(organizationId);

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
    const { apiKeyId } = req.params as { apiKeyId: string };

    await revokeApiKeyService(apiKeyId);

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