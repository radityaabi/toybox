import { OpenAPIHono, z } from "@hono/zod-openapi";
import slugify from "slugify";

import { dataToys } from "./data";
import {
  CreateToy,
  CreateToySchema,
  ErrorSchema,
  GetToyParamsSchema,
  ReplaceToy,
  ReplaceToySchema,
  SearchQuerySchema,
  Toy,
  ToySchema,
  UpdateToy,
  UpdateToySchema,
  ParamIdSchema,
  SearchResultSchema,
} from "./schema-type";

export const toyRoute = new OpenAPIHono();

let toys = dataToys;

// GET - Retrieve all toys
toyRoute.openapi(
  {
    method: "get",
    path: "/",
    description: "Retrieve a list of all toys",
    responses: {
      200: {
        description: "Successfully retrieved list of toys",
      },
    },
  },
  (c) => {
    return c.json(toys);
  }
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
        content: {
          "application/json": {
            schema: SearchResultSchema,
          },
        },
      },
      404: {
        description: "No toys found",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
      400: {
        description: "Invalid query parameter",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  },
  (c) => {
    const { q } = c.req.valid("query");

    const query = q.toLowerCase();

    const searchResults = toys.filter((toy) =>
      toy.name.toLowerCase().includes(query)
    );

    if (searchResults.length === 0) {
      return c.json(
        {
          message: "No toys found matching the query",
          code: "TOYS_SEARCH_NOT_FOUND" as const,
        },
        404
      );
    }

    return c.json(searchResults, 200);
  }
);

// GET - Retrieve a toy by slug
toyRoute.openapi(
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
        content: { "application/json": { schema: ToySchema } },
      },
      404: {
        description: "Toy not found",
      },
      500: {
        description: "Error retrieving toy by slug",
      },
    },
  },
  (c) => {
    try {
      const slug = c.req.param("slug");
      const foundToy = toys.find((toy) => toy.slug === slug);

      if (foundToy) {
        return c.json(foundToy);
      } else {
        return c.json({ message: "Toy not found" }, 404);
      }
    } catch (error) {
      return c.json({ message: "Error retrieving toy by slug" }, 500);
    }
  }
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
  (c) => {
    try {
      const id = Number(c.req.param("id"));
      const foundToy = toys.find((toy) => toy.id === id);

      if (!foundToy) {
        return c.json({ message: "Toy not found", code: 404 }, 404);
      }

      const updatedDataToys = toys.filter((toy) => toy.id !== id);
      toys = updatedDataToys;

      return c.json({ message: "Toy deleted successfully" });
    } catch (error) {
      return c.json({ message: "Error deleting toy", code: 500 }, 500);
    }
  }
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
        content: { "application/json": { schema: ToySchema } },
      },
      500: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Returns an error",
      },
    },
  },
  (c) => {
    try {
      const toyJSON: CreateToy = c.req.valid("json");
      const newId = toys.length > 0 ? toys[toys.length - 1].id + 1 : 1;
      const newSlug = slugify(toyJSON.name, {
        lower: true,
        strict: true,
        trim: true,
      });

      const newToy = {
        id: newId,
        slug: newSlug,
        ...toyJSON,
        createdAt: new Date(),
        updatedAt: null,
      };

      const updatedDataToys = [...toys, newToy];
      toys = updatedDataToys;

      return c.json(newToy, 201);
    } catch (error) {
      return c.json(
        {
          message: "Error searching toys",
          code: "TOYS_CREATE_ERROR" as const,
        },
        500
      );
    }
  }
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
        content: {
          "application/json": {
            schema: UpdateToySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully updated the toy",
        content: { "application/json": { schema: ToySchema } },
      },
      404: {
        description: "Toy not found",
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        description: "Error updating toy",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  },
  (c) => {
    try {
      const id = Number(c.req.param("id"));
      const payload: UpdateToy = c.req.valid("json");

      const foundToy = toys.find((toy) => toy.id === id);
      if (!foundToy) {
        return c.json({ message: "Toy not found", code: 404 }, 404);
      }

      const updatedToy = {
        ...foundToy,
        ...payload,
        updatedAt: new Date(),
      };

      toys = toys.map((toy) => (toy.id === id ? updatedToy : toy));

      return c.json(updatedToy, 200);
    } catch (error) {
      return c.json({ message: "Error updating toy", code: 500 }, 500);
    }
  }
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
        content: {
          "application/json": {
            schema: ReplaceToySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully replaced the toy",
        content: {
          "application/json": {
            schema: ToySchema,
          },
        },
      },
      201: {
        description: "Toy created as it did not exist",
        content: {
          "application/json": {
            schema: ToySchema,
          },
        },
      },
      500: {
        description: "Error replacing toy",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },
  },
  (c) => {
    try {
      const id = Number(c.req.param("id"));
      const payload: ReplaceToy = c.req.valid("json");

      const foundToy = toys.find((toy) => toy.id === id);

      if (!foundToy) {
        const newToy: Toy = {
          id,
          ...payload,
          createdAt: new Date(),
          updatedAt: null,
        };

        toys = [...toys, newToy];
        return c.json(newToy, 201);
      }

      const replacedToy: Toy = {
        id,
        ...payload,
        createdAt: foundToy.createdAt,
        updatedAt: new Date(),
      };

      toys = toys.map((toy) => (toy.id === id ? replacedToy : toy));

      return c.json(replacedToy, 200);
    } catch (error) {
      return c.json({ message: "Error replacing toy", code: 500 }, 500);
    }
  }
);
