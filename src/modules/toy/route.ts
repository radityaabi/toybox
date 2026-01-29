import { OpenAPIHono, z } from "@hono/zod-openapi";
import { createSlug } from "../common/utils";
import { prisma } from "../../lib/prisma";
import {
  CreateToySchema,
  ReplaceToySchema,
  SearchResultSchema,
  ToyResponseSchema,
  UpdateToySchema,
} from "./schema";
import {
  getErrorSchema,
  GetParamsSchema,
  SearchQuerySchema,
  ParamIdSchema,
} from "../common/schema";
import { errorMessage } from "../../utils/error";

export const toyRoute = new OpenAPIHono();
const tag = ["toys"];

// GET - Retrieve all toys
toyRoute.openapi(
  {
    method: "get",
    path: "/",
    description: "Retrieve a list of all toys with category details",
    tags: tag,
    responses: {
      200: { description: "Successfully retrieved list of toys" },
      500: {
        description: "Error retrieving toys",
        content: { "application/json": { schema: getErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const toys = await prisma.toy.findMany({
        orderBy: {
          id: "asc",
        },
        include: { category: true, brand: true },
      });
      return c.json(toys);
    } catch (error) {
      return c.json(
        {
          message: "Error retrieving toys",
          code: "GET_ERROR",
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);

// GET - Search toys by name query
toyRoute.openapi(
  {
    method: "get",
    path: "/search",
    description: "Search toys by name",
    tags: tag,
    request: {
      query: SearchQuerySchema,
    },
    responses: {
      200: {
        description: "Successfully retrieved search results",
        content: { "application/json": { schema: SearchResultSchema } },
      },
      400: {
        description: "Invalid query parameter",
        content: { "application/json": { schema: getErrorSchema } },
      },
      500: {
        description: "Error searching toys",
        content: { "application/json": { schema: getErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const { q } = c.req.valid("query");

      if (!q || q.trim() === "") {
        return c.json(
          {
            message: "Invalid query parameter",
            code: "INVALID_QUERY" as const,
          },
          400,
        );
      }

      const toys = await prisma.toy.findMany({
        where: {
          name: {
            contains: q,
            mode: "insensitive",
          },
        },
        orderBy: {
          id: "asc",
        },
        include: { category: true, brand: true },
      });

      return c.json(toys, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error searching toys",
          code: "SEARCH_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);

// GET - Retrieve a toy by slug
toyRoute.openapi(
  {
    method: "get",
    path: "/{slug}",
    description: "Retrieve a toy by its slug",
    tags: tag,
    request: {
      params: GetParamsSchema,
    },
    responses: {
      200: {
        description: "Successfully retrieved the toy",
        content: { "application/json": { schema: ToyResponseSchema } },
      },
      404: {
        description: "Toy not found",
        content: { "application/json": { schema: getErrorSchema } },
      },
      500: {
        description: "Error retrieving toy by slug",
        content: { "application/json": { schema: getErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const { slug } = c.req.valid("param");

      const toy = await prisma.toy.findUnique({
        where: {
          slug: slug,
        },
        include: { category: true, brand: true },
      });

      if (!toy) {
        return c.json(
          { message: "Toy not found", code: "TOY_NOT_FOUND" as const },
          404,
        );
      }

      return c.json(toy, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error retrieving toy by slug",
          code: "RETRIEVE_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);

// DELETE - Delete a toy by ID
toyRoute.openapi(
  {
    method: "delete",
    path: "/{id}",
    description: "Delete a toy by ID",
    tags: tag,
    request: {
      params: ParamIdSchema,
    },
    responses: {
      200: {
        description: "Successfully deleted the toy",
      },
      404: {
        description: "Toy not found",
        content: { "application/json": { schema: getErrorSchema } },
      },
      500: {
        description: "Error deleting toy",
        content: { "application/json": { schema: getErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const { id } = c.req.valid("param");

      const result = await prisma.toy.findUnique({
        where: { id },
      });

      if (!result) {
        return c.json({ message: "Toy not found", code: "TOY_NOT_FOUND" }, 404);
      }

      await prisma.toy.delete({
        where: { id },
      });

      return c.json({ message: "Toy deleted successfully", id: id });
    } catch (error) {
      return c.json(
        {
          message: "Error deleting toy",
          code: "DELETE_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);

// POST - Create a new toy
toyRoute.openapi(
  {
    method: "post",
    path: "/",
    tags: tag,
    description: "Create a new toy",
    request: {
      body: { content: { "application/json": { schema: CreateToySchema } } },
    },
    responses: {
      201: {
        description: "Successfully created a new toy",
        content: { "application/json": { schema: ToyResponseSchema } },
      },
      400: {
        description: "Bad Request",
        content: { "application/json": { schema: getErrorSchema } },
      },
      404: {
        description: "Category or Brand not found",
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

      // Check if category exists
      if (payload.categoryId) {
        const findCategory = await prisma.category.findUnique({
          where: { id: payload.categoryId },
        });

        if (!findCategory) {
          return c.json(
            {
              message: "Category not found",
              code: "CATEGORY_NOT_FOUND" as const,
            },
            404,
          );
        }
      }

      // Check if brand exists
      if (payload.brandId) {
        const findBrand = await prisma.brand.findUnique({
          where: { id: payload.brandId },
        });

        if (!findBrand) {
          return c.json(
            {
              message: "Brand not found",
              code: "BRAND_NOT_FOUND" as const,
            },
            404,
          );
        }
      }

      try {
        const newSlug = createSlug(payload.name);
        //Create new toy data
        const createdToy = await prisma.toy.create({
          data: {
            sku: payload.sku,
            name: payload.name,
            slug: newSlug,
            ...(payload.categoryId && { categoryId: payload.categoryId }),
            ...(payload.brandId && { brandId: payload.brandId }),
            price: payload.price || 100,
            ageRange: payload.ageRange,
            imageUrl: payload.imageUrl,
            description: payload.description,
          },
          include: { category: true, brand: true },
        });

        return c.json(createdToy, 201);
      } catch (error) {
        console.error(error);
        return c.json(
          {
            message: "Toy with the same slug or sku already exists",
            code: "TOY_EXISTS" as const,
          },
          400,
        );
      }
    } catch (error) {
      return c.json(
        {
          message: "Error adding toy",
          code: "ADD_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);

// PATCH - Update a toy by ID
toyRoute.openapi(
  {
    method: "patch",
    path: "/{id}",
    description: "Update a toy by ID",
    tags: tag,
    request: {
      params: ParamIdSchema,
      body: {
        content: { "application/json": { schema: UpdateToySchema } },
      },
    },
    responses: {
      200: {
        description: "Successfully updated the toy",
        content: { "application/json": { schema: ToyResponseSchema } },
      },
      404: {
        description: "Toy not found",
        content: {
          "application/json": {
            schema: getErrorSchema,
          },
        },
      },
      500: {
        description: "Error updating toy",
        content: {
          "application/json": {
            schema: getErrorSchema,
          },
        },
      },
    },
  },
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const payload = c.req.valid("json");

      const foundToy = await prisma.toy.findUnique({
        where: { id: id },
      });

      if (!foundToy) {
        return c.json(
          { message: "Toy not found", code: "TOY_NOT_FOUND" as const },
          404,
        );
      }

      const updatedToy = await prisma.toy.update({
        where: { id: id },
        data: {
          ...payload,
          slug: payload.name ? createSlug(payload.name) : foundToy.slug,
        },
        include: { category: true, brand: true },
      });

      return c.json(updatedToy, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error updating toy",
          code: "UPDATE_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);

// PUT - Replace a toy by ID
toyRoute.openapi(
  {
    method: "put",
    path: "/{id}",
    description: "Replace a toy by ID",
    tags: tag,
    request: {
      params: ParamIdSchema,
      body: {
        content: { "application/json": { schema: ReplaceToySchema } },
      },
    },
    responses: {
      200: {
        description: "Successfully replaced the toy",
        content: { "application/json": { schema: ToyResponseSchema } },
      },
      201: {
        description: "Toy created as it did not exist",
        content: { "application/json": { schema: ToyResponseSchema } },
      },
      400: {
        description: "Toy with the same slug or sku already exists",
        content: { "application/json": { schema: getErrorSchema } },
      },
      500: {
        description: "Error replacing toy",
        content: { "application/json": { schema: getErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const payload = c.req.valid("json");

      const foundToy = await prisma.toy.findUnique({
        where: { id: id },
      });

      if (!foundToy) {
        try {
          const newSlug = createSlug(payload.name);
          const createdToy = await prisma.toy.create({
            data: {
              sku: payload.sku,
              name: payload.name,
              slug: newSlug,
              categoryId: payload.categoryId,
              brandId: payload.brandId,
              price: payload.price || 100,
              ageRange: payload.ageRange,
              imageUrl: payload.imageUrl,
              description: payload.description,
            },
            include: { category: true, brand: true },
          });
          return c.json(createdToy, 201);
        } catch (error) {
          return c.json(
            {
              message: "Toy with the same slug or sku already exists",
              code: "TOY_EXISTS" as const,
            },
            400,
          );
        }
      }

      const updatedToy = await prisma.toy.update({
        where: { id: id },
        data: payload,
        include: { category: true, brand: true },
      });

      return c.json(updatedToy, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error replacing toy",
          code: "REPLACE_ERROR" as const,
          error: errorMessage(error),
        },
        500,
      );
    }
  },
);
