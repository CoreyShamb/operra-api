import { Response } from "express";
import { OrganizationsService } from "./organizations.service";
import { AuthRequest } from "../auth/auth.middleware";

const organizationsService = new OrganizationsService();

export const createOrganization = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Organization name is required",
            });
        }

        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const organization = await organizationsService.createOrganization(
            req.user.userId,
            name
        );

        return res.status(201).json({
            success: true,
            message: "Organization created successfully",
            data: organization,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create organization";

        return res.status(500).json({
            success: false,
            message,
        });
    }
};

export const getOrganizations = async (req: AuthRequest, res: Response) => {
    try {
        const orgs = await organizationsService.getUserOrganizations(
            req.user!.userId
        );

        return res.json({
            success: true,
            data: orgs
        });

    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch organizations"
        });
    }
};