import { z } from "zod";

const bookingStatusSchema = z.enum([
    "pending",
    "confirmed",
    "cancelled",
    "completed",
]);

export const createBookingSchema = z
    .object({
        organizationId: z
            .string()
            .uuid("organizationId must be a valid UUID"),

        customerId: z
            .string()
            .uuid("customerId must be a valid UUID")
            .optional(),

        serviceId: z
            .string()
            .uuid("serviceId must be a valid UUID")
            .optional(),

        title: z
            .string()
            .min(1, "title is required")
            .max(255, "title must be 255 characters or fewer"),

        notes: z
            .string()
            .max(2000, "notes must be 2000 characters or fewer")
            .optional(),

        startTime: z
            .string()
            .datetime("startTime must be a valid ISO datetime string"),

        endTime: z
            .string()
            .datetime("endTime must be a valid ISO datetime string"),
    })
    .refine(
        (data) => new Date(data.endTime).getTime() > new Date(data.startTime).getTime(),
        {
            message: "endTime must be later than startTime",
            path: ["endTime"],
        }
    );

export const updateBookingSchema: z.ZodType = z
    .object({
        customerId: z
            .string()
            .uuid("customerId must be a valid UUID")
            .optional(),

        serviceId: z
            .string()
            .uuid("serviceId must be a valid UUID")
            .optional(),

        title: z
            .string()
            .min(1, "title cannot be empty")
            .max(255, "title must be 255 characters or fewer")
            .optional(),

        notes: z
            .string()
            .max(2000, "notes must be 2000 characters or fewer")
            .optional(),

        status: bookingStatusSchema.optional(),

        startTime: z
            .string()
            .datetime("startTime must be a valid ISO datetime string")
            .optional(),

        endTime: z
            .string()
            .datetime("endTime must be a valid ISO datetime string")
            .optional(),
    })
    .refine(
        (data) => {
            if (data.startTime && data.endTime) {
                return new Date(data.endTime).getTime() > new Date(data.startTime).getTime();
            }
            return true;
        },
        {
            message: "endTime must be later than startTime",
            path: ["endTime"],
        }
    ) as z.ZodType<z.infer<typeof updateBookingSchema>>;

export const bookingQuerySchema = z.object({
    organizationId: z
        .string()
        .uuid("organizationId must be a valid UUID"),

    status: bookingStatusSchema.optional(),

    startDate: z
        .string()
        .datetime("startDate must be a valid ISO datetime string")
        .optional(),

    endDate: z
        .string()
        .datetime("endDate must be a valid ISO datetime string")
        .optional(),

    page: z.coerce
        .number()
        .int()
        .min(1, "page must be at least 1")
        .optional()
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1, "limit must be at least 1")
        .max(100, "limit cannot exceed 100")
        .optional()
        .default(20),
});

export type CreateBookingSchemaInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingSchemaInput = z.infer<typeof updateBookingSchema>;
export type BookingQuerySchemaInput = z.infer<typeof bookingQuerySchema>;