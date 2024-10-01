import { z } from "zod";

export const itemFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(255, { message: "Name must have at most 255 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must have at least 3 characters" })
    .max(255, { message: "Description must have at most 255 characters" }),
  price: z.coerce
    .number()
    .min(0.01, { message: "Price must be at least 0.01" }),
  stock: z.coerce.number().min(0, { message: "Stock must be at least 0" }),
});
