import { z } from "@hono/zod-openapi";

export const SlugSchema = z.string().min(3);
export const SearchQuerySchema = z.object({
  q: z.string().min(1),
});
export const CategorySchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().min(3).openapi({ example: "Action Figure" }),
  slug: SlugSchema.openapi({ example: "action-figure" }).optional(),
});

export const ToySchema = z.object({
  id: z.number().openapi({ example: 1 }),
  sku: z.string().min(3).openapi({ example: "TOY-001" }),
  name: z.string().min(3).openapi({ example: "Action Figure" }),
  slug: SlugSchema.openapi({ example: "action-figure" }).optional(),
  category: CategorySchema.optional(),
  brand: z.string().min(2).openapi({ example: "ToyBrand" }).optional(),
  price: z.number().min(100).openapi({ example: 19000 }).optional(),
  ageRange: z.string().min(1).openapi({ example: "3-5 years" }).optional(),
  image: z
    .url()
    .openapi({ example: "https://example.com/image.jpg" })
    .optional(),
  description: z
    .string()
    .min(3)
    .openapi({ example: "A fun action figure for kids." })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
});

export const SearchResultSchema = z.array(ToySchema);

export const CreateToySchema = ToySchema.pick({
  sku: true,
  name: true,
  slug: true,
  category: true,
  brand: true,
  price: true,
  ageRange: true,
  image: true,
  description: true,
});

export const UpdateToySchema = ToySchema.pick({
  sku: true,
  name: true,
  slug: true,
  category: true,
  brand: true,
  price: true,
  ageRange: true,
  image: true,
  description: true,
}).partial();

export const ReplaceToySchema = ToySchema.pick({
  sku: true,
  name: true,
  slug: true,
  category: true,
  brand: true,
  price: true,
  ageRange: true,
  image: true,
  description: true,
});

export const ParamIdSchema = z.object({
  id: z.coerce.number().positive(),
});

export const GetToyParamsSchema = z.object({
  slug: SlugSchema,
});

export const ErrorSchema = z.object({
  message: z.string().openapi({ example: "Not Found" }),
  code: z
    .enum([
      "TOYBOX_GET_ERROR",
      "TOYBOX_SEARCH_ERROR",
      "TOYBOX_DELETE_ERROR",
      "TOYBOX_ADD_ERROR",
      "TOYBOX_UPDATE_ERROR",
      "TOYBOX_TOY_NOT_FOUND",
      "TOYBOX_REPLACE_ERROR",
    ])
    .openapi({ example: "TOYBOX_SEARCH_ERROR" }),
});

export type Toy = z.infer<typeof ToySchema>;
export type CreateToy = z.infer<typeof CreateToySchema>;
export type UpdateToy = z.infer<typeof UpdateToySchema>;
export type ReplaceToy = z.infer<typeof ReplaceToySchema>;
