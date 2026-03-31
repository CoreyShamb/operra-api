import { z } from "zod";

export const sendMailgunEmailSchema = z.object({
    to: z.string().email("to must be a valid email address"),
    subject: z
        .string()
        .min(1, "subject is required")
        .max(255, "subject must be 255 characters or fewer"),
    text: z.string().optional(),
    html: z.string().optional(),
    from: z.string().optional(),
}).refine(
    (data) => Boolean(data.text || data.html),
    {
        message: "Either text or html is required",
        path: ["text"],
    }
);

export type SendMailgunEmailSchemaInput = z.infer<
    typeof sendMailgunEmailSchema
>;