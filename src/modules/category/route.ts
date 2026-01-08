import { OpenAPIHono, z } from "@hono/zod-openapi";
import { dataToys } from "../toy/data";
import { ErrorSchema, GetToyParamsSchema, ToySchema } from "../toy/schema-type";

export const categoryRoute = new OpenAPIHono();

let toys = dataToys;

// GET - Retrieve a toy by slug
categoryRoute.openapi(
  {
    method: "get",
    path: "/{slug}",
    request: {
      params: GetToyParamsSchema,
    },
    description: "Retrieve a toy by its slug",
    responses: {
      200: {
        description: "Successfully retrieved the toy",
        content: { "application/json": { schema: z.array(ToySchema) } },
      },
      404: {
        description: "Toy not found",
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        description: "Error retrieving toy by slug",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  },
  (c) => {
    try {
      const slug = c.req.param("slug");
      const foundCategory = toys.filter((toy) => toy.category?.slug === slug);

      if (foundCategory.length > 0) {
        return c.json(foundCategory, 200);
      } else {
        return c.json(
          {
            message: "Category not found",
            code: "TOYBOX_GET_ERROR" as const,
          },
          404
        );
      }
    } catch (error) {
      return c.json(
        {
          message: "Error retrieving category by slug",
          code: "TOYBOX_GET_ERROR" as const,
        },
        500
      );
    }
  }
);
