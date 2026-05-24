import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import { changePasswordSchema, updateProfileSchema } from "./users.schemas";
import {
    changePassword,
    deleteAccount,
    getUserById,
    updateProfile,
} from "./users.service";

export async function getMeHandler(req: AuthRequest, res: Response) {
    const user = await getUserById(req.user!.userId);

    return res.status(200).json({
        success: true,
        data: user,
    });
}

export async function updateMeHandler(req: AuthRequest, res: Response) {
    const validatedBody = updateProfileSchema.parse(req.body);
    const user = await updateProfile(req.user!.userId, validatedBody);

    return res.status(200).json({
        success: true,
        data: user,
    });
}

export async function changePasswordHandler(req: AuthRequest, res: Response) {
    const validatedBody = changePasswordSchema.parse(req.body);
    await changePassword(req.user!.userId, validatedBody);

    return res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
}

export async function deleteMeHandler(req: AuthRequest, res: Response) {
    await deleteAccount(req.user!.userId);

    return res.status(200).json({
        success: true,
        message: "Account deleted successfully",
    });
}
