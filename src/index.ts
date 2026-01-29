import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { toyRoute } from "./modules/toy/route";
import { categoryRoute } from "./modules/category/route";
import { brandRoute } from "./modules/brand/route";
import { Scalar } from "@scalar/hono-api-reference";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();

app.use(logger());
app.use("/", cors());

app.route("/toys", toyRoute);
app.route("/categories", categoryRoute);
app.route("/brands", brandRoute);

// OpenAPI Documentation Route
app.doc("/openapi.json", {
  openapi: "3.0.3",
  info: {
    version: "1.0.0",
    title: "ToyBox API",
    description: "API documentation for the ToyBox application",
  },
});

app.get("/", Scalar({ url: "/openapi.json" }));

export default app;
