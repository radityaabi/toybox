import { OpenAPIHono, z } from "@hono/zod-openapi";
import slugify from "slugify";
import { prisma } from "../../lib/prisma";
import {
  CreateToy,
  CreateToySchema,
  ErrorSchema,
  GetParamsSchema,
  ReplaceToy,
  ReplaceToySchema,
  SearchQuerySchema,
  SearchResultSchema,
  Toy,
  ToyResponseSchema,
  UpdateToy,
  UpdateToySchema,
  ParamIdSchema,
} from "../../types/schema-type";
import { responseSelect } from "../../lib/prisma-select";
import { errorMessage } from "../../utils/error";

export const toyRoute = new OpenAPIHono();

// GET - Retrieve all toys
toyRoute.openapi(
  {
    method: "get",
    path: "/",
    description: "Retrieve a list of all toys with category details",
    responses: {
      200: { description: "Successfully retrieved list of toys" },
    },
  },
  async (c) => {
    try {
      const result = await prisma.toy.findMany({
        select: responseSelect,
        orderBy: {
          id: "asc",
        },
      });
      return c.json(result);
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
        content: { "application/json": { schema: ErrorSchema } },
      },
      404: {
        description: "No toys found",
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        description: "Error searching toys",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const { q } = c.req.valid("query");
      const query = q.toLowerCase();

      if (!query || query.trim() === "" || query.length < 2) {
        return c.json(
          {
            message: "Invalid query parameter",
            code: "INVALID_QUERY" as const,
          },
          400,
        );
      }

      const result: Toy[] = await prisma.toy.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: responseSelect,
        orderBy: {
          id: "asc",
        },
      });

      if (result.length === 0) {
        return c.json(
          {
            message: "No toys found matching the query",
            code: "SEARCH_ERROR" as const,
          },
          404,
        );
      }

      return c.json(result, 200);
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
    request: {
      params: GetParamsSchema,
    },
    description: "Retrieve a toy by its slug",
    responses: {
      200: {
        description: "Successfully retrieved the toy",
        content: { "application/json": { schema: ToyResponseSchema } },
      },
      404: {
        description: "Toy not found",
      },
      500: {
        description: "Error retrieving toy by slug",
      },
    },
  },
  async (c) => {
    try {
      const slug = c.req.param("slug");

      const result: Toy[] = await prisma.toy.findMany({
        where: {
          slug: slug,
        },
        select: responseSelect,
      });

      if (result.length === 0) {
        return c.json({ message: "Toy not found" }, 404);
      }

      return c.json(result);
    } catch (error) {
      return c.json({ message: "Error retrieving toy by slug" }, 500);
    }
  },
);

// DELETE - Delete a toy by ID
toyRoute.openapi(
  {
    method: "delete",
    path: "/{id}",
    request: {
      params: ParamIdSchema,
    },
    description: "Delete a toy by ID",
    responses: {
      200: {
        description: "Successfully deleted the toy",
      },
      404: {
        description: "Toy not found",
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        description: "Error deleting toy",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const id = Number(c.req.param("id"));

      const result = await prisma.toy.findUnique({
        where: { id },
      });

      if (!result) {
        return c.json({ message: "Toy not found", code: "TOY_NOT_FOUND" }, 404);
      }

      await prisma.toy.delete({
        where: { id },
      });

      return c.json({ message: "Toy deleted successfully" });
    } catch (error) {
      return c.json(
        { message: "Error deleting toy", code: "DELETE_ERROR" as const },
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
    request: {
      body: { content: { "application/json": { schema: CreateToySchema } } },
    },
    description: "Create a new toy",
    responses: {
      201: {
        description: "Successfully created a new toy",
        content: { "application/json": { schema: ToyResponseSchema } },
      },
      400: {
        description: "Bad Request",
        content: { "application/json": { schema: ErrorSchema } },
      },
      404: {
        description: "Category not found",
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
      const payload: CreateToy = c.req.valid("json");

      // Check if category exists
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

      // Check for existing toy with the same slug or sku
      const newSlug = slugify(payload.name, {
        lower: true,
        strict: true,
        trim: true,
      });
      const existingData = await prisma.toy.findFirst({
        where: { OR: [{ slug: newSlug }, { sku: payload.sku }] },
      });

      if (existingData) {
        return c.json(
          {
            message: "Toy with the same slug or sku already exists",
            code: "TOY_EXISTS" as const,
          },
          400,
        );
      }

      //Create new toy data
      const createdToy: Toy = await prisma.toy.create({
        data: {
          sku: payload.sku,
          name: payload.name,
          slug: newSlug,
          categoryId: payload.categoryId,
          brand: payload.brand,
          price: payload.price || 100,
          ageRange: payload.ageRange,
          imageUrl: payload.imageUrl,
          description: payload.description,
        },
      });

      return c.json(createdToy, 201);
    } catch (error) {
      return c.json(
        {
          message: "Error searching toys",
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
            schema: ErrorSchema,
          },
        },
      },
      500: {
        description: "Error updating toy",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  },
  async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const payload: UpdateToy = c.req.valid("json");

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
          slug: payload.name
            ? slugify(payload.name, { lower: true, strict: true, trim: true })
            : foundToy.slug,
        },
        select: responseSelect,
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
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        description: "Error replacing toy",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const payload: ReplaceToy = c.req.valid("json");

      const foundToy = await prisma.toy.findUnique({
        where: { id: id },
      });

      if (!foundToy) {
        const newSlug = slugify(payload.name, {
          lower: true,
          strict: true,
          trim: true,
        });

        const existingData = await prisma.toy.findFirst({
          where: { OR: [{ slug: newSlug }, { sku: payload.sku }] },
        });

        if (existingData) {
          return c.json(
            {
              message: "Toy with the same slug or sku already exists",
              code: "TOY_EXISTS" as const,
            },
            400,
          );
        }

        const createdToy: Toy = await prisma.toy.create({
          data: {
            sku: payload.sku,
            name: payload.name,
            slug: newSlug,
            categoryId: payload.categoryId,
            brand: payload.brand,
            price: payload.price || 100,
            ageRange: payload.ageRange,
            imageUrl: payload.imageUrl,
            description: payload.description,
          },
          select: responseSelect,
        });
        return c.json(createdToy, 201);
      }

      const updatedToy: Toy = await prisma.toy.update({
        where: { id: id },
        data: {
          ...payload,
          updatedAt: new Date(),
        },
        select: responseSelect,
      });

      return c.json(updatedToy, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error replacing toy",
          code: "REPLACE_ERROR" as const,
        },
        500,
      );
    }
  },
);
