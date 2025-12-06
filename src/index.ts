import { Hono } from "hono";
import { logger } from "hono/logger";
import { toyRoute } from "./modules/toy/route";
import { commonRoute } from "./modules/common/common";

const app = new Hono();

app.use(logger());

app.route("/", commonRoute);

app.route("/toys", toyRoute);

export default app;
