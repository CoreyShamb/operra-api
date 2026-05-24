import { NextFunction, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../modules/auth/auth.middleware";
import { Action, Role } from "./permissions.types";
import { can, hasMinimumRole } from "./permissions";

function resolveOrganizationId(req: AuthRequest): string | undefined {
    return (
        req.params.organizationId ||
        req.body?.organizationId ||
        (req.query.organizationId as string | undefined)
    );
}

async function getMembershipRole(
    userId: string,
    organizationId: string
): Promise<Role | null> {
    const membership = await prisma.membership.findUnique({
        where: {
            userId_organizationId: { userId, organizationId },
        },
        select: { role: true },
    });

    return (membership?.role as Role) ?? null;
}

// Middleware that requires the authenticated user to hold at least `minimumRole`
// in the organization resolved from the request.
export function requireRole(minimumRole: Role) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const organizationId = resolveOrganizationId(req);

            if (!organizationId) {
                return res.status(400).json({
                    success: false,
                    message: "organizationId is required",
                });
            }

            const role = await getMembershipRole(req.user.userId, organizationId);

            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a member of this organization",
                });
            }

            if (!hasMinimumRole(role, minimumRole)) {
                return res.status(403).json({
                    success: false,
                    message: `This action requires the '${minimumRole}' role or higher`,
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

// Middleware that requires the user to have a specific permission action.
export function requirePermission(action: Action) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const organizationId = resolveOrganizationId(req);

            if (!organizationId) {
                return res.status(400).json({
                    success: false,
                    message: "organizationId is required",
                });
            }

            const role = await getMembershipRole(req.user.userId, organizationId);

            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a member of this organization",
                });
            }

            if (!can(role, action)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to perform this action",
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

// Lightweight guard for use inside service/controller logic (no HTTP response).
// Returns the user's role or throws if not a member.
export async function assertMembership(
    userId: string,
    organizationId: string
): Promise<Role> {
    const role = await getMembershipRole(userId, organizationId);

    if (!role) {
        throw new Error("You are not a member of this organization");
    }

    return role;
}
