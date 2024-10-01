import { z } from "zod";

// Define form schema for category
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(255, { message: "Name must have at most 255 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must have at least 3 characters" })
    .max(255, { message: "Description must have at most 255 characters" }),
});
