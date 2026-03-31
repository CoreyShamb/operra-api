import { prisma } from "../../lib/prisma";
import { CustomerQueryParams } from "./customers.types";

export async function createCustomer(data: {
    organizationId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    notes?: string;
}) {
    return prisma.customer.create({
        data: {
            organizationId: data.organizationId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            notes: data.notes,
        },
    });
}

export async function findCustomerById(id: string) {
    return prisma.customer.findUnique({
        where: { id },
    });
}

export async function findCustomerByEmail(params: {
    organizationId: string;
    email: string;
}) {
    return prisma.customer.findFirst({
        where: {
            organizationId: params.organizationId,
            email: params.email,
        },
    });
}

export async function findCustomerByPhone(params: {
    organizationId: string;
    phone: string;
}) {
    return prisma.customer.findFirst({
        where: {
            organizationId: params.organizationId,
            phone: params.phone,
        },
    });
}

export async function findCustomers(params: CustomerQueryParams) {
    const { organizationId, search, page = 1, limit = 20 } = params;

    const skip = (page - 1) * limit;

    const where = {
        organizationId,
        ...(search
            ? {
                OR: [
                    {
                        firstName: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        lastName: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        phone: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }
            : {}),
    };

    const [data, total] = await Promise.all([
        prisma.customer.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.customer.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        limit,
    };
}

export async function updateCustomer(
    id: string,
    data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        notes?: string;
    }
) {
    return prisma.customer.update({
        where: { id },
        data: {
            ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
            ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
            ...(data.email !== undefined ? { email: data.email } : {}),
            ...(data.phone !== undefined ? { phone: data.phone } : {}),
            ...(data.notes !== undefined ? { notes: data.notes } : {}),
        },
    });
}

export async function deleteCustomer(id: string) {
    return prisma.customer.delete({
        where: { id },
    });
}