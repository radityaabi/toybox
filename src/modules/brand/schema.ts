import { z } from "@hono/zod-openapi";
import { SlugSchema } from "../common/schema";

export const BrandSchema = z.object({
  id: z.number().openapi({ example: 1 }).optional(),
  name: z.string().min(3).openapi({ example: "Bandai Namco" }),
  slug: SlugSchema.openapi({ example: "bandai-namco" }).optional(),
  logo: z
    .url()
    .nullable()
    .optional()
    .openapi({ example: "https://example.com/logo.png" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().nullable().optional(),
});

export const CreateBrandSchema = BrandSchema.pick({
  name: true,
  logo: true,
});
