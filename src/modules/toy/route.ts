import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { randomUUIDv7 } from "bun";
import slugify from "slugify";

import { dataToys } from "./data";
import {
  CreateToy,
  CreateToySchema,
  Toy,
  ToySchema,
  UpdateToy,
} from "./schema-type";

export const toyRoute = new Hono();

let toys = dataToys;

// GET - Retrieve all toys
toyRoute.get("/", (c) => {
  return c.json(toys);
});

// GET - Retrieve a toy by slug
toyRoute.get("/:slug", (c) => {
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
});

// GET - Search toys by name query
toyRoute.get("/search", (c) => {
  try {
    const query = c.req.query("q")?.toLowerCase() || "";
    if (!query) {
      return c.json({ message: "Query parameter 'q' is required" }, 400);
    }

    const searchResults = toys.filter((toy) =>
      toy.name.toLowerCase().includes(query)
    );

    if (searchResults.length === 0) {
      return c.json({ message: "No toys found matching the query" }, 404);
    }

    return c.json(searchResults);
  } catch (error) {
    return c.json({ message: "Error searching toys" }, 500);
  }
});

// GET - Retrieve toys by category ID
toyRoute.get("/category/:categoryId", (c) => {
  try {
    const categoryId = parseInt(c.req.param("categoryId"));
    const filteredToys = toys.filter((toy) => toy.category?.id === categoryId);

    if (filteredToys.length === 0) {
      return c.json(
        { message: "No toys found for the given category ID" },
        404
      );
    }

    return c.json(filteredToys);
  } catch (error) {
    return c.json({ message: "Error retrieving toys by category" }, 500);
  }
});

// DELETE - Delete a toy by ID
toyRoute.delete("/:id", (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const updatedDataToys = toys.filter((toy) => toy.id !== id);
    toys = updatedDataToys;
    return c.json({ message: "Toy deleted successfully" });
  } catch (error) {
    return c.json({ message: "Error deleting toy" }, 500);
  }
});

// POST - Create a new toy
toyRoute.post("/", zValidator("json", CreateToySchema), async (c) => {
  try {
    const toyJSON: CreateToy = await c.req.json();

    const newToy = {
      id: Math.random(), // FIX THIS
      slug: String(slugify(toyJSON.name)),
      ...toyJSON,
      created_at: new Date(),
      updated_at: null,
    };

    const updatedDataToys = [...toys, newToy];
    toys = updatedDataToys;

    return c.json({ message: "Added new toy data", data: newToy }, 201);
  } catch (error) {
    return c.json({ message: "Error creating toy data" }, 500);
  }
});

// PATCH - Update a toy by ID
toyRoute.patch("/:id", zValidator("json", ToySchema), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const toyJSON: Toy = await c.req.json();
    const foundToyData = toys.find((toy) => toy.id === id);

    if (!foundToyData) {
      return c.json({ message: "Toy not found" }, 404);
    }

    const updatedToy = {
      ...foundToyData,
      ...toyJSON,
      updated_at: new Date(),
    };

    const updatedDataToys = toys.map((toy) =>
      toy.id === id ? updatedToy : toy
    );
    toys = updatedDataToys;

    return c.json({ message: "Toy data updated", data: updatedToy });
  } catch (error) {
    return c.json({ message: "Error updating toy data" }, 500);
  }
});

// PUT - Replace a toy by ID
toyRoute.put("/:id", zValidator("json", ToySchema), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const toyJSON: UpdateToy = await c.req.json();
    const foundToyData = toys.find((toy) => toy.id === id);

    if (!foundToyData) {
      const newToy = {
        id: id,
        ...toyJSON,
        created_at: new Date(),
        updated_at: null,
      };

      const updatedDataToys = [...toys, newToy];
      toys = updatedDataToys;

      return c.json(
        { message: "Toy not found. Created new toy.", data: newToy },
        201
      );
    }

    const replacedToy = {
      id: id,
      ...toyJSON,
      createdAt: foundToyData.createdAt,
      updatedAt: new Date(),
    };

    const updatedDataToys = toys.map((toy) =>
      toy.id === id ? replacedToy : toy
    );
    toys = updatedDataToys;

    return c.json({ message: "Toy data replaced", data: replacedToy });
  } catch (error) {
    return c.json({ message: "Error replacing toy data" }, 500);
  }
});
