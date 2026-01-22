import { z } from "@hono/zod-openapi";
import { CategorySchema } from "../category/schema";

const ToyBaseSchema = z.object({
  sku: z.string().min(3).max(20).openapi({ example: "SKU123" }),
  name: z.string().min(3).max(100).openapi({ example: "Toy Name" }),
  categoryId: z.number().openapi({ example: 1 }),
  brand: z.string().min(2).nullable().optional().openapi({ example: "Brand" }),
  price: z.number().min(100).default(100).openapi({ example: 100 }),
  ageRange: z
    .string()
    .min(1)
    .nullable()
    .optional()
    .openapi({ example: "Age Range" }),
  imageUrl: z
    .url()
    .nullable()
    .optional()
    .openapi({ example: "https://example.com/image.jpg" }),
  description: z
    .string()
    .min(3)
    .nullable()
    .optional()
    .openapi({ example: "Toys are fun" }),
});

export const ToyResponseSchema = ToyBaseSchema.extend({
  id: z.number(),
  slug: z.string().max(100),
  category: CategorySchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
}).omit({ categoryId: true });

export const SearchResultSchema = z.array(ToyResponseSchema);

export const CreateToySchema = ToyBaseSchema; // POST
export const UpdateToySchema = ToyBaseSchema.omit({ price: true })
  .extend({
    price: z.number().min(100).optional(),
  })
  .partial(); // PATCH
export const ReplaceToySchema = ToyBaseSchema.omit({ price: true }).extend({
  price: z.number().min(100).optional(),
}); // PUT (same as create)
