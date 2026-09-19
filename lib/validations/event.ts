import { z } from "zod";

export const eventStatusSchema = z.enum([
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]);

export const eventInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().min(1, "Description is required"),
  date: z.coerce.date(),
  location: z.string().trim().min(1, "Location is required").max(160),
  status: eventStatusSchema,
  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be valid")
    .optional()
    .or(z.literal("")),
});

export type EventInput = z.infer<typeof eventInputSchema>;

