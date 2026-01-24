import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import { CategorySchema, CreateCategorySchema } from "./schema";
import { getErrorSchema, GetParamsSchema } from "../common/schema";
import { createSlug } from "../common/utils";
import { errorMessage } from "../../utils/error";
import { ToyResponseSchema } from "../toy/schema";

export const categoryRoute = new OpenAPIHono();
const tag = ["categories"];

// GET - Retrieve all categories
categoryRoute.openapi(
  {
    method: "get",
    path: "/",
    description: "Retrieve all categories",
    tags: tag,
    responses: {
      200: {
        description: "Successfully retrieved all categories",
        content: { "application/json": { schema: z.array(CategorySchema) } },
      },
      500: {
        description: "Error retrieving categories",
        content: { "application/json": { schema: getErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const result = await prisma.category.findMany({
        orderBy: {
          id: "asc",
        },
      });

      return c.json(result, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error retrieving categories",
          code: "GET_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);

// GET - Retrieve a toy by slug
categoryRoute.openapi(
  {
    method: "get",
    path: "/{slug}",
    request: {
      params: GetParamsSchema,
    },
    description: "Retrieve toys by category",
    tags: tag,
    responses: {
      200: {
        description: "Successfully retrieved the toys by category",
        content: { "application/json": { schema: z.array(ToyResponseSchema) } },
      },
      404: {
        description: "Category not found",
        content: { "application/json": { schema: getErrorSchema } },
      },
      500: {
        description: "Error retrieving category",
        content: { "application/json": { schema: getErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const { slug } = c.req.valid("param");

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
          404,
        );
      }

      // Retrieve toys by category
      const result = await prisma.toy.findMany({
        where: {
          category: {
            slug: slug,
          },
        },
        orderBy: {
          id: "asc",
        },
        include: { category: true, brand: true },
      });

      return c.json(result, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error retrieving category",
          code: "GET_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
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
    tags: tag,
    description: "Create a new category",
    responses: {
      201: {
        description: "Successfully created a new category",
        content: { "application/json": { schema: CategorySchema } },
      },
      400: {
        description: "Bad request",
        content: { "application/json": { schema: getErrorSchema } },
      },
      500: {
        content: { "application/json": { schema: getErrorSchema } },
        description: "Returns an error",
      },
    },
  },
  async (c) => {
    try {
      const payload = c.req.valid("json");

      const categorySlug = createSlug(payload.name);

      try {
        const newCategory = await prisma.category.create({
          data: {
            name: payload.name,
            slug: categorySlug,
          },
        });

        return c.json(newCategory, 201);
      } catch (error) {
        return c.json(
          {
            message: "Category already exists",
            code: "CATEGORY_EXISTS" as const,
          },
          400,
        );
      }
    } catch (error) {
      console.error("Error creating category:", error);
      return c.json(
        {
          message: "Error creating category",
          code: "CATEGORY_ADD_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);
