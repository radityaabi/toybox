import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import { BrandSchema, CreateBrandSchema } from "./schema";
import {
  GenericErrorSchema,
  GetParamsSchema,
  ParamIdSchema,
} from "../common/schema";
import { createSlug } from "../common/utils";
import { errorMessage } from "../../utils/error";
import { ToyResponseSchema } from "../toy/schema";

export const brandRoute = new OpenAPIHono();
const tag = ["brands"];

// GET - Retrieve all brands
brandRoute.openapi(
  {
    method: "get",
    path: "/",
    description: "Retrieve all brands",
    tags: tag,
    responses: {
      200: {
        description: "Successfully retrieved all brands",
        content: { "application/json": { schema: z.array(BrandSchema) } },
      },
      500: {
        description: "Error retrieving brands",
        content: { "application/json": { schema: GenericErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const result = await prisma.brand.findMany({
        orderBy: {
          id: "asc",
        },
      });

      return c.json(result, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error retrieving brands",
          code: "GET_ERROR" as const,
          error: errorMessage(error),
        },
        500
      );
    }
  }
);

// GET - Retrieve toys by brand (slug)
brandRoute.openapi(
  {
    method: "get",
    path: "/{slug}",
    request: {
      params: GetParamsSchema,
    },
    description: "Retrieve toys by brand",
    tags: tag,
    responses: {
      200: {
        description: "Successfully retrieved the toys by brand",
        content: { "application/json": { schema: z.array(ToyResponseSchema) } },
      },
      404: {
        description: "Brand not found",
        content: { "application/json": { schema: GenericErrorSchema } },
      },
      500: {
        description: "Error retrieving brand",
        content: { "application/json": { schema: GenericErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const { slug } = c.req.valid("param");

      // Check if brand exists
      const brand = await prisma.brand.findUnique({
        where: {
          slug: slug,
        },
      });

      if (!brand) {
        return c.json(
          {
            message: "Brand not found",
            code: "BRAND_NOT_FOUND" as const,
          },
          404
        );
      }

      // Retrieve toys by brand
      const result = await prisma.toy.findMany({
        where: {
          brand: {
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
          message: "Error retrieving brand",
          code: "GET_ERROR" as const,
          error: errorMessage(error),
        },
        500
      );
    }
  }
);

// POST - Create a new brand
brandRoute.openapi(
  {
    method: "post",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: CreateBrandSchema } },
      },
    },
    tags: tag,
    description: "Create a new brand",
    responses: {
      201: {
        description: "Successfully created a new brand",
        content: { "application/json": { schema: BrandSchema } },
      },
      400: {
        description: "Bad request",
        content: { "application/json": { schema: GenericErrorSchema } },
      },
      500: {
        description: "Returns an error",
        content: { "application/json": { schema: GenericErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const payload = c.req.valid("json");

      const brandSlug = createSlug(payload.name);

      try {
        const newBrand = await prisma.brand.create({
          data: {
            name: payload.name,
            slug: brandSlug,
          },
        });

        return c.json(newBrand, 201);
      } catch (error) {
        return c.json(
          {
            message: "Brand already exists",
            code: "BRAND_EXISTS" as const,
          },
          400
        );
      }
    } catch (error) {
      console.error("Error creating brand:", error);
      return c.json(
        {
          message: "Error creating brand",
          code: "BRAND_ADD_ERROR" as const,
          error: errorMessage(error),
        },
        500
      );
    }
  }
);

// DELETE - Delete a brand
brandRoute.openapi(
  {
    method: "delete",
    path: "/{id}",
    request: {
      params: ParamIdSchema,
    },
    tags: tag,
    description: "Delete a brand",
    responses: {
      200: {
        description: "Successfully deleted a brand",
      },
      404: {
        description: "Brand not found",
        content: { "application/json": { schema: GenericErrorSchema } },
      },
      500: {
        description: "Returns an error",
        content: { "application/json": { schema: GenericErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const { id } = c.req.valid("param");

      await prisma.brand.delete({
        where: {
          id: id,
        },
      });

      return c.json({ message: "Brand deleted successfully", id: id }, 200);
    } catch (error) {
      return c.json(
        {
          message: "Error deleting brand",
          code: "BRAND_DELETE_ERROR" as const,
          error: errorMessage(error),
        },
        500
      );
    }
  }
);
