import { z } from "@hono/zod-openapi";
import { SlugSchema } from "../common/schema";

export const CategorySchema = z.object({
  id: z.number().openapi({ example: 1 }).optional(),
  name: z.string().min(3).openapi({ example: "Action Figure" }),
  slug: SlugSchema.openapi({ example: "action-figure" }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().nullable().optional(),
});

export const CreateCategorySchema = CategorySchema.pick({
  name: true,
});
