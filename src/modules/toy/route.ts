import { Hono } from "hono";
import { toysData } from "../common/data";

export const toyRoute = new Hono();

toyRoute.get("/", (c) => {
  return c.json(toysData);
});

toyRoute.get("/:slug", (c) => {
  const slug = c.req.param("slug");
  const foundToy = toysData.find((toy) => toy.slug === slug);

  if (foundToy) {
    return c.json(foundToy);
  } else {
    return c.json({ message: "Toy not found" }, 404);
  }
});
