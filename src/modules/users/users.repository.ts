import { prisma } from "../../lib/prisma";

export async function findUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function findUserByIdWithPassword(id: string) {
    return prisma.user.findUnique({
        where: { id },
    });
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function updateUser(
    id: string,
    data: {
        name?: string;
        email?: string;
        password?: string;
    }
) {
    return prisma.user.update({
        where: { id },
        data: {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.email !== undefined ? { email: data.email } : {}),
            ...(data.password !== undefined ? { password: data.password } : {}),
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function deleteUser(id: string) {
    return prisma.user.delete({
        where: { id },
    });
}
