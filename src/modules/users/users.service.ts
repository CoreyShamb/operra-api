import bcrypt from "bcrypt";
import {
    deleteUser,
    findUserByEmail,
    findUserById,
    findUserByIdWithPassword,
    updateUser,
} from "./users.repository";
import { ChangePasswordInput, UpdateProfileInput } from "./users.types";

export async function getUserById(id: string) {
    const user = await findUserById(id);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export async function updateProfile(id: string, input: UpdateProfileInput) {
    const existingUser = await findUserById(id);

    if (!existingUser) {
        throw new Error("User not found");
    }

    if (input.email && input.email !== existingUser.email) {
        const conflict = await findUserByEmail(input.email);

        if (conflict) {
            throw new Error("A user with this email already exists");
        }
    }

    return updateUser(id, {
        name: input.name,
        email: input.email,
    });
}

export async function changePassword(id: string, input: ChangePasswordInput) {
    const user = await findUserByIdWithPassword(id);

    if (!user) {
        throw new Error("User not found");
    }

    const passwordMatches = await bcrypt.compare(
        input.currentPassword,
        user.password
    );

    if (!passwordMatches) {
        throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);

    await updateUser(id, { password: hashedPassword });
}

export async function deleteAccount(id: string) {
    const user = await findUserById(id);

    if (!user) {
        throw new Error("User not found");
    }

    return deleteUser(id);
}
