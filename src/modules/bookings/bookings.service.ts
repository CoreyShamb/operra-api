import {
    createBooking as createBookingRecord,
    deleteBooking as deleteBookingRecord,
    findBookingById,
    findBookings,
    findConflictingBooking,
    updateBooking as updateBookingRecord,
} from "./bookings.repository";
import {
    BookingQueryParams,
    CreateBookingInput,
    UpdateBookingInput,
} from "./bookings.types";
import { enforceBookingLimits } from "./hooks/enforceBookingLimits";
import { findCustomerById } from "../customers/customers.repository";
import { sendMailgunEmail } from "../integrations/mailgun/mailgun.service";
import { sendWebhook } from "../integrations/webhook/webhook.service";

export async function createBooking(input: CreateBookingInput) {
    await enforceBookingLimits(input.organizationId);

    const startTime = new Date(input.startTime);
    const endTime = new Date(input.endTime);

    const conflictingBooking = await findConflictingBooking({
        organizationId: input.organizationId,
        startTime,
        endTime,
    });

    if (conflictingBooking) {
        throw new Error("Booking conflicts with an existing scheduled booking");
    }

    const booking = await createBookingRecord({
        organizationId: input.organizationId,
        customerId: input.customerId,
        serviceId: input.serviceId,
        title: input.title,
        notes: input.notes,
        startTime,
        endTime,
        status: "pending",
    });

    try {
        await sendWebhook({
            url: "https://webhook.site/21a4c18a-53b1-47b1-99c4-ba8e033f50c6",
            event: "booking.created",
            payload: {
                id: booking.id,
                organizationId: booking.organizationId,
                customerId: booking.customerId,
                serviceId: booking.serviceId,
                title: booking.title,
                notes: booking.notes,
                status: booking.status,
                startTime: booking.startTime,
                endTime: booking.endTime,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
            },
        });
    } catch (error) {
        console.error("[Bookings] Failed to send booking.created webhook:", error);
    }

    if (booking.customerId) {
        try {
            const customer = await findCustomerById(booking.customerId);

            if (customer?.email) {
                await sendMailgunEmail({
                    to: customer.email,
                    subject: "Booking Confirmation",
                    text: [
                        `Hello ${customer.firstName},`,
                        "",
                        `Your booking "${booking.title}" has been created successfully.`,
                        `Start: ${booking.startTime.toISOString()}`,
                        `End: ${booking.endTime.toISOString()}`,
                        booking.notes ? `Notes: ${booking.notes}` : "",
                        "",
                        "Thank you,",
                        "Operra",
                    ]
                        .filter(Boolean)
                        .join("\n"),
                });
            }
        } catch (error) {
            console.error(
                "[Bookings] Failed to send booking confirmation email:",
                error
            );
        }
    }

    return booking;
}

export async function getBookingById(id: string) {
    const booking = await findBookingById(id);

    if (!booking) {
        throw new Error("Booking not found");
    }

    return booking;
}

export async function getBookings(params: BookingQueryParams) {
    return findBookings(params);
}

export async function updateBooking(id: string, input: UpdateBookingInput) {
    const existingBooking = await findBookingById(id);

    if (!existingBooking) {
        throw new Error("Booking not found");
    }

    const startTime = input.startTime
        ? new Date(input.startTime)
        : existingBooking.startTime;

    const endTime = input.endTime
        ? new Date(input.endTime)
        : existingBooking.endTime;

    const conflictingBooking = await findConflictingBooking({
        organizationId: existingBooking.organizationId,
        startTime,
        endTime,
        excludeBookingId: existingBooking.id,
    });

    if (conflictingBooking) {
        throw new Error(
            "Updated booking conflicts with an existing scheduled booking"
        );
    }

    const updatedBooking = await updateBookingRecord(id, {
        customerId: input.customerId,
        serviceId: input.serviceId,
        title: input.title,
        notes: input.notes,
        status: input.status,
        startTime: input.startTime ? new Date(input.startTime) : undefined,
        endTime: input.endTime ? new Date(input.endTime) : undefined,
    });

    return updatedBooking;
}

export async function deleteBooking(id: string) {
    const existingBooking = await findBookingById(id);

    if (!existingBooking) {
        throw new Error("Booking not found");
    }

    return deleteBookingRecord(id);
}