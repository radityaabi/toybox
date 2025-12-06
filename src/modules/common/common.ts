import { Hono } from "hono";
import { toysData } from "./data";

export const commonRoute = new Hono();

commonRoute.get("/", (c) => {
  return c.json(toysData);
});
