import { Request, Response } from "express";
import {
    connectIntegration,
    disconnectIntegration,
    getIntegrationsByOrganization,
} from "./integrations.service";
import {
    connectIntegrationSchema,
    disconnectIntegrationSchema,
    integrationQuerySchema,
} from "./integrations.validation";

export async function getIntegrationsHandler(req: Request, res: Response) {
    const validatedQuery = integrationQuerySchema.parse(req.query);

    const integrations = await getIntegrationsByOrganization(
        validatedQuery.organizationId
    );

    return res.status(200).json({
        success: true,
        ...integrations,
    });
}

export async function connectIntegrationHandler(req: Request, res: Response) {
    const validatedBody = connectIntegrationSchema.parse(req.body);

    const result = await connectIntegration(validatedBody);

    return res.status(200).json(result);
}

export async function disconnectIntegrationHandler(
    req: Request,
    res: Response
) {
    const validatedBody = disconnectIntegrationSchema.parse(req.body);

    const result = await disconnectIntegration(validatedBody);

    return res.status(200).json(result);
}