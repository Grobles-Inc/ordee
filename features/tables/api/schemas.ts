import { z } from "zod";

export const tableFormSchema = z.object({
  number: z
    .number()
    .int("Table number must be a whole number")
    .min(1, "Table number must be at least 1")
    .max(999, "Table number is too high"),
});

export type TableFormValues = z.infer<typeof tableFormSchema>;
