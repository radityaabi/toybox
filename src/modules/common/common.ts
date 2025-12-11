import { Hono } from "hono";

export const commonRoute = new Hono();

commonRoute.get("/", (c) => {
  return c.json({
    title: "ToyBox API",
    message: "Welcome to the ToyBox API! Explore our collection of toys.",
    description:
      "This API provides access to a variety of toys, including details such as categories, brands, prices, and age ranges. Use the /toys endpoint to browse all toys or /toys/:slug to get information about a specific toy.",
  });
});
