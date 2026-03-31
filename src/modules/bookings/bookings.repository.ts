import { prisma } from "../../lib/prisma";
import {
    BookingQueryParams,
    CreateBookingInput,
    UpdateBookingInput,
} from "./bookings.types";

export async function createBooking(data: {
    organizationId: string;
    customerId?: string;
    serviceId?: string;
    title: string;
    notes?: string;
    status?: "pending" | "confirmed" | "cancelled" | "completed";
    startTime: Date;
    endTime: Date;
}) {
    return prisma.booking.create({
        data: {
            organizationId: data.organizationId,
            customerId: data.customerId,
            serviceId: data.serviceId,
            title: data.title,
            notes: data.notes,
            status: data.status ?? "pending",
            startTime: data.startTime,
            endTime: data.endTime,
        },
    });
}

export async function findBookingById(id: string) {
    return prisma.booking.findUnique({
        where: { id },
    });
}

export async function findBookings(params: BookingQueryParams) {
    const {
        organizationId,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 20,
    } = params;

    const skip = (page - 1) * limit;

    const where = {
        organizationId,
        ...(status ? { status } : {}),
        ...(startDate || endDate
            ? {
                startTime: {
                    ...(startDate ? { gte: new Date(startDate) } : {}),
                    ...(endDate ? { lte: new Date(endDate) } : {}),
                },
            }
            : {}),
    };

    const [data, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            orderBy: {
                startTime: "asc",
            },
            skip,
            take: limit,
        }),
        prisma.booking.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        limit,
    };
}

export async function updateBooking(
    id: string,
    data: {
        customerId?: string;
        serviceId?: string;
        title?: string;
        notes?: string;
        status?: "pending" | "confirmed" | "cancelled" | "completed";
        startTime?: Date;
        endTime?: Date;
    }
) {
    return prisma.booking.update({
        where: { id },
        data: {
            ...(data.customerId !== undefined ? { customerId: data.customerId } : {}),
            ...(data.serviceId !== undefined ? { serviceId: data.serviceId } : {}),
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.notes !== undefined ? { notes: data.notes } : {}),
            ...(data.status !== undefined ? { status: data.status } : {}),
            ...(data.startTime !== undefined ? { startTime: data.startTime } : {}),
            ...(data.endTime !== undefined ? { endTime: data.endTime } : {}),
        },
    });
}

export async function deleteBooking(id: string) {
    return prisma.booking.delete({
        where: { id },
    });
}

export async function countBookingsThisMonth(organizationId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return prisma.booking.count({
        where: {
            organizationId,
            createdAt: {
                gte: startOfMonth,
            },
        },
    });
}

export async function findConflictingBooking(params: {
    organizationId: string;
    startTime: Date;
    endTime: Date;
    excludeBookingId?: string;
}) {
    const { organizationId, startTime, endTime, excludeBookingId } = params;

    return prisma.booking.findFirst({
        where: {
            organizationId,
            ...(excludeBookingId
                ? {
                    id: {
                        not: excludeBookingId,
                    },
                }
                : {}),
            startTime: {
                lt: endTime,
            },
            endTime: {
                gt: startTime,
            },
            status: {
                not: "cancelled",
            },
        },
        orderBy: {
            startTime: "asc",
        },
    });
}