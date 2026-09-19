import { z } from "zod";

export const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address").max(254)),
  password: z.string().min(1, "Password is required").max(72),
});
