import { Hono } from "hono";
import { toysData } from "../toy/data";

export const commonRoute = new Hono();

commonRoute.get("/", (c) => {
  return c.json(toysData);
});
