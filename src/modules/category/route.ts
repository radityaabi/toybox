import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import {
  CategorySchema,
  CreateCategorySchema,
  CreateCategory,
  ErrorSchema,
  GetParamsSchema,
  ToyResponseSchema,
} from "../../types/schema-type";
import slugify from "slugify";
import { responseSelect } from "../../lib/prisma-select";
import { getSystemErrorMessage } from "node:util";
import { getErrorMessage } from "../../utils/error";

export const categoryRoute = new OpenAPIHono();

// GET - Retrieve a toy by slug
categoryRoute.openapi(
  {
    method: "get",
    path: "/{slug}",
    request: {
      params: GetParamsSchema,
    },
    description: "Retrieve toys by category",
    responses: {
      200: {
        description: "Successfully retrieved the toys by category",
        content: { "application/json": { schema: z.array(ToyResponseSchema) } },
      },
      404: {
        description: "Category not found",
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        description: "Error retrieving category",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const slug = c.req.param("slug");

      // Check if category exists
      const category = await prisma.category.findFirst({
        where: {
          slug: slug,
        },
      });

      if (!category) {
        return c.json(
          {
            message: "Category not found",
            code: "CATEGORY_NOT_FOUND" as const,
          },
          404
        );
      }

      // Retrieve toys by category
      const result = await prisma.toy.findMany({
        where: {
          category: {
            slug: slug,
          },
        },
        select: responseSelect,
        orderBy: {
          id: "asc",
        },
      });

      return c.json(result, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error retrieving category",
          code: "GET_ERROR" as const,
          error: getErrorMessage(error),
        },
        500
      );
    }
  }
);

// POST - Create a new category
categoryRoute.openapi(
  {
    method: "post",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: CreateCategorySchema } },
      },
    },
    description: "Create a new category",
    responses: {
      201: {
        description: "Successfully created a new category",
        content: { "application/json": { schema: CategorySchema } },
      },
      400: {
        description: "Bad request",
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Returns an error",
      },
    },
  },
  async (c) => {
    try {
      const payload: CreateCategory = c.req.valid("json");

      const categorySlug = slugify(payload.name, { strict: true, lower: true });

      const checkExistingCategory = await prisma.category.findFirst({
        where: {
          slug: categorySlug,
        },
      });

      if (checkExistingCategory) {
        return c.json(
          {
            message: "Category already exists",
            code: "CATEGORY_EXISTS" as const,
          },
          400
        );
      }

      const newCategory = await prisma.category.create({
        data: {
          name: payload.name,
          slug: categorySlug,
        },
      });

      return c.json(newCategory, 201);
    } catch (error) {
      console.error("Error creating category:", error);
      return c.json(
        {
          message: "Error creating category",
          code: "CATEGORY_ADD_ERROR" as const,
          error: getErrorMessage(error),
        },
        500
      );
    }
  }
);
