import { z } from "@hono/zod-openapi";

export const SlugSchema = z.string().min(3);

export const ParamIdSchema = z.object({
  id: z.int().positive(),
});

export const GetParamsSchema = z.object({
  slug: SlugSchema,
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1),
});

export const CategorySchema = z.object({
  id: z.number().openapi({ example: 1 }).optional(),
  name: z.string().min(3).openapi({ example: "Action Figure" }),
  slug: SlugSchema.openapi({ example: "action-figure" }).optional(),
});

export const CreateCategorySchema = CategorySchema.pick({
  name: true,
});

const ToyBaseSchema = z.object({
  sku: z.string().min(3).openapi({ example: "SKU123" }),
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
  slug: z.string(),
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

export const ErrorSchema = z.object({
  message: z.string().openapi({ example: "Not Found" }),
  code: z
    .enum([
      "GET_ERROR",
      "SEARCH_ERROR",
      "SEARCH_NOT_FOUND",
      "DELETE_ERROR",
      "ADD_ERROR",
      "UPDATE_ERROR",
      "TOY_NOT_FOUND",
      "REPLACE_ERROR",
      "CATEGORY_ADD_ERROR",
      "CATEGORY_EXISTS",
      "CATEGORY_NOT_FOUND",
      "CATEGORY_DELETE_ERROR",
      "INVALID_QUERY",
      "TOY_EXISTS",
    ])
    .openapi({ example: "SEARCH_ERROR" }),
  error: z.string().optional(),
});

export type Toy = z.infer<typeof ToyResponseSchema>;
export type CreateToy = z.infer<typeof CreateToySchema>;
export type UpdateToy = z.infer<typeof UpdateToySchema>;
export type ReplaceToy = z.infer<typeof ReplaceToySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
