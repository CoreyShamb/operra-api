import { z } from "zod";

const daysSchema = z.coerce
    .number()
    .int()
    .min(1, "days must be at least 1")
    .max(90, "days cannot exceed 90")
    .optional()
    .default(7);

export const dailyUsageQuerySchema = z.object({
    days: daysSchema,
});

export const endpointDailyUsageQuerySchema = z.object({
    days: daysSchema,
    path: z.string().optional(),
});

export const statusCodeDailyQuerySchema = z.object({
    days: daysSchema,
    statusCode: z.coerce.number().int().optional(),
});

export type DailyUsageQuerySchemaInput = z.infer<typeof dailyUsageQuerySchema>;
export type EndpointDailyUsageQuerySchemaInput = z.infer<typeof endpointDailyUsageQuerySchema>;
export type StatusCodeDailyQuerySchemaInput = z.infer<typeof statusCodeDailyQuerySchema>;
