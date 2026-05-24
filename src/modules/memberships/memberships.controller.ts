import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import {
    addMemberSchema,
    membershipQuerySchema,
    updateMemberRoleSchema,
} from "./memberships.schemas";
import {
    addMember,
    getMembers,
    removeMember,
    updateMemberRole,
} from "./memberships.service";

export async function getMembersHandler(req: AuthRequest, res: Response) {
    const validatedQuery = membershipQuerySchema.parse(req.query);
    const members = await getMembers(validatedQuery);

    return res.status(200).json({
        success: true,
        data: members,
    });
}

export async function addMemberHandler(req: AuthRequest, res: Response) {
    const validatedBody = addMemberSchema.parse(req.body);
    const membership = await addMember(validatedBody);

    return res.status(201).json({
        success: true,
        data: membership,
    });
}

export async function updateMemberRoleHandler(req: AuthRequest, res: Response) {
    const idParam = req.params.id;

    if (Array.isArray(idParam) || !idParam) {
        return res.status(400).json({
            success: false,
            message: "Invalid membership id",
        });
    }

    const validatedBody = updateMemberRoleSchema.parse(req.body);
    const membership = await updateMemberRole(idParam, validatedBody);

    return res.status(200).json({
        success: true,
        data: membership,
    });
}

export async function removeMemberHandler(req: AuthRequest, res: Response) {
    const idParam = req.params.id;

    if (Array.isArray(idParam) || !idParam) {
        return res.status(400).json({
            success: false,
            message: "Invalid membership id",
        });
    }

    await removeMember(idParam);

    return res.status(200).json({
        success: true,
        message: "Member removed successfully",
    });
}
