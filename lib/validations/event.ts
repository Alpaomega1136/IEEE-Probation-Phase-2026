import { z } from "zod";
import {
  cleanDescription,
  hasDescriptionText,
  isAllowedImageUrl,
} from "@/lib/description";

export const eventStatusSchema = z.enum([
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]);

const imageUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    if (!value) return true;
    return isAllowedImageUrl(value);
  }, "Use a valid HTTPS image URL")
  .optional();

export const eventInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(10000)
      .transform(cleanDescription)
      .refine(hasDescriptionText, "Description is required"),
    date: z
      .union([z.iso.datetime({ offset: true }), z.date()])
      .pipe(z.coerce.date()),
    location: z.string().trim().min(1, "Location is required").max(160),
    status: eventStatusSchema,
    imageUrl: imageUrlSchema,
  })
  .strict();

export const eventUpdateSchema = eventInputSchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );

export const eventQuerySchema = z.object({
  search: z.string().trim().max(120).default(""),
  status: z
    .enum([
      "all",
      "upcoming",
      "past",
      "UPCOMING",
      "ONGOING",
      "COMPLETED",
      "CANCELLED",
    ])
    .default("all"),
  page: z.coerce.number().int().min(1).max(100000).default(1),
});

export type EventInput = z.infer<typeof eventInputSchema>;
export type EventQuery = z.infer<typeof eventQuerySchema>;
