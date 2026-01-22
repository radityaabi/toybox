import z from "zod";

export const SlugSchema = z.string().min(3);

export const ParamIdSchema = z.object({
  id: z.coerce.number().positive(),
});

export const GetParamsSchema = z.object({
  slug: SlugSchema,
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1),
});

export const getErrorSchema = z.object({
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
