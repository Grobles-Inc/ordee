import { z } from "zod";

export const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(255, "Last name is too long"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "guest", "admin"], {
    required_error: "Role is required",
  }),
});

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(255, "Last name is too long"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
    role: z.enum(["user", "guest", "admin"], {
      required_error: "Role is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AccountFormValues = z.infer<typeof accountFormSchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
