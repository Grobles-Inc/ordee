import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
