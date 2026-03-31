import { Request, Response } from "express";
import {
    bookingQuerySchema,
    createBookingSchema,
    updateBookingSchema,
} from "./bookings.validation";
import {
    createBooking,
    deleteBooking,
    getBookingById,
    getBookings,
    updateBooking,
} from "./bookings.service";
import type { BookingStatus } from "./bookings.types";

export async function createBookingHandler(req: Request, res: Response) {
    const validatedBody = createBookingSchema.parse(req.body);
    const booking = await createBooking(validatedBody);

    return res.status(201).json({
        success: true,
        data: booking,
    });
}

export async function getBookingsHandler(req: Request, res: Response) {
    const validatedQuery = bookingQuerySchema.parse(req.query);
    const bookings = await getBookings(validatedQuery);

    return res.status(200).json({
        success: true,
        ...bookings,
    });
}

export async function getBookingByIdHandler(req: Request, res: Response) {
    const { id } = req.params;
    const booking = await getBookingById(Array.isArray(id) ? id[0] : id);

    return res.status(200).json({
        success: true,
        data: booking,
    });
}

export async function updateBookingHandler(req: Request, res: Response) {
    const { id } = req.params;
    const validatedBody = updateBookingSchema.parse(req.body) as Partial<{ customerId: string; serviceId: string; title: string; notes: string; status: BookingStatus; startTime: string; endTime: string; }>;

    const booking = await updateBooking(Array.isArray(id) ? id[0] : id, validatedBody);

    return res.status(200).json({
        success: true,
        data: booking,
    });
}

export async function deleteBookingHandler(req: Request, res: Response) {
    const { id } = req.params;
    await deleteBooking(Array.isArray(id) ? id[0] : id);

    return res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
    });
}